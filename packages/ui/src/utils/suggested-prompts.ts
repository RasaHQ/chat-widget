/** Normalizes the `suggestedPrompts` prop, which can arrive as an attribute string. */
export const parseSuggestedPrompts = (value: string[] | string | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  const trimmed = value.trim();
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch (_e) {
      // fall through to comma separated parsing
    }
  }
  return trimmed
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};
