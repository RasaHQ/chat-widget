/**
 * sessionStorage key set once the chat has been opened in this browser tab,
 * either by `autoOpen` or by the user. While it is present, `autoOpen` does not
 * open the chat again, e.g. when the user navigates back to a page that has it.
 * The key is cleared when the tab closes, so the next visit auto-opens as usual.
 */
export const WIDGET_OPENED_STORAGE_KEY = 'rasa-widget-opened';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function getStorage(): StorageLike | null {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage;
  } catch {
    return null;
  }
}

export function wasWidgetOpenedThisSession(storage: StorageLike | null = getStorage()): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(WIDGET_OPENED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markWidgetOpened(storage: StorageLike | null = getStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(WIDGET_OPENED_STORAGE_KEY, 'true');
  } catch {
    // sessionStorage may be unavailable (e.g. Safari private mode).
  }
}
