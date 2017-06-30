const Z1 = 4;
const SCALE = 100;
const FACTOR = (1 << Z1) * SCALE;
const journeyMapZooms = ['0.0625', '0.125', '0.25', '0.5', '1', '2', '4'];

export default [
  {
    id: 'v2-day',
    name: '[v2] 日间',
    getTileUrl({x, y}, zoom) {
      return `tiles/journeymap/images/z${Math.pow(2, zoom - Z1)}/${x},${y}.png`;
    },
    tileSize: [512, 512],
    minZoom: 0,
    maxZoom: journeyMapZooms.length - 1,
  },
  {
    id: 'v2-night',
    name: '[v2] 夜间',
    getTileUrl({x, y}, zoom) {
      return `tiles/journeymap_night/images/z${journeyMapZooms[zoom - 1]}/${x},${y}.png`;
    },
    tileSize: [512, 512],
    minZoom: 1,
    maxZoom: journeyMapZooms.length,
  },
  {
    id: 'v2-topo',
    name: '[v2] 等高线',
    getTileUrl({x, y}, zoom) {
      return `tiles/journeymap_topo/images/z${journeyMapZooms[zoom - 1]}/${x},${y}.png`;
    },
    tileSize: [512, 512],
    minZoom: 1,
    maxZoom: journeyMapZooms.length,
  },
];
