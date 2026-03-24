export class Volume {
  constructor(player) {
    this._player = player;
    this._el = null;
    this._fill = null;
    this._thumb = null;
    this._isDragging = false;
    this._lastVolume = 100;

    this._onMute = this._onMute.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this._player.on('video:mute', this._onMute);
  }

  mount(container) {
    this._el = document.createElement('div');
    this._el.className = 'tube-control tube-control--volume';
    this._el.setAttribute('role', 'slider');
    this._el.setAttribute('aria-label', '볼륨');
    this._el.setAttribute('aria-valuemin', '0');
    this._el.setAttribute('aria-valuemax', '100');
    this._el.setAttribute('aria-valuenow', '100');
    this._el.setAttribute('tabindex', '0');

    this._el.innerHTML = `
      <div class="tube-volume__track">
        <div class="tube-volume__fill"></div>
        <div class="tube-volume__thumb"></div>
      </div>
    `;

    this._fill = this._el.querySelector('.tube-volume__fill');
    this._thumb = this._el.querySelector('.tube-volume__thumb');

    this._el.addEventListener('mousedown', this._onMouseDown);
    this._el.addEventListener('touchstart', this._onMouseDown, { passive: false });

    this._el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        this._setVolume(Math.max(0, this._player.getVolume() - 5));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        this._setVolume(Math.min(100, this._player.getVolume() + 5));
      }
    });

    this._update(this._player.isMuted() ? 0 : this._player.getVolume());
    container.appendChild(this._el);
  }

  _onMute(muted) {
    if (muted) {
      this._lastVolume = this._player.getVolume() || this._lastVolume;
      this._update(0);
    } else {
      this._update(this._lastVolume);
    }
  }

  _update(volume) {
    if (!this._fill) return;
    const clamped = Math.min(100, Math.max(0, volume));
    this._fill.style.width = `${clamped}%`;
    this._thumb.style.left = `${clamped}%`;
    this._el.setAttribute('aria-valuenow', Math.round(clamped));
  }

  _getPercent(e) {
    const rect = this._el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  _setVolume(vol) {
    const clamped = Math.min(100, Math.max(0, vol));
    this._lastVolume = clamped;
    this._player.setVolume(clamped);
    if (this._player.isMuted() && clamped > 0) {
      this._player.unmute();
    }
    this._update(clamped);
  }

  _onMouseDown(e) {
    e.preventDefault();
    this._isDragging = true;
    this._el.classList.add('is-dragging');
    this._setVolume(this._getPercent(e));

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('touchmove', this._onMouseMove, { passive: false });
    document.addEventListener('touchend', this._onMouseUp);
  }

  _onMouseMove(e) {
    if (!this._isDragging) return;
    e.preventDefault();
    this._setVolume(this._getPercent(e));
  }

  _onMouseUp(e) {
    if (!this._isDragging) return;
    this._isDragging = false;
    this._el.classList.remove('is-dragging');
    this._setVolume(this._getPercent(e.changedTouches ? e.changedTouches[0] : e));

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('touchmove', this._onMouseMove);
    document.removeEventListener('touchend', this._onMouseUp);
  }

  destroy() {
    this._player.off('video:mute', this._onMute);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('touchmove', this._onMouseMove);
    document.removeEventListener('touchend', this._onMouseUp);
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}
