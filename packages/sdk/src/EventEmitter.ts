interface EventMap {
  connect: () => void;
  disconnect: () => void;
  message: (data: unknown) => void;
  loadHistory: (data: unknown) => void;
  sessionConfirm: () => void;
}

type EventCallback<T extends keyof EventMap> = EventMap[T];

export class EventEmitter {
  private events: { [K in keyof EventMap]?: EventCallback<K>[] } = {};

  public on<K extends keyof EventMap>(
    eventName: K,
    callback: EventCallback<K>
  ): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName]!.push(callback);
  }

  protected trigger<K extends keyof EventMap>(
    eventName: K,
    ...args: Parameters<EventCallback<K>>
  ): void {
    if (this.events[eventName]) {
      this.events[eventName]!.forEach((callback) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return callback(...args);
      });
    }
  }
}
