import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProgressBar } from '../src/controls/ProgressBar.js';

function makeMockPlayer() {
  const ee = { _handlers: {} };
  ee.on = (event, fn) => {
    ee._handlers[event] = ee._handlers[event] || [];
    ee._handlers[event].push(fn);
    return ee;
  };
  ee.off = (event, fn) => {
    if (ee._handlers[event]) {
      ee._handlers[event] = ee._handlers[event].filter((f) => f !== fn);
    }
    return ee;
  };
  ee.emit = (event, data) => {
    (ee._handlers[event] || []).forEach((fn) => fn(data));
  };
  ee.getCurrentTime = vi.fn(() => 30);
  ee.getDuration = vi.fn(() => 100);
  ee.seek = vi.fn();
  return ee;
}

describe('ProgressBar', () => {
  let player;
  let bar;
  let container;

  beforeEach(() => {
    player = makeMockPlayer();
    bar = new ProgressBar(player);
    container = document.createElement('div');
    document.body.appendChild(container);
    bar.mount(container);
  });

  afterEach(() => {
    bar.destroy();
    document.body.innerHTML = '';
  });

  it('mount 후 .tube-control--progress 엘리먼트 생성', () => {
    expect(container.querySelector('.tube-control--progress')).not.toBeNull();
  });

  it('video:progress 이벤트에 따라 fill 너비 업데이트', () => {
    player.emit('video:progress', { percent: 40 });
    const fill = container.querySelector('.tube-progress__fill');
    expect(fill.style.width).toBe('40%');
  });

  it('percent 범위 초과 시 100%로 클램핑', () => {
    player.emit('video:progress', { percent: 150 });
    const fill = container.querySelector('.tube-progress__fill');
    expect(fill.style.width).toBe('100%');
  });

  it('percent 음수 시 0%로 클램핑', () => {
    player.emit('video:progress', { percent: -10 });
    const fill = container.querySelector('.tube-progress__fill');
    expect(fill.style.width).toBe('0%');
  });

  it('destroy 후 document에 mousemove/mouseup/touchmove/touchend 리스너 없음', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    bar.destroy();
    const removed = removeSpy.mock.calls.map((c) => c[0]);
    expect(removed).toContain('mousemove');
    expect(removed).toContain('mouseup');
    expect(removed).toContain('touchmove');
    expect(removed).toContain('touchend');
  });

  it('드래그 중 video:progress 업데이트 무시', () => {
    // mousedown으로 드래그 시작
    const el = container.querySelector('.tube-control--progress');
    el.getBoundingClientRect = () => ({ left: 0, width: 100 });
    el.dispatchEvent(new MouseEvent('mousedown', { clientX: 50, bubbles: true }));
    // 드래그 중 progress 이벤트
    player.emit('video:progress', { percent: 80 });
    const fill = container.querySelector('.tube-progress__fill');
    // 드래그 중이므로 80%가 아니라 mousedown 위치(50%)가 반영됨
    expect(fill.style.width).toBe('50%');
    // 드래그 종료
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 50 }));
  });
});
