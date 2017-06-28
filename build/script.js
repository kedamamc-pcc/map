(function () {
'use strict';

var SCALE = 100;

var projection = {
  fromLatLngToPoint: function fromLatLngToPoint(latLng) {
    return new google.maps.Point(latLng.lng() * SCALE, latLng.lat() * SCALE);
  },

  fromPointToLatLng: function fromPointToLatLng(point) {
    var ref = point instanceof Array ? point : [point.x, point.y];
    var x = ref[0];
    var z = ref[1];
    return new google.maps.LatLng(z / SCALE, x / SCALE, true);
  }
};

var Map = (function (superclass) {
  function Map(el, opts) {
    var _opts = Object.assign({
      streetViewControl: false,
      mapTypeControl: false,
      panControl: false,
      scaleControl: false,
      zoomControl: true,
    }, opts);
    _opts.center = projection.fromPointToLatLng(_opts.center || [0, 0]);
    superclass.call(this, el, _opts);
  }

  if ( superclass ) Map.__proto__ = superclass;
  Map.prototype = Object.create( superclass && superclass.prototype );
  Map.prototype.constructor = Map;

  Map.prototype.addMapType = function addMapType (opts) {
    opts.tileSize = new (Function.prototype.bind.apply( google.maps.Size, [ null ].concat( opts.tileSize) ));
    var mapType = new google.maps.ImageMapType(opts);
    mapType.projection = projection;
    this.mapTypes.set(opts.id, mapType);
  };

  return Map;
}(google.maps.Map));

var journeyMapZooms = ['0.0625', '0.125', '0.25', '0.5', '1', '2', '4'];

!function init() {
  var map = new Map(document.getElementById('map'), {
    zoom: 4 + 1,
    backgroundColor: '#000',
    mapTypeId: 'v2-day',
  });

  map.addMapType({
    id: 'v2-day',
    name: '[v2] 日间',
    getTileUrl: function getTileUrl(ref, zoom) {
      var x = ref.x;
      var y = ref.y;

      return ("tiles/journeymap/images/z" + (journeyMapZooms[zoom - 1]) + "/" + x + "," + y + ".png");
    },
    tileSize: [512, 512],
    minZoom: 1,
    maxZoom: journeyMapZooms.length,
  });
}();

}());
