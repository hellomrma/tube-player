/**
 * 경량 이벤트 이미터
 */
export class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  on(event, fn) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(fn);
    return this;
  }

  off(event, fn) {
    const fns = this._listeners.get(event);
    if (!fns) return this;
    if (fn) {
      this._listeners.set(
        event,
        fns.filter((f) => f !== fn),
      );
    } else {
      this._listeners.delete(event);
    }
    return this;
  }

  emit(event, ...args) {
    const fns = this._listeners.get(event);
    if (fns) {
      fns.forEach((fn) => fn(...args));
    }
    return this;
  }

  once(event, fn) {
    const wrapper = (...args) => {
      fn(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  removeAllListeners() {
    this._listeners.clear();
    return this;
  }
}
