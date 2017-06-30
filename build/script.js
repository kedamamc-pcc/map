(function () {
'use strict';

var Icons = {};

var Z1 = 4;
var SCALE = 100;
var FACTOR = 1 << Z1;

var projection = {
  fromLatLngToPoint: function fromLatLngToPoint(latLng) {
    return new google.maps.Point(latLng.lng() * SCALE, latLng.lat() * SCALE);
  },

  fromPointToLatLng: function fromPointToLatLng(point) {
    var ref = point instanceof Array ? point : [point.x, point.y];
    var x = ref[0];
    var z = ref[1];
    return new google.maps.LatLng(z / SCALE, x / SCALE, true);
  },

  fromBlockToLatLng: function fromBlockToLatLng(coord) {
    return this.fromPointToLatLng(coord.map(function (c) { return (c + .5) / FACTOR; }));
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
    _opts.center = projection.fromBlockToLatLng(_opts.center || [0, 0]);
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

  Map.prototype.mark = function mark (coord, opts, override) {
    if ( opts === void 0 ) opts = {};
    if ( override === void 0 ) override = opts;

    var marker = new google.maps.Marker({
      map: this,
      position: projection.fromBlockToLatLng(coord),
      icon: Icons[opts.icon || 'default'],
    });
  };

  return Map;
}(google.maps.Map));

var Z1$1 = 4;
var journeyMapZooms = ['0.0625', '0.125', '0.25', '0.5', '1', '2', '4'];

var mapTypeOpts = [
  {
    id: 'v2-day',
    name: '[v2] 日间',
    getTileUrl: function getTileUrl(ref, zoom) {
      var x = ref.x;
      var y = ref.y;

      return ("tiles/journeymap/images/z" + (Math.pow(2, zoom - Z1$1)) + "/" + x + "," + y + ".png");
    },
    tileSize: [512, 512],
    minZoom: 0,
    maxZoom: journeyMapZooms.length - 1,
  },
  {
    id: 'v2-night',
    name: '[v2] 夜间',
    getTileUrl: function getTileUrl(ref, zoom) {
      var x = ref.x;
      var y = ref.y;

      return ("tiles/journeymap_night/images/z" + (journeyMapZooms[zoom - 1]) + "/" + x + "," + y + ".png");
    },
    tileSize: [512, 512],
    minZoom: 1,
    maxZoom: journeyMapZooms.length,
  },
  {
    id: 'v2-topo',
    name: '[v2] 等高线',
    getTileUrl: function getTileUrl(ref, zoom) {
      var x = ref.x;
      var y = ref.y;

      return ("tiles/journeymap_topo/images/z" + (journeyMapZooms[zoom - 1]) + "/" + x + "," + y + ".png");
    },
    tileSize: [512, 512],
    minZoom: 1,
    maxZoom: journeyMapZooms.length,
  } ];

new Vue({
  el: '#page',
  data: {
    _map: null,
    _mapTypes: mapTypeOpts,

    isDrawerOpened: false,

    mapTypeNum: 0,
    zoom: 4,
    center: [0, 0],
  },
  computed: {
    hash: {
      get: function get() {
        console.log('reading hash');
        var tokens = location.hash.slice(1).split('/');
        if (tokens.length === 3) {
          this.mapTypeNum = Number(tokens[0]);
          this.zoom = Number(tokens[1]);
          this.center = tokens[2].split(',').map(function (n) { return Number(n); });
          return true;
        } else {
          return false;
        }
      },
      set: function set(upd) {
        var obj = Object.assign({}, this.hash, upd);
        location.hash = "#" + (obj.mapTypeNum) + "/" + (obj.zoom) + "/" + (obj.center.join(','));
      },
    },
  },
  methods: {
    changeMapType: function changeMapType(id) {
      this.$data._map.setMapTypeId(id);
    },
  },
  beforeMount: function beforeMount() {
    if (!this.hash) {
      this.hash = {
        mapTypeNum: this.mapTypeNum,
        zoom: this.zoom,
        center: this.center,
      };
    }
  },
  mounted: function mounted() {
    var map = this.$data._map = new Map(document.getElementById('map'), {
      mapTypeId: mapTypeOpts[this.mapTypeNum].id,
      zoom: this.zoom,
      center: this.center,
      backgroundColor: '#000',
    });
    mapTypeOpts.forEach(function (opts) {
      map.addMapType(opts);
    });
  },
});

}());
//# sourceMappingURL=script.js.map
