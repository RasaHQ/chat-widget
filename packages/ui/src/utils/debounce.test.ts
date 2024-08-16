import { debounce } from './debounce';

describe('debounce', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('calls the function only once after the specified time', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 500);

    debouncedFn();
    debouncedFn();
    debouncedFn();
    jest.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls the function with the correct arguments', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 500);

    debouncedFn('test', 123);
    jest.runAllTimers();

    expect(fn).toHaveBeenCalledWith('test', 123);
  });

  it('uses the correct "this" context', () => {
    const fn = jest.fn();
    const context = { value: 'context' };
    const debouncedFn = debounce(fn, 500);

    debouncedFn.call(context);
    jest.runAllTimers();

    expect(fn.mock.instances[0]).toBe(context);
  });

  it('uses the default delay if none is provided', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn);

    debouncedFn();

    jest.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
