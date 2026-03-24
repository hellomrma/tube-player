export class ProgressBar {
  constructor(player) {
    this._player = player;
    this._el = null;
    this._fill = null;
    this._thumb = null;
    this._isDragging = false;

    this._onProgress = this._onProgress.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this._player.on('video:progress', this._onProgress);
  }

  mount(container) {
    this._el = document.createElement('div');
    this._el.className = 'tube-control tube-control--progress';
    this._el.setAttribute('role', 'slider');
    this._el.setAttribute('aria-label', '재생 위치');
    this._el.setAttribute('aria-valuemin', '0');
    this._el.setAttribute('aria-valuemax', '100');
    this._el.setAttribute('aria-valuenow', '0');
    this._el.setAttribute('tabindex', '0');

    this._el.innerHTML = `
      <div class="tube-progress__track">
        <div class="tube-progress__fill"></div>
        <div class="tube-progress__thumb"></div>
      </div>
    `;

    this._fill = this._el.querySelector('.tube-progress__fill');
    this._thumb = this._el.querySelector('.tube-progress__thumb');

    this._el.addEventListener('mousedown', this._onMouseDown);
    this._el.addEventListener('touchstart', this._onMouseDown, { passive: false });

    // 키보드: 좌우 화살표 5초 이동
    this._el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const t = this._player.getCurrentTime();
        this._player.seek(Math.max(0, t - 5));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const t = this._player.getCurrentTime();
        this._player.seek(Math.min(this._player.getDuration(), t + 5));
      }
    });

    container.appendChild(this._el);
  }

  _onProgress({ percent }) {
    if (this._isDragging) return;
    this._update(percent);
  }

  _update(percent) {
    if (!this._fill) return;
    const clamped = Math.min(100, Math.max(0, percent));
    this._fill.style.width = `${clamped}%`;
    this._thumb.style.left = `${clamped}%`;
    this._el.setAttribute('aria-valuenow', Math.round(clamped));
  }

  _getPercent(e) {
    const rect = this._el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  _onMouseDown(e) {
    e.preventDefault();
    this._isDragging = true;
    this._el.classList.add('is-dragging');

    const percent = this._getPercent(e);
    this._update(percent);

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('touchmove', this._onMouseMove, { passive: false });
    document.addEventListener('touchend', this._onMouseUp);
  }

  _onMouseMove(e) {
    if (!this._isDragging) return;
    e.preventDefault();
    const percent = this._getPercent(e);
    this._update(percent);
  }

  _onMouseUp(e) {
    if (!this._isDragging) return;
    this._isDragging = false;
    this._el.classList.remove('is-dragging');

    const percent = this._getPercent(e.changedTouches ? e.changedTouches[0] : e);
    const duration = this._player.getDuration();
    const seekTime = (percent / 100) * duration;
    this._player.seek(seekTime);

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('touchmove', this._onMouseMove);
    document.removeEventListener('touchend', this._onMouseUp);
  }

  destroy() {
    this._player.off('video:progress', this._onProgress);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}
