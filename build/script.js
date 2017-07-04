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

};
var conversion = {
  fromLatLngToBlock: function fromLatLngToBlock(latLng) {
    var point = projection.fromLatLngToPoint(latLng);
    return [point.x, point.y].map(function (n) { return Math.floor(n * FACTOR); });
  },
  fromBlockToLatLng: function fromBlockToLatLng(coord) {
    return projection.fromPointToLatLng(coord.map(function (c) { return (c + .5) / FACTOR; }));
  },
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
    _opts.center = conversion.fromBlockToLatLng(_opts.center || [0, 0]);

    superclass.call(this, el, _opts);
  }

  if ( superclass ) Map.__proto__ = superclass;
  Map.prototype = Object.create( superclass && superclass.prototype );
  Map.prototype.constructor = Map;

  Map.prototype.setOptions = function setOptions (opts) {
    if (opts.center) {
      opts.center = conversion.fromBlockToLatLng(opts.center);
    }
    superclass.prototype.setOptions.call(this, opts);
  };

  Map.prototype.addMapType = function addMapType (opts) {
    opts.tileSize = new (Function.prototype.bind.apply( google.maps.Size, [ null ].concat( opts.tileSize) ));
    var mapType = new google.maps.ImageMapType(opts);
    mapType.projection = projection;
    this.mapTypes.set(opts.id, mapType);
  };

  Map.prototype.getCenterCoord = function getCenterCoord () {
    return conversion.fromLatLngToBlock(superclass.prototype.getCenter.call(this));
  };

  Map.prototype.mark = function mark (coord, opts, override) {
    if ( opts === void 0 ) opts = {};
    if ( override === void 0 ) override = opts;

    var marker = new google.maps.Marker({
      map: this,
      position: conversion.fromBlockToLatLng(coord),
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

var RE_HASH = /^#\/(\d+)\/(\d+)\/(-?\d+,-?\d+)/;
var defHashTokens = RE_HASH.exec(RE_HASH.test(location.hash) ? location.hash : '#/0/4/0,0');

new Vue({
  el: '#page',
  data: {
    _map: null,
    _mapTypes: mapTypeOpts,

    isDrawerOpened: false,
    isDragging: false,

    mapTypeNum: +defHashTokens[1],
    zoom: +defHashTokens[2],
    center: defHashTokens[3].split(',').map(function (n) { return +n; }),
  },
  computed: {
    hash: function hash() {
      return ("#/" + (this.mapTypeNum) + "/" + (this.zoom) + "/" + (this.center.join(',')));
    },
  },
  watch: {
    hash: {
      handler: function (val) {
        location.hash = val;
      },
      immediate: true,
    },
  },
  methods: {
    changeMapType: function changeMapType(id) {
      this.$data._map.setMapTypeId(id);
    },
    onhashchange: function onhashchange(ref) {
      var newURL = ref.newURL;

      var newHash = newURL.slice(newURL.indexOf('#'));
      if (RE_HASH.test(newHash)) {
        var tokens = RE_HASH.exec(newHash);
        this.mapTypeNum = +tokens[1];
        this.zoom = +tokens[2];
        this.center = tokens[3].split(',').map(function (n) { return +n; });
      }
    },
  },
  created: function created() {
    // 监听 Hash 外部变化
    window.onhashchange = this.onhashchange;
  },
  mounted: function mounted() {
    var this$1 = this;

    // 实例化地图对象
    var map = this.$data._map = new Map(document.getElementById('map'), {
      mapTypeId: mapTypeOpts[this.mapTypeNum].id,
      zoom: this.zoom,
      center: this.center,
      backgroundColor: '#000',
    });
    // 添加视图类型
    mapTypeOpts.forEach(function (opts) {
      map.addMapType(opts);
    });
    // 添加事件
    map.addListener('center_changed', function (_){
      this$1.center = map.getCenterCoord();
    });
  },
});

}());
//# sourceMappingURL=script.js.map
