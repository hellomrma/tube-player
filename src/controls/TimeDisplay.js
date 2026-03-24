function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export class TimeDisplay {
  constructor(player) {
    this._player = player;
    this._el = null;
    this._onProgress = this._onProgress.bind(this);
    this._player.on('video:progress', this._onProgress);
  }

  mount(container) {
    this._el = document.createElement('span');
    this._el.className = 'tube-control tube-control--time';
    this._el.setAttribute('aria-live', 'off');
    this._el.textContent = '0:00 / 0:00';
    container.appendChild(this._el);
  }

  _onProgress({ current, duration }) {
    if (!this._el) return;
    this._el.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  }

  destroy() {
    this._player.off('video:progress', this._onProgress);
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}
