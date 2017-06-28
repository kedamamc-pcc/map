const SCALE = 100;

const projection = {
  fromLatLngToPoint(latLng) {
    return new google.maps.Point(latLng.lng() * SCALE, latLng.lat() * SCALE);
  },

  fromPointToLatLng(point) {
    let [x, z] = point instanceof Array ? point : [point.x, point.y];
    return new google.maps.LatLng(z / SCALE, x / SCALE, true);
  }
};

class Map extends google.maps.Map {
  constructor(el, opts) {
    let _opts = Object.assign({
      streetViewControl: false,
      mapTypeControl: false,
      panControl: false,
      scaleControl: false,
      zoomControl: true,
    }, opts);
    _opts.center = projection.fromPointToLatLng(_opts.center || [0, 0]);
    super(el, _opts);
  }

  addMapType(opts) {
    opts.tileSize = new google.maps.Size(...opts.tileSize);
    let mapType = new google.maps.ImageMapType(opts);
    mapType.projection = projection;
    this.mapTypes.set(opts.id, mapType);
  }
}

export default Map;
