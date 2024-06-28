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
