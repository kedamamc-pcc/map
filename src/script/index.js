import Map from './map';
import mapTypeOpts from './maptypes';

const RE_HASH = /^#\/(\d+)\/(\d+)\/(-?\d+,-?\d+)/;
const defHashTokens = RE_HASH.exec(RE_HASH.test(location.hash) ? location.hash : '#/0/4/0,0');

new Vue({
  el: '#page',
  data: {
    _map: null,
    _mapTypes: mapTypeOpts,

    isDrawerOpened: false,
    isDragging: false,

    mapTypeNum: +defHashTokens[1],
    zoom: +defHashTokens[2],
    center: defHashTokens[3].split(',').map(n => +n),
  },
  computed: {
    hash() {
      return `#/${this.mapTypeNum}/${this.zoom}/${this.center.join(',')}`;
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
    changeMapType(id) {
      this.$data._map.setMapTypeId(id);
    },
    onhashchange({newURL}) {
      let newHash = newURL.slice(newURL.indexOf('#'));
      if (RE_HASH.test(newHash)) {
        let tokens = RE_HASH.exec(newHash);
        this.mapTypeNum = +tokens[1];
        this.zoom = +tokens[2];
        this.center = tokens[3].split(',').map(n => +n);
      }
    },
  },
  created() {
    // 监听 Hash 外部变化
    window.onhashchange = this.onhashchange;
  },
  mounted() {
    // 实例化地图对象
    const map = this.$data._map = new Map(document.getElementById('map'), {
      mapTypeId: mapTypeOpts[this.mapTypeNum].id,
      zoom: this.zoom,
      center: this.center,
      backgroundColor: '#000',
    });
    // 添加视图类型
    mapTypeOpts.forEach(opts => {
      map.addMapType(opts)
    });
    // 添加事件
    map.addListener('center_changed', _=> {
      this.center = map.getCenterCoord();
    });
  },
});
