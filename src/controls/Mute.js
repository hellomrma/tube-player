const ICON_VOLUME = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><path d="M19 12c0 2.97-1.65 5.54-4 6.71v2.06c3.45-1.28 6-4.58 6-8.77s-2.55-7.49-6-8.77v2.06c2.35 1.17 4 3.74 4 6.71z"/></svg>`;
const ICON_MUTED = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/></svg>`;

export class Mute {
  constructor(player) {
    this._player = player;
    this._el = null;
    this._muted = false;

    this._onMute = this._onMute.bind(this);
    this._player.on('video:mute', this._onMute);
  }

  mount(container) {
    this._el = document.createElement('button');
    this._el.className = 'tube-control tube-control--mute';
    this._el.setAttribute('aria-label', '음소거');
    this._el.innerHTML = ICON_VOLUME;

    this._el.addEventListener('click', () => {
      if (this._player.isMuted()) {
        this._player.unmute();
      } else {
        this._player.mute();
      }
    });

    container.appendChild(this._el);
  }

  _onMute(isMuted) {
    this._muted = isMuted;
    if (!this._el) return;
    this._el.innerHTML = isMuted ? ICON_MUTED : ICON_VOLUME;
    this._el.setAttribute('aria-label', isMuted ? '음소거 해제' : '음소거');
  }

  destroy() {
    this._player.off('video:mute', this._onMute);
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}
