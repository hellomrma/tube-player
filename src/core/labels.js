/**
 * 접근성 라벨 (aria-label). TubePlayer.init({ labels })로 덮어쓸 수 있다.
 */
export const labels = {
  play: 'Play',
  pause: 'Pause',
  mute: 'Mute',
  unmute: 'Unmute',
  fullscreen: 'Fullscreen',
  exitFullscreen: 'Exit fullscreen',
  progress: 'Seek',
  volume: 'Volume',
  speed: 'Playback speed',
  youtubeLink: 'Watch on YouTube',
  close: 'Close',
  dialog: 'Video player',
};

export function setLabels(overrides) {
  Object.assign(labels, overrides);
}
