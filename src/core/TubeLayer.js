import { EventEmitter } from './EventEmitter.js';

const STATES = {
  IDLE: 'idle',
  OPENING: 'opening',
  ACTIVE: 'active',
  CLOSING: 'closing',
};

const ANIMATION_DURATION = 300;

export class TubeLayer extends EventEmitter {
  /**
   * @param {string} id - 레이어 고유 ID
   * @param {object} options
   * @param {boolean} [options.closeOnDim=true]
   * @param {boolean} [options.closeOnEsc=true]
   * @param {string} [options.animation='fade'] - 'fade' | 'slide' | 'zoom'
   * @param {Function} [options.onOpen]
   * @param {Function} [options.onClose]
   */
  constructor(id, options = {}) {
    super();
    this.id = id;
    this.options = {
      closeOnDim: true,
      closeOnEsc: true,
      animation: 'fade',
      ...options,
    };
    this.state = STATES.IDLE;
    this.el = null;
    this._contentsEl = null;
    this._previousFocus = null;
    this._boundKeydown = this._onKeydown.bind(this);

    if (this.options.onOpen) this.on('layer:open', this.options.onOpen);
    if (this.options.onClose) this.on('layer:close', this.options.onClose);

    this._create();
  }

  _create() {
    // 기존 DOM에 이미 존재하면 재사용
    const existing = document.querySelector(`[data-tube-id="${this.id}"]`);
    if (existing) {
      this.el = existing;
      this._contentsEl = existing.querySelector('.tube-layer__contents');
      this._bindDomEvents();
      return;
    }

    const layer = document.createElement('div');
    layer.className = `tube-layer tube-layer--${this.options.animation}`;
    layer.setAttribute('data-tube-id', this.id);
    layer.setAttribute('data-tube-state', STATES.IDLE);
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-label', this.id);

    layer.innerHTML = `
      <div class="tube-layer__dim"></div>
      <div class="tube-layer__contents-wrap" tabindex="-1">
        <button class="tube-layer__close" aria-label="닫기">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="tube-layer__contents"></div>
      </div>
    `;

    document.body.appendChild(layer);
    this.el = layer;
    this._contentsEl = layer.querySelector('.tube-layer__contents');
    this._bindDomEvents();
  }

  _bindDomEvents() {
    const closeBtn = this.el.querySelector('.tube-layer__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.options.closeOnDim) {
      const dim = this.el.querySelector('.tube-layer__dim');
      if (dim) {
        dim.addEventListener('click', () => this.close());
      }
    }
  }

  _onKeydown(e) {
    if (e.key === 'Escape' && this.options.closeOnEsc) {
      e.preventDefault();
      this.close();
      return;
    }

    // 포커스 트랩
    if (e.key === 'Tab') {
      const focusable = this.el.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  get contentsEl() {
    return this._contentsEl;
  }

  open() {
    if (this.state === STATES.ACTIVE || this.state === STATES.OPENING) return this;

    this._previousFocus = document.activeElement;
    this.state = STATES.OPENING;
    this.el.setAttribute('data-tube-state', STATES.OPENING);

    // body 스크롤 잠금
    document.body.style.overflow = 'hidden';

    // 키보드 이벤트
    document.addEventListener('keydown', this._boundKeydown);

    // 트랜지션 후 active 상태로 전환
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.el.setAttribute('data-tube-state', STATES.ACTIVE);
        this.state = STATES.ACTIVE;

        // 포커스 이동
        const wrap = this.el.querySelector('.tube-layer__contents-wrap');
        if (wrap) wrap.focus();

        this.emit('layer:open');
      });
    });

    return this;
  }

  close() {
    if (this.state === STATES.IDLE || this.state === STATES.CLOSING) return this;

    this.state = STATES.CLOSING;
    this.el.setAttribute('data-tube-state', STATES.CLOSING);

    setTimeout(() => {
      this.state = STATES.IDLE;
      this.el.setAttribute('data-tube-state', STATES.IDLE);

      document.body.style.overflow = '';
      document.removeEventListener('keydown', this._boundKeydown);

      // 포커스 복원
      if (this._previousFocus && this._previousFocus.focus) {
        this._previousFocus.focus();
      }

      this.emit('layer:close');
    }, ANIMATION_DURATION);

    return this;
  }

  toggle() {
    return this.state === STATES.ACTIVE ? this.close() : this.open();
  }

  destroy() {
    this.close();
    setTimeout(() => {
      document.removeEventListener('keydown', this._boundKeydown);
      if (this.el && this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
      this.removeAllListeners();
      this.el = null;
      this._contentsEl = null;
    }, ANIMATION_DURATION + 50);
  }

  isActive() {
    return this.state === STATES.ACTIVE;
  }
}
