const ICON_ENTER = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
const ICON_EXIT = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;

export class Fullscreen {
  constructor(player) {
    this._player = player;
    this._el = null;
    this._isFullscreen = false;

    this._onFullscreenChange = this._onFullscreenChange.bind(this);
    document.addEventListener('fullscreenchange', this._onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this._onFullscreenChange);
  }

  mount(container) {
    this._el = document.createElement('button');
    this._el.className = 'tube-control tube-control--fullscreen';
    this._el.setAttribute('aria-label', '전체화면');
    this._el.innerHTML = ICON_ENTER;

    this._el.addEventListener('click', () => this._toggle());

    container.appendChild(this._el);
  }

  _toggle() {
    const containerEl = this._player.getContainerEl();
    if (!containerEl) return;

    if (this._isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else {
      if (containerEl.requestFullscreen) {
        containerEl.requestFullscreen();
      } else if (containerEl.webkitRequestFullscreen) {
        containerEl.webkitRequestFullscreen();
      }
    }
  }

  _onFullscreenChange() {
    this._isFullscreen = !!document.fullscreenElement || !!document.webkitFullscreenElement;
    if (!this._el) return;
    this._el.innerHTML = this._isFullscreen ? ICON_EXIT : ICON_ENTER;
    this._el.setAttribute('aria-label', this._isFullscreen ? '전체화면 종료' : '전체화면');
  }

  destroy() {
    document.removeEventListener('fullscreenchange', this._onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this._onFullscreenChange);
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}
