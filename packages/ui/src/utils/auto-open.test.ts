import { WIDGET_OPENED_STORAGE_KEY, markWidgetOpened, wasWidgetOpenedThisSession } from './auto-open';

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
};

describe('widget opened session flag', () => {
  it('is not set by default', () => {
    expect(wasWidgetOpenedThisSession(memoryStorage())).toBe(false);
  });

  it('remembers that the widget was opened', () => {
    const storage = memoryStorage();
    markWidgetOpened(storage);
    expect(storage.getItem(WIDGET_OPENED_STORAGE_KEY)).toBe('true');
    expect(wasWidgetOpenedThisSession(storage)).toBe(true);
  });

  it('is not set when storage is unavailable', () => {
    expect(wasWidgetOpenedThisSession(null)).toBe(false);
    expect(() => markWidgetOpened(null)).not.toThrow();
  });

  it('is not set when storage throws', () => {
    const storage = {
      getItem: (): string | null => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(wasWidgetOpenedThisSession(storage)).toBe(false);
    expect(() => markWidgetOpened(storage)).not.toThrow();
  });
});
