import Icons from './icons.js';

const Z1 = 4;
const SCALE = 100;
const FACTOR = 1 << Z1;

const projection = {
  fromLatLngToPoint(latLng) {
    return new google.maps.Point(latLng.lng() * SCALE, latLng.lat() * SCALE);
  },
  fromPointToLatLng(point) {
    let [x, z] = point instanceof Array ? point : [point.x, point.y];
    return new google.maps.LatLng(z / SCALE, x / SCALE, true);
  },

};
const conversion = {
  fromLatLngToBlock(latLng) {
    let point = projection.fromLatLngToPoint(latLng);
    return [point.x, point.y].map(n => Math.floor(n * FACTOR));
  },
  fromBlockToLatLng(coord) {
    return projection.fromPointToLatLng(coord.map(c => (c + .5) / FACTOR));
  },
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
    _opts.center = conversion.fromBlockToLatLng(_opts.center || [0, 0]);

    super(el, _opts);
  }

  setOptions(opts) {
    if (opts.center) {
      opts.center = conversion.fromBlockToLatLng(opts.center);
    }
    super.setOptions(opts);
  }

  addMapType(opts) {
    opts.tileSize = new google.maps.Size(...opts.tileSize);
    let mapType = new google.maps.ImageMapType(opts);
    mapType.projection = projection;
    this.mapTypes.set(opts.id, mapType);
  }

  getCenterCoord() {
    return conversion.fromLatLngToBlock(super.getCenter());
  }

  mark(coord, opts = {}, override = opts) {
    let marker = new google.maps.Marker({
      map: this,
      position: conversion.fromBlockToLatLng(coord),
      icon: Icons[opts.icon || 'default'],
    });
  }
}

export default Map;
