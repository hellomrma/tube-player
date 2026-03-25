const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export class Speed {
  constructor(player) {
    this._player = player;
    this._el = null;
    this._currentSpeed = 1;
  }

  mount(container) {
    this._el = document.createElement('button');
    this._el.className = 'tube-control tube-control--speed';
    this._el.setAttribute('aria-label', '재생 속도');
    this._el.textContent = '1×';

    this._el.addEventListener('click', () => {
      const idx = SPEEDS.indexOf(this._currentSpeed);
      const next = SPEEDS[(idx + 1) % SPEEDS.length];
      this._setSpeed(next);
    });

    container.appendChild(this._el);
  }

  _setSpeed(rate) {
    this._currentSpeed = rate;
    if (this._player._ytPlayer) {
      this._player._ytPlayer.setPlaybackRate(rate);
    }
    this._el.textContent = `${rate}×`;
  }

  destroy() {
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}
