<script>
  import Map from './components/map'
  import MapMenu from './components/map-menu'
  import MAP_TYPES from './constants/maptypes'

  let changeFromInside = null

  export default {
    name: 'App',
    components: {
      TheMap: Map,
      MapMenu,
    },
    data() {
      return {
        mapType: MAP_TYPES[0].id,
        zoom: 0,
        center: [0, 0],
      }
    },
    computed: {
      hash: {
        get() {
          if (changeFromInside === null) changeFromInside = true
          return `/${this.mapType}/${this.zoom}/${this.center.join(',')}`
        },
        set(val) {
          if (changeFromInside === false) {
            const tokens = val.split('/')
            this.mapType = tokens[1]
            this.zoom = +tokens[2]
            this.center = tokens[3].split(',').map(n => +n)
          }
        },
      },
    },
    watch: {
      hash: {
        immediate: true,
        handler(val) {
          console.log('watch hash', changeFromInside)
          if (changeFromInside === true) {
            window.location.hash = val
          }
          changeFromInside = null
        },
      },
    },
    methods: {
    },
    created() {
      window.onhashchange = () => {
        if (changeFromInside === null) changeFromInside = false
        this.hash = window.location.hash
      }
    },
  }
</script>

<template>
  <div id="app">
    <TheMap id="map" :map-type="mapType" :zoom.sync="zoom" :center.sync="center"/>
    <h1>「非官方」<a href="https://craft.moe">毛玉線圈物語</a>主世界地图</h1>
    <MapMenu :map-type.sync="mapType"/>
  </div>
</template>

<style>
  @import 'normalize.css';

  html, body {
    margin: 0;
    height: 100%;
    font-size: 14px;
    font-family: 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  }

  #app {
    height: 100%;

    & h1 {
      margin: 0;
      font-size: 16px;
      position: fixed;
      top: 10px;
      right: 10px;
      line-height: 1;
      color: #fff;
      text-shadow: 0 0 6px #000;

      & a {
        text-decoration: none;
        color: inherit;
      }

      &:hover a {
        border-bottom: 2px solid;
      }
    }
  }

  #map {
    height: 100%;
  }
</style>