import { isMobile } from "./isMobile";
import { MD_BREAKPOINT } from "../constants/brakepoints";

describe('isMobile', () => {
  const originalScreenWidth = window.screen.width;

  beforeEach(() => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: originalScreenWidth }
    });
  });

  it('should return true when screen width is less than MD_BREAKPOINT', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: MD_BREAKPOINT - 1 }
    });

    expect(isMobile()).toBe(true);
  });

  it('should return false when screen width is equal to MD_BREAKPOINT', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: MD_BREAKPOINT }
    });

    expect(isMobile()).toBe(false);
  });

  it('should return false when screen width is greater than MD_BREAKPOINT', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: MD_BREAKPOINT + 1 }
    });

    expect(isMobile()).toBe(false);
  });
});
