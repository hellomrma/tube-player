import './styles/base.css';
import './styles/themes/dark.css';

import { tubeManager } from './core/TubeManager.js';
import { TubeLayer } from './core/TubeLayer.js';
import { TubeYouTube } from './players/TubeYouTube.js';
import { EventEmitter } from './core/EventEmitter.js';

// 기본 export — TubePlayer 네임스페이스
const TubePlayer = {
  init: (options) => tubeManager.init(options),
  getLayer: (id) => tubeManager.getLayer(id),
  getPlayer: (id) => tubeManager.getPlayer(id),
  get: (id) => tubeManager.get(id),
  destroyAll: () => tubeManager.destroyAll(),
};

export { TubeLayer, TubeYouTube, EventEmitter };
export default TubePlayer;
