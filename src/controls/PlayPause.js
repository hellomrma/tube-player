const ICON_PLAY = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>`;
const ICON_PAUSE = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="5" y="4" width="4" height="16"/><rect x="15" y="4" width="4" height="16"/></svg>`;

export class PlayPause {
  constructor(player) {
    this._player = player;
    this._el = null;
    this._isPlaying = false;

    this._onStateChange = this._onStateChange.bind(this);
    this._player.on('video:statechange', this._onStateChange);
  }

  mount(container) {
    this._el = document.createElement('button');
    this._el.className = 'tube-control tube-control--play';
    this._el.setAttribute('aria-label', '재생');
    this._el.innerHTML = ICON_PLAY;

    this._el.addEventListener('click', () => {
      if (this._isPlaying) {
        this._player.pause();
      } else {
        this._player.play();
      }
    });

    container.appendChild(this._el);
  }

  _onStateChange(state) {
    this._isPlaying = state === 'playing';
    if (!this._el) return;
    this._el.innerHTML = this._isPlaying ? ICON_PAUSE : ICON_PLAY;
    this._el.setAttribute('aria-label', this._isPlaying ? '일시정지' : '재생');
  }

  destroy() {
    this._player.off('video:statechange', this._onStateChange);
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}
