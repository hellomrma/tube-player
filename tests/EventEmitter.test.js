import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '../src/core/EventEmitter.js';

describe('EventEmitter', () => {
  it('on/emit: 리스너 등록 후 이벤트 수신', () => {
    const ee = new EventEmitter();
    const fn = vi.fn();
    ee.on('test', fn);
    ee.emit('test', 42);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it('emit: 등록된 리스너 없으면 오류 없음', () => {
    const ee = new EventEmitter();
    expect(() => ee.emit('nothing')).not.toThrow();
  });

  it('off: 특정 리스너 제거', () => {
    const ee = new EventEmitter();
    const fn = vi.fn();
    ee.on('test', fn);
    ee.off('test', fn);
    ee.emit('test');
    expect(fn).not.toHaveBeenCalled();
  });

  it('off: fn 없이 호출하면 이벤트 전체 제거', () => {
    const ee = new EventEmitter();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    ee.on('test', fn1);
    ee.on('test', fn2);
    ee.off('test');
    ee.emit('test');
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  it('once: 한 번만 호출됨', () => {
    const ee = new EventEmitter();
    const fn = vi.fn();
    ee.once('test', fn);
    ee.emit('test');
    ee.emit('test');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('on: 동일 이벤트에 여러 리스너 등록', () => {
    const ee = new EventEmitter();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    ee.on('test', fn1);
    ee.on('test', fn2);
    ee.emit('test', 'arg');
    expect(fn1).toHaveBeenCalledWith('arg');
    expect(fn2).toHaveBeenCalledWith('arg');
  });

  it('removeAllListeners: 모든 이벤트 제거', () => {
    const ee = new EventEmitter();
    const fn = vi.fn();
    ee.on('a', fn);
    ee.on('b', fn);
    ee.removeAllListeners();
    ee.emit('a');
    ee.emit('b');
    expect(fn).not.toHaveBeenCalled();
  });

  it('on: 메서드 체이닝 지원', () => {
    const ee = new EventEmitter();
    expect(ee.on('test', () => {})).toBe(ee);
  });
});
