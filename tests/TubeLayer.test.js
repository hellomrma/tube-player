import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TubeLayer } from '../src/core/TubeLayer.js';

describe('TubeLayer', () => {
  let layer;

  beforeEach(() => {
    document.body.innerHTML = '';
    layer = new TubeLayer('test-layer', { animation: 'fade' });
  });

  afterEach(() => {
    layer.destroy();
    document.body.innerHTML = '';
  });

  it('생성 시 DOM에 레이어 엘리먼트가 추가됨', () => {
    expect(document.querySelector('[data-tube-id="test-layer"]')).not.toBeNull();
  });

  it('초기 상태는 idle', () => {
    expect(layer.isActive()).toBe(false);
  });

  it('open() 호출 후 active 상태로 전환', async () => {
    const openFn = vi.fn();
    layer.on('layer:open', openFn);
    layer.open();
    // double rAF 기다림
    await new Promise((r) => setTimeout(r, 50));
    expect(layer.isActive()).toBe(true);
    expect(openFn).toHaveBeenCalledTimes(1);
  });

  it('open() 중복 호출 무시', async () => {
    const openFn = vi.fn();
    layer.on('layer:open', openFn);
    layer.open();
    layer.open();
    await new Promise((r) => setTimeout(r, 50));
    expect(openFn).toHaveBeenCalledTimes(1);
  });

  it('close() 호출 후 idle 상태로 전환', async () => {
    layer.open();
    await new Promise((r) => setTimeout(r, 50));
    const closeFn = vi.fn();
    layer.on('layer:close', closeFn);
    layer.close();
    await new Promise((r) => setTimeout(r, 400));
    expect(layer.isActive()).toBe(false);
    expect(closeFn).toHaveBeenCalledTimes(1);
  });

  it('close() idle 상태에서 호출 시 무시', () => {
    const closeFn = vi.fn();
    layer.on('layer:close', closeFn);
    layer.close();
    expect(closeFn).not.toHaveBeenCalled();
  });

  it('contentsEl getter가 .tube-layer__contents 반환', () => {
    expect(layer.contentsEl).not.toBeNull();
    expect(layer.contentsEl.className).toContain('tube-layer__contents');
  });

  it('closeOnEsc: Escape 키로 닫힘', async () => {
    layer.open();
    await new Promise((r) => setTimeout(r, 50));
    const closeFn = vi.fn();
    layer.on('layer:close', closeFn);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await new Promise((r) => setTimeout(r, 400));
    expect(closeFn).toHaveBeenCalled();
  });

  it('closeOnEsc: false이면 Escape로 닫히지 않음', async () => {
    const l = new TubeLayer('no-esc', { closeOnEsc: false });
    l.open();
    await new Promise((r) => setTimeout(r, 50));
    const closeFn = vi.fn();
    l.on('layer:close', closeFn);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await new Promise((r) => setTimeout(r, 50));
    expect(closeFn).not.toHaveBeenCalled();
    l.destroy();
  });
});
