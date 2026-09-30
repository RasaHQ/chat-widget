import { parseSuggestedPrompts } from './suggested-prompts';

describe('parseSuggestedPrompts', () => {
  it('returns an empty list for empty input', () => {
    expect(parseSuggestedPrompts(undefined)).toEqual([]);
    expect(parseSuggestedPrompts('')).toEqual([]);
    expect(parseSuggestedPrompts([])).toEqual([]);
  });

  it('accepts arrays', () => {
    expect(parseSuggestedPrompts(['Pricing', '', 'Support'])).toEqual(['Pricing', 'Support']);
  });

  it('parses JSON array strings', () => {
    expect(parseSuggestedPrompts('["Track my order", "Talk to a human"]')).toEqual(['Track my order', 'Talk to a human']);
  });

  it('parses comma separated strings', () => {
    expect(parseSuggestedPrompts('Pricing, Support ,Docs')).toEqual(['Pricing', 'Support', 'Docs']);
  });

  it('falls back to comma parsing for malformed JSON', () => {
    expect(parseSuggestedPrompts('[oops, two')).toEqual(['[oops', 'two']);
  });
});
