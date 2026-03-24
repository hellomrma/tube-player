const ICON_YT = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21.8 8.001a2.749 2.749 0 0 0-1.935-1.946C18.167 5.5 12 5.5 12 5.5s-6.167 0-7.865.555A2.749 2.749 0 0 0 2.2 8.001 28.84 28.84 0 0 0 1.75 12a28.84 28.84 0 0 0 .45 3.999 2.749 2.749 0 0 0 1.935 1.946C5.833 18.5 12 18.5 12 18.5s6.167 0 7.865-.555a2.749 2.749 0 0 0 1.935-1.946A28.84 28.84 0 0 0 22.25 12a28.84 28.84 0 0 0-.45-3.999zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>`;

export class YouTubeLink {
  constructor(player) {
    this._player = player;
    this._el = null;
  }

  mount(container) {
    this._el = document.createElement('a');
    this._el.className = 'tube-control tube-control--youtube-link';
    this._el.setAttribute('aria-label', 'YouTube에서 보기');
    this._el.setAttribute('href', `https://www.youtube.com/watch?v=${this._player.videoId}`);
    this._el.setAttribute('target', '_blank');
    this._el.setAttribute('rel', 'noopener noreferrer');
    this._el.innerHTML = ICON_YT;

    container.appendChild(this._el);
  }

  destroy() {
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
  }
}
