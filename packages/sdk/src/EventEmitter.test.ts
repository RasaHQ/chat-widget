/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  let eventEmitter: EventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  it('should register event listeners with on method', () => {
    const connectCallback = jest.fn();
    eventEmitter.on('connect', connectCallback);

    // @ts-ignore-next-line
    eventEmitter.trigger('connect');

    expect(connectCallback).toHaveBeenCalled();
  });

  it('should pass arguments to event listeners', () => {
    const messageCallback = jest.fn((_data: unknown) => {});
    eventEmitter.on('message', messageCallback);

    const testData = { message: 'test' };
    // @ts-ignore-next-line
    eventEmitter.trigger('message', testData);

    expect(messageCallback).toHaveBeenCalledWith(testData);
  });

  it('should handle multiple listeners for the same event', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    eventEmitter.on('message', callback1);
    eventEmitter.on('message', callback2);

    const testData = { message: 'test' };
    // @ts-ignore-next-line
    eventEmitter.trigger('message', testData);

    expect(callback1).toHaveBeenCalledWith(testData);
    expect(callback2).toHaveBeenCalledWith(testData);
  });
});
