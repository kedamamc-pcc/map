<script>
  import MAP_TYPES, {Z1} from '../constants/maptypes'

  const SCALE = 100
  const FACTOR = 1 << Z1

  const projection = {
    fromLatLngToPoint(latLng) {
      return new google.maps.Point(latLng.lng() * SCALE, latLng.lat() * SCALE)
    },
    fromPointToLatLng(point) {
      let [x, z] = point instanceof Array ? point : [point.x, point.y]
      return new google.maps.LatLng(z / SCALE, x / SCALE, true)
    },
  }

  function latLngToCoord(latLng) {
    const point = projection.fromLatLngToPoint(latLng)
    return [point.x, point.y].map(n => Math.floor(n * FACTOR))
  }

  function coordToLatLng(coord) {
    return projection.fromPointToLatLng(coord.map(c => (c + .5) / FACTOR))
  }

  export default {
    name: 'Map',
    props: ['mapType', 'zoom', 'center'],
    data() {
      return {
        _map: null,
        _changeFromInside: null,
      }
    },
    computed: {
      mapOptions() {
        return {
          mapTypeId: this.mapType,
          zoom: this.zoom + Z1,
          center: coordToLatLng(this.center),
        }
      },
    },
    watch: {
      mapOptions(val) {
        if (this.$data._changeFromInside === null) {
          this.$data._changeFromInside = false
          this.$data._map.setOptions(val)
        }
        this.$data._changeFromInside = null
      },
    },
    mounted() {
      const _map = this.$data._map = new google.maps.Map(this.$el, {
        streetViewControl: false,
        mapTypeControl: false,
        panControl: false,
        scaleControl: false,
        zoomControl: true,
        backgroundColor: '#000',
        ...this.mapOptions,
      })
      for (const mapTypeOpts of MAP_TYPES) {
        const mapType = new google.maps.ImageMapType({
          ...mapTypeOpts,
          tileSize: new google.maps.Size(...mapTypeOpts.tileSize),
        })
        mapType.projection = projection
        _map.mapTypes.set(mapTypeOpts.id, mapType)
      }
      _map.addListener('center_changed', _ => {
        if (this.$data._changeFromInside === null) {
          this.$data._changeFromInside = true
          this.$emit('update:center', latLngToCoord(_map.getCenter()))
        }
      })
      _map.addListener('zoom_changed', _ => {
        if (this.$data._changeFromInside === null) {
          this.$data._changeFromInside = true
          this.$emit('update:zoom', _map.getZoom() - Z1)
        }
      })
    },
  }
</script>

<template>
  <div></div>
</template>