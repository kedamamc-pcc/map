import Map from './map';

const journeyMapZooms = ['0.0625', '0.125', '0.25', '0.5', '1', '2', '4'];

!function init() {
  const map = new Map(document.getElementById('map'), {
    zoom: 4 + 1,
    backgroundColor: '#000',
    mapTypeId: 'v2-day',
  });

  map.addMapType({
    id: 'v2-day',
    name: '[v2] 日间',
    getTileUrl({x, y}, zoom) {
      return `tiles/journeymap/images/z${journeyMapZooms[zoom - 1]}/${x},${y}.png`;
    },
    tileSize: [512, 512],
    minZoom: 1,
    maxZoom: journeyMapZooms.length,
  });
}();
