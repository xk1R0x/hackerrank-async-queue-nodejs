const EventEmitter = require('events');

class AsyncQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.currentInterval = 250;
    this.intervalId = null;
    this.event = {};
    this.isPause = false;
  }

  enqueue(item) {
    this.queue.push(item);
    this.emit('enqueued', item);
  }
  
  peek() {
    if (!this.isPause && this.queue.length > 0) {
      let value = this.queue.shift();
      this.emit('dequeued', value)
      return value;
    }
  }
  
  print() {
    return this.queue;
  }

  interval(value) {
    clearInterval(this.intervalId);
    this.currentInterval = value;
    this.intiIntervalId();
  }

  intiIntervalId() {
    this.intervalId = setInterval(() => {
      this.peek()
    }, this.currentInterval);
  }

  getCurrentInterval() {
    return this.currentInterval;
  }

  start() {
    this.isPause = false;
    this.intiIntervalId();
  }

  pause() {
    this.isPause = true;
  }

  on(eventName, listener) {
    if (!this.event[eventName]) {
        this.event[eventName] = [];
    }
    return this.event[eventName].push(listener);
  }

  emit(eventName, data) {
    if (eventName === 'interval') this.interval(data);
    if (!this.event[eventName]) {
        return;
    }
    this.event[eventName].forEach((cb) => {
        cb(data);
    });
  }
}

module.exports = AsyncQueue;