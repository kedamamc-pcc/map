import Map from './map';
import mapTypeOpts from './maptypes';

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
      get() {
        console.log('reading hash');
        let tokens = location.hash.slice(1).split('/');
        if (tokens.length === 3) {
          this.mapTypeNum = Number(tokens[0]);
          this.zoom = Number(tokens[1]);
          this.center = tokens[2].split(',').map(n => Number(n));
          return true;
        } else {
          return false;
        }
      },
      set(upd) {
        let obj = Object.assign({}, this.hash, upd);
        location.hash = `#${obj.mapTypeNum}/${obj.zoom}/${obj.center.join(',')}`;
      },
    },
  },
  methods: {
    changeMapType(id) {
      this.$data._map.setMapTypeId(id);
    },
  },
  beforeMount() {
    if (!this.hash) {
      this.hash = {
        mapTypeNum: this.mapTypeNum,
        zoom: this.zoom,
        center: this.center,
      };
    }
  },
  mounted() {
    const map = this.$data._map = new Map(document.getElementById('map'), {
      mapTypeId: mapTypeOpts[this.mapTypeNum].id,
      zoom: this.zoom,
      center: this.center,
      backgroundColor: '#000',
    });
    mapTypeOpts.forEach(opts => {
      map.addMapType(opts)
    });
  },
});
