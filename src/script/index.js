import Map from './map';
import mapTypeOpts from './maptypes';

new Vue({
  el: '#page',
  data: {
    _map: null,
    _mapTypes: mapTypeOpts,

    isDrawerOpened: false,
  },
  methods: {
    changeMapType(id) {
      this.$data._map.setMapTypeId(id);
    },
  },
  mounted() {
    const map = this.$data._map = new Map(document.getElementById('map'), {
      zoom: 4 + 1,
      backgroundColor: '#000',
      mapTypeId: 'v2-day',
    });
    mapTypeOpts.forEach(opts => {
      map.addMapType(opts)
    });
  },
});
