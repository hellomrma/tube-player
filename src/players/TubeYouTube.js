import { EventEmitter } from '../core/EventEmitter.js';

const YT_STATES = {
  UNSTARTED: 'unstarted',
  LOADING: 'loading',
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  ENDED: 'ended',
};

// YouTube IFrame API → 내부 상태 매핑
const YT_STATE_MAP = {
  [-1]: YT_STATES.UNSTARTED,
  0: YT_STATES.ENDED,
  1: YT_STATES.PLAYING,
  2: YT_STATES.PAUSED,
  3: YT_STATES.BUFFERING,
  5: YT_STATES.READY, // cued
};

let apiLoadPromise = null;

function loadYouTubeAPI() {
  if (apiLoadPromise) return apiLoadPromise;

  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }

  apiLoadPromise = new Promise((resolve, reject) => {
    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (existingCallback) existingCallback();
      resolve();
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => {
      apiLoadPromise = null;
      reject(new Error('YouTube IFrame API 로드 실패'));
    };
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

export class TubeYouTube extends EventEmitter {
  /**
   * 커스텀 컨트롤 등록 (전역)
   * @param {string} name - data-tube-controls에서 사용할 이름
   * @param {new (player: TubeYouTube) => { mount(container: HTMLElement): void; destroy?(): void }} ControlClass
   */
  static registerControl(name, ControlClass) {
    TubeYouTube._customControls[name] = () => Promise.resolve(ControlClass);
  }

  /**
   * @param {string} videoId - YouTube 비디오 ID
   * @param {object} options
   * @param {boolean} [options.autoplay=true]
   * @param {boolean} [options.muted=false]
   * @param {string} [options.theme='dark']
   * @param {string[]} [options.controls]
   * @param {Function} [options.onReady]
   * @param {Function} [options.onStateChange]
   * @param {Function} [options.onProgress]
   */
  constructor(videoId, options = {}) {
    super();
    this.videoId = videoId;
    this.options = {
      autoplay: true,
      muted: false,
      theme: 'dark',
      controls: ['mute', 'fullscreen'],
      restartOnOpen: true,
      loop: false,
      startTime: 0,
      poster: null,
      ...options,
    };
    this.state = YT_STATES.UNSTARTED;
    this._ytPlayer = null;
    this._progressTimer = null;
    this._containerEl = null;
    this._playerEl = null;
    this._controlsEl = null;
    this._controlInstances = [];
    this._mounted = false;

    if (this.options.onReady) this.on('video:ready', this.options.onReady);
    if (this.options.onStateChange) this.on('video:statechange', this.options.onStateChange);
    if (this.options.onProgress) this.on('video:progress', this.options.onProgress);
  }

  /**
   * 플레이어를 특정 DOM 요소에 마운트한다.
   * @param {HTMLElement} container
   */
  async mount(container) {
    if (this._mounted) return this;
    this._mounted = true;
    this._containerEl = container;

    // 컨테이너 구조 생성
    container.innerHTML = '';
    container.setAttribute('data-tube-theme', this.options.theme);
    container.classList.add('tube-youtube');

    // 플레이어 영역
    const playerWrapper = document.createElement('div');
    playerWrapper.className = 'tube-youtube__player';
    const playerTarget = document.createElement('div');
    playerTarget.id = `tube-yt-${this.videoId}-${Date.now()}`;
    playerWrapper.appendChild(playerTarget);

    // 포스터 — YouTube 썸네일로 iframe을 덮어 일시정지/종료 시 기본 UI 노출 차단
    // maxresdefault → sddefault → hqdefault 순으로 fallback
    this._posterEl = document.createElement('div');
    this._posterEl.className = 'tube-youtube__poster';
    this._setPosterImage();
    playerWrapper.appendChild(this._posterEl);

    // 오버레이 — 항상 최상위에서 마우스 이벤트를 가로채 YouTube hover UI 차단
    // 중앙에 재생/일시정지 아이콘을 표시한다.
    const overlay = document.createElement('div');
    overlay.className = 'tube-youtube__overlay';
    overlay.innerHTML = `
      <button class="tube-youtube__center-btn" aria-label="재생" aria-pressed="false">
        <span class="tube-youtube__center-icon tube-youtube__center-icon--play">
          <svg viewBox="0 0 48 48" width="48" height="48" fill="currentColor"><polygon points="16,10 40,24 16,38"/></svg>
        </span>
        <span class="tube-youtube__center-icon tube-youtube__center-icon--pause">
          <svg viewBox="0 0 48 48" width="48" height="48" fill="currentColor"><rect x="12" y="10" width="8" height="28"/><rect x="28" y="10" width="8" height="28"/></svg>
        </span>
      </button>
    `;
    this._centerBtn = overlay.querySelector('.tube-youtube__center-btn');
    overlay.addEventListener('click', () => {
      if (this.state === YT_STATES.PLAYING) {
        this.pause();
      } else {
        this.play();
      }
    });
    playerWrapper.appendChild(overlay);
    this._overlayEl = overlay;

    container.appendChild(playerWrapper);

    // 컨트롤 영역
    this._controlsEl = document.createElement('div');
    this._controlsEl.className = 'tube-youtube__controls';
    container.appendChild(this._controlsEl);

    // YouTube API 로드 후 플레이어 생성
    this.state = YT_STATES.LOADING;
    try {
      await loadYouTubeAPI();
    } catch (err) {
      this.state = YT_STATES.UNSTARTED;
      this.emit('video:error', err);
      throw err;
    }

    return new Promise((resolve, reject) => {
      this._ytPlayer = new window.YT.Player(playerTarget.id, {
        videoId: this.videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: this.options.autoplay ? 1 : 0,
          controls: 0,           // 기본 YouTube 컨트롤 숨김
          rel: 0,                // 관련 영상 비활성
          fs: 0,                 // YouTube 기본 전체화면 버튼 숨김
          modestbranding: 1,     // YouTube 로고 최소화
          iv_load_policy: 3,     // 어노테이션 숨김
          playsinline: 1,        // 모바일 인라인 재생
          disablekb: 1,          // YouTube 기본 키보드 단축키 비활성
          enablejsapi: 1,        // JS API 활성
          origin: window.location.origin,   // postMessage 보안 origin
          widget_referrer: window.location.href,
        },
        events: {
          onReady: (event) => {
            this._playerEl = container.querySelector('iframe');
            this.state = YT_STATES.READY;

            // 저장된 볼륨/음소거 상태 복원, 없으면 options 기본값 사용
            const savedMuted = localStorage.getItem('tube-muted');
            const savedVolume = localStorage.getItem('tube-volume');
            const shouldMute = savedMuted !== null ? savedMuted === 'true' : this.options.muted;
            if (shouldMute) {
              this._ytPlayer.mute();
            } else {
              this._ytPlayer.unMute();
              if (savedVolume !== null) {
                this._ytPlayer.setVolume(parseInt(savedVolume, 10));
              }
            }

            // 최상 화질로 설정 (hd1080 → hd720 순으로 fallback은 YouTube가 처리)
            this._ytPlayer.setPlaybackQuality('hd1080');

            if (this.options.startTime > 0) {
              this._ytPlayer.seekTo(this.options.startTime, true);
            }

            this.emit('video:ready', this);
            this._mountControls();
            resolve(this);
          },
          onStateChange: (event) => {
            const newState = YT_STATE_MAP[event.data] || YT_STATES.UNSTARTED;
            this.state = newState;
            this.emit('video:statechange', newState);

            if (newState === YT_STATES.PLAYING) {
              this._containerEl?.classList.add('tube-youtube--playing');
              this._posterEl?.classList.add('tube-youtube__poster--hide');
              this._overlayEl?.classList.add('tube-youtube__overlay--playing');
              this._overlayEl?.classList.remove('tube-youtube__overlay--paused');
              if (this._centerBtn) {
                this._centerBtn.setAttribute('aria-label', '일시정지');
                this._centerBtn.setAttribute('aria-pressed', 'true');
              }
              this.emit('video:play');
              this._startProgressTracking();
            } else if (newState === YT_STATES.PAUSED) {
              this._containerEl?.classList.remove('tube-youtube--playing');
              this._posterEl?.classList.remove('tube-youtube__poster--hide');
              this._overlayEl?.classList.remove('tube-youtube__overlay--playing');
              this._overlayEl?.classList.add('tube-youtube__overlay--paused');
              if (this._centerBtn) {
                this._centerBtn.setAttribute('aria-label', '재생');
                this._centerBtn.setAttribute('aria-pressed', 'false');
              }
              this.emit('video:pause');
              this._stopProgressTracking();
            } else if (newState === YT_STATES.ENDED) {
              this._containerEl?.classList.remove('tube-youtube--playing');
              this._posterEl?.classList.remove('tube-youtube__poster--hide');
              this._overlayEl?.classList.remove('tube-youtube__overlay--playing');
              this._overlayEl?.classList.add('tube-youtube__overlay--paused');
              if (this._centerBtn) {
                this._centerBtn.setAttribute('aria-label', '재생');
                this._centerBtn.setAttribute('aria-pressed', 'false');
              }
              this.emit('video:end');
              this._stopProgressTracking();
              if (this.options.loop) {
                this.seek(this.options.startTime || 0).play();
              }
            } else if (newState === YT_STATES.BUFFERING) {
              this.emit('video:buffering');
            }
          },
          onError: (event) => {
            const errorMessages = {
              2: '잘못된 영상 ID',
              5: 'HTML5 플레이어 오류',
              100: '영상을 찾을 수 없음 (삭제 또는 비공개)',
              101: '영상 삽입이 허용되지 않음',
              150: '영상 삽입이 허용되지 않음',
            };
            const message = errorMessages[event.data] || `알 수 없는 오류 (코드: ${event.data})`;
            this.emit('video:error', { code: event.data, message });
            reject(new Error(message));
          },
        },
      });
    });
  }

  _setPosterImage() {
    if (this.options.poster) {
      this._posterEl.style.background = `url("${this.options.poster}") 50% 50% / cover no-repeat #000`;
      return;
    }

    const qualities = ['maxresdefault', 'sddefault', 'hqdefault'];
    let idx = 0;

    const tryNext = () => {
      if (idx >= qualities.length) return;
      const quality = qualities[idx++];
      const url = `https://img.youtube.com/vi/${this.videoId}/${quality}.jpg`;
      const img = new Image();
      img.onload = () => {
        // YouTube는 존재하지 않는 썸네일에도 120×90 플레이스홀더를 반환하므로 필터링
        if (img.naturalWidth <= 120) {
          tryNext();
        } else {
          this._posterEl.style.background = `url("${url}") 50% 50% / cover no-repeat #000`;
        }
      };
      img.onerror = tryNext;
      img.src = url;
    };

    tryNext();
  }

  _mountControls() {
    if (!this._controlsEl) return;

    // 동적으로 컨트롤 임포트 및 마운트
    const controlMap = {
      ...TubeYouTube._customControls,
      play: () => import('../controls/PlayPause.js').then((m) => m.PlayPause),
      progress: () => import('../controls/ProgressBar.js').then((m) => m.ProgressBar),
      time: () => import('../controls/TimeDisplay.js').then((m) => m.TimeDisplay),
      mute: () => import('../controls/Mute.js').then((m) => m.Mute),
      fullscreen: () => import('../controls/Fullscreen.js').then((m) => m.Fullscreen),
      'youtube-link': () => import('../controls/YouTubeLink.js').then((m) => m.YouTubeLink),
      volume: () => import('../controls/Volume.js').then((m) => m.Volume),
      speed: () => import('../controls/Speed.js').then((m) => m.Speed),
    };

    // 좌측 그룹과 우측 그룹 분리
    const leftGroup = document.createElement('div');
    leftGroup.className = 'tube-youtube__controls-left';
    const rightGroup = document.createElement('div');
    rightGroup.className = 'tube-youtube__controls-right';
    this._controlsEl.appendChild(leftGroup);
    this._controlsEl.appendChild(rightGroup);

    const rightControls = ['mute', 'volume', 'fullscreen', 'youtube-link'];

    // 순서를 보장하기 위해 순차적으로 마운트
    (async () => {
      for (const name of this.options.controls) {
        const loader = controlMap[name];
        if (!loader) continue;

        const ControlClass = await loader();
        const instance = new ControlClass(this);
        this._controlInstances.push(instance);

        if (name === 'progress') {
          // 프로그레스 바는 컨트롤 바 위에 별도 배치
          const progressWrapper = document.createElement('div');
          progressWrapper.className = 'tube-youtube__progress-wrap';
          this._controlsEl.insertBefore(progressWrapper, leftGroup);
          instance.mount(progressWrapper);
        } else if (rightControls.includes(name)) {
          instance.mount(rightGroup);
        } else {
          instance.mount(leftGroup);
        }
      }
    })();
  }

  _startProgressTracking() {
    this._stopProgressTracking();
    this._progressTimer = setInterval(() => {
      if (!this._ytPlayer || !this._ytPlayer.getCurrentTime) return;
      const current = this._ytPlayer.getCurrentTime();
      const duration = this._ytPlayer.getDuration();
      const percent = duration > 0 ? (current / duration) * 100 : 0;
      this.emit('video:progress', { current, duration, percent });
    }, 250);
  }

  _stopProgressTracking() {
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
  }

  // === Public API ===

  play() {
    if (this._ytPlayer) this._ytPlayer.playVideo();
    return this;
  }

  pause() {
    if (this._ytPlayer) this._ytPlayer.pauseVideo();
    return this;
  }

  stop() {
    if (this._ytPlayer) this._ytPlayer.stopVideo();
    return this;
  }

  seek(seconds) {
    if (this._ytPlayer) this._ytPlayer.seekTo(seconds, true);
    return this;
  }

  mute() {
    if (this._ytPlayer) this._ytPlayer.mute();
    localStorage.setItem('tube-muted', 'true');
    this.emit('video:mute', true);
    return this;
  }

  unmute() {
    if (this._ytPlayer) this._ytPlayer.unMute();
    localStorage.setItem('tube-muted', 'false');
    this.emit('video:mute', false);
    return this;
  }

  isMuted() {
    return this._ytPlayer ? this._ytPlayer.isMuted() : false;
  }

  setVolume(value) {
    if (this._ytPlayer) this._ytPlayer.setVolume(value);
    localStorage.setItem('tube-volume', Math.round(value));
    return this;
  }

  getVolume() {
    return this._ytPlayer ? this._ytPlayer.getVolume() : 0;
  }

  getCurrentTime() {
    return this._ytPlayer ? this._ytPlayer.getCurrentTime() : 0;
  }

  getDuration() {
    return this._ytPlayer ? this._ytPlayer.getDuration() : 0;
  }

  getState() {
    return this.state;
  }

  getContainerEl() {
    return this._containerEl;
  }

  destroy() {
    this._stopProgressTracking();
    this._controlInstances.forEach((c) => {
      if (c.destroy) c.destroy();
    });
    this._controlInstances = [];
    if (this._ytPlayer) {
      this._ytPlayer.destroy();
      this._ytPlayer = null;
    }
    if (this._containerEl) {
      this._containerEl.innerHTML = '';
    }
    this.removeAllListeners();
    this._mounted = false;
  }
}

// 전역 커스텀 컨트롤 레지스트리
TubeYouTube._customControls = {};
