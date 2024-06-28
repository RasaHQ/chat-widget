Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => '3edc172c-c2f6-4211-bfbc-c3a84d190cac',
  },
});
class MutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.targets = [];
  }

  observe(target, options) {
    this.targets.push(target);
  }

  disconnect() {
    this.targets = [];
  }

  takeRecords() {
    return [];
  }

  trigger(records) {
    this.callback(records, this);
  }
}

global.MutationObserver = MutationObserver;
