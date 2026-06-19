import { CsatMessage, MESSAGE_TYPES, Message, QuickReplyMessage } from '@rasahq/chat-widget-sdk';

/**
 * sessionStorage key used to remember which CSAT prompt the user has already
 * answered. The value is a stable content hash of the prompt - not just a
 * boolean - so that a server-side replay of the same message after a refresh
 * is correctly recognised as already-answered, instead of being treated as a
 * fresh ask that re-opens the thumbs popup.
 */
export const CSAT_ANSWERED_HASH_STORAGE_KEY = 'rasa-csat-answered-hash';

export type CsatLikeMessage = CsatMessage | QuickReplyMessage;

export interface CsatPayloads {
  satisfied?: string;
  unsatisfied?: string;
}

/**
 * Inspects a buttons message and returns the CSAT option payloads when it is
 * a satisfaction request. Returns null when the message is a normal
 * quick-reply (i.e. its button text/payloads do not match the `satisfied` /
 * `unsatisfied` vocabulary).
 *
 * Pure function so we can unit-test the heuristic in isolation.
 */
export function detectCsatButtons(message: QuickReplyMessage): CsatPayloads | null {
  if (!message?.replies?.length) {
    return null;
  }

  let satisfiedPayload: string | undefined;
  let unsatisfiedPayload: string | undefined;
  for (const reply of message.replies) {
    const payload = reply.reply || '';
    const haystack = `${payload} ${reply.text || ''}`.toLowerCase();
    // Order matters: check the negative case first so "not satisfied" /
    // "unsatisfied" / "dissatisfied" don't get caught by the "satisfied" check.
    if (/unsatisf|dissatisf|not[_\s-]?satisf|negative/.test(haystack)) {
      unsatisfiedPayload = payload;
    } else if (/satisf|positive/.test(haystack)) {
      satisfiedPayload = payload;
    }
  }

  if (!satisfiedPayload && !unsatisfiedPayload) {
    return null;
  }

  return { satisfied: satisfiedPayload, unsatisfied: unsatisfiedPayload };
}

/**
 * Produces a stable content hash for a CSAT prompt that is robust to the
 * non-stable fields that vary between a fresh push and a server replay
 * (timestamps, sender, etc.). Two CSAT prompts with the same question and
 * the same option vocabulary will hash identically.
 */
export function getCsatMessageHash(message: CsatLikeMessage): string {
  const anyMessage = message as Partial<CsatMessage> & Partial<QuickReplyMessage>;
  const question = anyMessage.question || anyMessage.text || '';
  const options = anyMessage.options?.map(o => ({ value: o.value, payload: o.payload }));
  const replies = anyMessage.replies?.map(r => ({ text: r.text, reply: r.reply }));
  return JSON.stringify({ question, options, replies });
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getStorage(): StorageLike | null {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Returns true iff the provided CSAT prompt has already been answered in the
 * current browser tab (sessionStorage). The hash comparison means a server
 * replay of the same prompt after a page refresh is treated as
 * "already answered", which fixes the bug where the popup briefly re-appeared
 * after rating + refresh.
 */
export function isCsatAnsweredFor(message: CsatLikeMessage, storage: StorageLike | null = getStorage()): boolean {
  if (!storage) return false;
  try {
    const storedHash = storage.getItem(CSAT_ANSWERED_HASH_STORAGE_KEY);
    if (!storedHash) return false;
    return storedHash === getCsatMessageHash(message);
  } catch {
    return false;
  }
}

export function markCsatAnswered(message: CsatLikeMessage, storage: StorageLike | null = getStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(CSAT_ANSWERED_HASH_STORAGE_KEY, getCsatMessageHash(message));
  } catch {
    // sessionStorage may be unavailable (e.g. Safari private mode).
  }
}

export function clearCsatAnswered(storage: StorageLike | null = getStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(CSAT_ANSWERED_HASH_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

/**
 * Returns the index of the last non-divider message, or -1 when the history
 * only contains dividers (or is empty). Session dividers are transparent for
 * "is the popup still pending?" purposes because every page refresh appends
 * a new (often empty) session entry, which would otherwise push real bot
 * turns out of the "last message" slot from the second refresh onwards.
 */
export function findLastContentIndex(history: Message[]): number {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].type !== MESSAGE_TYPES.SESSION_DIVIDER) {
      return i;
    }
  }
  return -1;
}
