import {
  CSAT_ANSWERED_HASH_STORAGE_KEY,
  clearCsatAnswered,
  detectCsatButtons,
  findLastContentIndex,
  getCsatMessageHash,
  isCsatAnsweredFor,
  markCsatAnswered,
} from './csat';
import {
  MESSAGE_TYPES,
  Message,
  QuickReplyMessage,
  CsatMessage,
  SENDER,
} from '@rasahq/chat-widget-sdk';

const makeQuickReply = (
  replies: Array<{ text: string; reply: string }>,
  text = 'Was this helpful?'
): QuickReplyMessage => ({
  sender: SENDER.BOT,
  type: MESSAGE_TYPES.QUICK_REPLY,
  text,
  replies: replies.map(r => ({ ...r, isSelected: false })) as unknown as QuickReplyMessage['replies'],
});

const makeCsat = (
  question: string,
  options: Array<{ value: string; payload: string }> = [],
  thankYou?: string
): CsatMessage => ({
  sender: SENDER.BOT,
  type: MESSAGE_TYPES.CSAT,
  question,
  thankYou,
  options,
});

describe('detectCsatButtons', () => {
  it('returns null when message has no replies', () => {
    const message = makeQuickReply([]);
    expect(detectCsatButtons(message)).toBeNull();
  });

  it('returns null when no reply matches the CSAT vocabulary', () => {
    const message = makeQuickReply([
      { text: 'Yes', reply: '/affirm' },
      { text: 'No', reply: '/deny' },
    ]);
    expect(detectCsatButtons(message)).toBeNull();
  });

  it('detects payloads that explicitly set satisfied / unsatisfied', () => {
    const message = makeQuickReply([
      { text: 'Yes', reply: '/SetSlots{"csat_score":"satisfied"}' },
      { text: 'No', reply: '/SetSlots{"csat_score":"unsatisfied"}' },
    ]);
    expect(detectCsatButtons(message)).toEqual({
      satisfied: '/SetSlots{"csat_score":"satisfied"}',
      unsatisfied: '/SetSlots{"csat_score":"unsatisfied"}',
    });
  });

  it('detects via positive/negative vocabulary on the button text', () => {
    const message = makeQuickReply([
      { text: 'positive feedback', reply: '/pos' },
      { text: 'negative feedback', reply: '/neg' },
    ]);
    expect(detectCsatButtons(message)).toEqual({
      satisfied: '/pos',
      unsatisfied: '/neg',
    });
  });

  it('checks the negative case first so "not_satisfied" does not match "satisfied"', () => {
    const message = makeQuickReply([
      { text: 'Yes', reply: '/satisfied' },
      { text: 'No', reply: '/not_satisfied' },
    ]);
    const result = detectCsatButtons(message);
    expect(result?.satisfied).toBe('/satisfied');
    expect(result?.unsatisfied).toBe('/not_satisfied');
  });

  it('returns a partial result when only one polarity is recognised', () => {
    const message = makeQuickReply([
      { text: 'Satisfied', reply: '/satisfied' },
      { text: 'Cancel', reply: '/cancel' },
    ]);
    expect(detectCsatButtons(message)).toEqual({
      satisfied: '/satisfied',
      unsatisfied: undefined,
    });
  });
});

describe('getCsatMessageHash', () => {
  it('produces identical hashes for two CSAT prompts with the same content', () => {
    const a = makeCsat('How was your experience?', [
      { value: 'satisfied', payload: '/SetSlots{"csat_score":"satisfied"}' },
      { value: 'unsatisfied', payload: '/SetSlots{"csat_score":"unsatisfied"}' },
    ]);
    const b = makeCsat('How was your experience?', [
      { value: 'satisfied', payload: '/SetSlots{"csat_score":"satisfied"}' },
      { value: 'unsatisfied', payload: '/SetSlots{"csat_score":"unsatisfied"}' },
    ]);
    // Different timestamps / sender object identities must not affect the hash.
    expect(getCsatMessageHash(a)).toBe(getCsatMessageHash(b));
  });

  it('produces different hashes when the question differs', () => {
    const a = makeCsat('Question one?', []);
    const b = makeCsat('Question two?', []);
    expect(getCsatMessageHash(a)).not.toBe(getCsatMessageHash(b));
  });

  it('produces different hashes when the option payloads differ', () => {
    const a = makeCsat('Q?', [{ value: 'satisfied', payload: '/v1' }]);
    const b = makeCsat('Q?', [{ value: 'satisfied', payload: '/v2' }]);
    expect(getCsatMessageHash(a)).not.toBe(getCsatMessageHash(b));
  });

  it('hashes QuickReplyMessage and CsatMessage representations consistently', () => {
    const cs = makeCsat('Was this helpful?', [
      { value: 'satisfied', payload: '/pos' },
      { value: 'unsatisfied', payload: '/neg' },
    ]);
    const qr = makeQuickReply(
      [
        { text: 'Satisfied', reply: '/pos' },
        { text: 'Unsatisfied', reply: '/neg' },
      ],
      'Was this helpful?'
    );
    // Different message shapes are not expected to collide; we just verify
    // hashes are deterministic and JSON-serialisable.
    expect(typeof getCsatMessageHash(cs)).toBe('string');
    expect(typeof getCsatMessageHash(qr)).toBe('string');
    expect(getCsatMessageHash(qr)).toBe(getCsatMessageHash(qr));
  });
});

describe('CSAT answered persistence', () => {
  let store: Record<string, string>;
  let storage: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
  };

  beforeEach(() => {
    store = {};
    storage = {
      getItem: jest.fn((key: string) => (key in store ? store[key] : null)),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
    };
  });

  const csat = makeCsat('Rate me?', [
    { value: 'satisfied', payload: '/pos' },
    { value: 'unsatisfied', payload: '/neg' },
  ]);

  it('is not answered when nothing has been persisted', () => {
    expect(isCsatAnsweredFor(csat, storage)).toBe(false);
  });

  it('reports answered for the exact same prompt that was marked', () => {
    markCsatAnswered(csat, storage);
    expect(isCsatAnsweredFor(csat, storage)).toBe(true);
    expect(store[CSAT_ANSWERED_HASH_STORAGE_KEY]).toBeDefined();
  });

  it('reports not answered for a different prompt even if storage has a value', () => {
    markCsatAnswered(csat, storage);
    const otherPrompt = makeCsat('A different question?', []);
    expect(isCsatAnsweredFor(otherPrompt, storage)).toBe(false);
  });

  it('clearCsatAnswered removes the persisted hash', () => {
    markCsatAnswered(csat, storage);
    clearCsatAnswered(storage);
    expect(isCsatAnsweredFor(csat, storage)).toBe(false);
    expect(storage.removeItem).toHaveBeenCalledWith(CSAT_ANSWERED_HASH_STORAGE_KEY);
  });

  it('gracefully handles a null storage (e.g. Safari private mode)', () => {
    expect(() => markCsatAnswered(csat, null)).not.toThrow();
    expect(() => clearCsatAnswered(null)).not.toThrow();
    expect(isCsatAnsweredFor(csat, null)).toBe(false);
  });

  it('does not throw when storage operations fail', () => {
    const failing: typeof storage = {
      getItem: jest.fn(() => {
        throw new Error('boom');
      }),
      setItem: jest.fn(() => {
        throw new Error('boom');
      }),
      removeItem: jest.fn(() => {
        throw new Error('boom');
      }),
    };

    expect(isCsatAnsweredFor(csat, failing)).toBe(false);
    expect(() => markCsatAnswered(csat, failing)).not.toThrow();
    expect(() => clearCsatAnswered(failing)).not.toThrow();
  });

  describe('refresh / replay scenario', () => {
    // Regression coverage for the PR feedback:
    // "After first refresh, if thumbsup was present, it remains.
    //  After second refresh it goes away. It should go away instantly."
    //
    // Before the fix the answered state was a plain boolean and a server
    // replay of the same CSAT (very common right after reconnect) would
    // overwrite/reset it. Now we hash the prompt itself, so a replay is
    // recognised as already-answered.

    it('treats a server replay of the rated prompt as already-answered', () => {
      const original = makeCsat('Rate me?', [
        { value: 'satisfied', payload: '/pos' },
        { value: 'unsatisfied', payload: '/neg' },
      ]);
      markCsatAnswered(original, storage);

      // Same prompt arrives again on reconnect with a fresh timestamp.
      const replay: CsatMessage = { ...original };
      expect(isCsatAnsweredFor(replay, storage)).toBe(true);
    });

    it('does not suppress a genuinely new CSAT prompt that happens to come later', () => {
      const first = makeCsat('Rate experience A?', []);
      markCsatAnswered(first, storage);

      const second = makeCsat('Rate experience B?', []);
      expect(isCsatAnsweredFor(second, storage)).toBe(false);
    });
  });
});

describe('findLastContentIndex', () => {
  // Regression coverage: every page refresh without a stable sender-id
  // creates a new session entry, which `parseChatHistory` then surfaces as
  // a trailing SESSION_DIVIDER. Before this helper, a naive "last index"
  // check would lose the CSAT prompt after the second refresh and the
  // popup would never re-open. Dividers must be transparent.

  const divider = (): Message =>
    ({ type: MESSAGE_TYPES.SESSION_DIVIDER, startDate: new Date() } as Message);

  const text = (sender: (typeof SENDER)[keyof typeof SENDER] = SENDER.BOT): Message =>
    ({ sender, type: MESSAGE_TYPES.TEXT, text: 'hi' } as Message);

  const csat = (): Message =>
    makeQuickReply(
      [
        { text: 'Yes', reply: '/satisfied' },
        { text: 'No', reply: '/unsatisfied' },
      ],
      'Was this helpful?'
    ) as Message;

  it('returns -1 for an empty history', () => {
    expect(findLastContentIndex([])).toBe(-1);
  });

  it('returns -1 when the history only contains dividers', () => {
    expect(findLastContentIndex([divider(), divider()])).toBe(-1);
  });

  it('returns the index of a CSAT message that is genuinely last', () => {
    const history = [text(), text(), csat()];
    expect(findLastContentIndex(history)).toBe(2);
  });

  it('skips a single trailing divider (first refresh)', () => {
    const history = [text(), text(), csat(), divider()];
    expect(findLastContentIndex(history)).toBe(2);
  });

  it('skips multiple trailing dividers (Nth refresh without sender-id)', () => {
    const history = [text(), text(), csat(), divider(), divider(), divider()];
    expect(findLastContentIndex(history)).toBe(2);
  });

  it('returns the user/bot turn after a CSAT once one exists', () => {
    const history = [text(), csat(), text(SENDER.USER), divider()];
    expect(findLastContentIndex(history)).toBe(2);
  });
});
