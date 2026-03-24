// TubePlayer TypeScript declarations

export type TubeAnimation = 'fade' | 'slide' | 'zoom';
export type TubeTheme = 'dark' | string;
export type TubeVideoState =
  | 'unstarted'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'ended';
export type TubeControlName = 'play' | 'mute' | 'fullscreen' | 'progress' | 'time' | 'youtube-link' | 'volume' | string;

// ─── EventEmitter ────────────────────────────────────────────────────────────

export class EventEmitter {
  on(event: string, fn: (...args: any[]) => void): this;
  off(event: string, fn?: (...args: any[]) => void): this;
  once(event: string, fn: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): this;
  removeAllListeners(): this;
}

// ─── TubeLayer ───────────────────────────────────────────────────────────────

export interface TubeLayerOptions {
  closeOnDim?: boolean;
  closeOnEsc?: boolean;
  animation?: TubeAnimation;
  onOpen?: () => void;
  onClose?: () => void;
}

export class TubeLayer extends EventEmitter {
  id: string;
  options: Required<TubeLayerOptions>;
  el: HTMLElement | null;

  constructor(id: string, options?: TubeLayerOptions);

  get contentsEl(): HTMLElement | null;

  open(): this;
  close(): this;
  toggle(): this;
  isActive(): boolean;
  destroy(): void;
}

// ─── TubeYouTube ─────────────────────────────────────────────────────────────

export interface TubeYouTubeOptions {
  autoplay?: boolean;
  muted?: boolean;
  theme?: TubeTheme;
  controls?: TubeControlName[];
  restartOnOpen?: boolean;
  onReady?: (player: TubeYouTube) => void;
  onStateChange?: (state: TubeVideoState) => void;
  onProgress?: (data: { current: number; duration: number; percent: number }) => void;
}

export interface TubeVideoError {
  code: number;
  message: string;
}

export class TubeYouTube extends EventEmitter {
  videoId: string;
  options: Required<TubeYouTubeOptions>;
  state: TubeVideoState;
  _mounted: boolean;

  constructor(videoId: string, options?: TubeYouTubeOptions);

  mount(container: HTMLElement): Promise<this>;

  play(): this;
  pause(): this;
  stop(): this;
  seek(seconds: number): this;
  mute(): this;
  unmute(): this;
  isMuted(): boolean;
  setVolume(value: number): this;
  getVolume(): number;
  getCurrentTime(): number;
  getDuration(): number;
  getState(): TubeVideoState;
  getContainerEl(): HTMLElement | null;
  destroy(): void;

  // Events
  on(event: 'video:ready', fn: (player: TubeYouTube) => void): this;
  on(event: 'video:statechange', fn: (state: TubeVideoState) => void): this;
  on(event: 'video:play' | 'video:pause' | 'video:ended' | 'video:buffering', fn: () => void): this;
  on(event: 'video:progress', fn: (data: { current: number; duration: number; percent: number }) => void): this;
  on(event: 'video:mute', fn: (muted: boolean) => void): this;
  on(event: 'video:error', fn: (error: TubeVideoError | Error) => void): this;
  on(event: string, fn: (...args: any[]) => void): this;
}

// ─── TubeManager ─────────────────────────────────────────────────────────────

export interface TubeManagerGlobalOptions {
  animation?: TubeAnimation;
  autoplay?: boolean;
  restartOnOpen?: boolean;
  theme?: TubeTheme | Record<string, string>;
}

export interface TubeManagerEntry {
  layer: TubeLayer;
  player: TubeYouTube;
  on(event: string, fn: (...args: any[]) => void): this;
  off(event: string, fn: (...args: any[]) => void): this;
  open(): this;
  close(): this;
}

export declare const tubeManager: {
  init(globalOptions?: TubeManagerGlobalOptions): void;
  getLayer(id: string): TubeLayer | undefined;
  getPlayer(id: string): TubeYouTube | undefined;
  get(id: string): TubeManagerEntry | null;
  destroyAll(): void;
};
