export const Z1 = 4
const MAX_ZOOM_JM = 2
const MIN_ZOOM_JM = -4

export default [
  {
    id: 'v2-day',
    name: '[v2] 日间',
    getTileUrl({x, y}, zoom) {
      return `/map-tiles/journeymap/images/z${Math.pow(2, zoom - Z1)}/${x},${y}.png`
    },
    tileSize: [512, 512],
    minZoom: MIN_ZOOM_JM + Z1,
    maxZoom: MAX_ZOOM_JM + Z1,
  },
  {
    id: 'v2-night',
    name: '[v2] 夜间',
    getTileUrl({x, y}, zoom) {
      return `/map-tiles/journeymap_night/images/z${Math.pow(2, zoom - Z1)}/${x},${y}.png`
    },
    tileSize: [512, 512],
    minZoom: MIN_ZOOM_JM + Z1,
    maxZoom: MAX_ZOOM_JM + Z1,
  },
  {
    id: 'v2-topo',
    name: '[v2] 等高线',
    getTileUrl({x, y}, zoom) {
      return `/map-tiles/journeymap_topo/images/z${Math.pow(2, zoom - Z1)}/${x},${y}.png`
    },
    tileSize: [512, 512],
    minZoom: MIN_ZOOM_JM + Z1,
    maxZoom: MAX_ZOOM_JM + Z1,
  },
]
