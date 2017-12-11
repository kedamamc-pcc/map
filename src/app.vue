<script>
  import Map from './components/map'
  import MAP_TYPES from './constants/maptypes'

  let changeFromInside = null

  export default {
    name: 'App',
    components: {
      TheMap: Map,
    },
    data() {
      return {
        mapType: MAP_TYPES[0].id,
        zoom: 0,
        center: [0, 0],
        showMenu: false,
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
      MAP_TYPES: () => MAP_TYPES,
      mapTypeIdx() {
        let idx = 0
        for (const mapType of MAP_TYPES) {
          if (mapType.id === this.mapType) return idx
          idx++
        }
        return -1
      },
      mapTypeName() {
        return MAP_TYPES[this.mapTypeIdx].name
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
      changeMapType(id) {
        this.mapType = id
        this.showMenu = false
      },
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
    <div id="menu" @mouseover="showMenu = true" @mouseleave="showMenu = false">
      <transition name="menu-current">
        <div v-show="!showMenu">{{mapTypeName}}</div>
      </transition>
      <transition name="menu-list">
        <ul v-show="showMenu">
          <li v-for="type of MAP_TYPES" @click="mapType = type.id">{{type.name}}</li>
        </ul>
      </transition>
    </div>
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

  #menu {
    position: fixed;
    top: calc(10px + 16px + 10px);
    right: 10px;
    border-top: 1px solid #FFF;
    color: #FFF;
    text-align: right;
    text-shadow: 0 0 3px #000;
    overflow: hidden;

    & div {
      padding: 5px 10px;
    }

    & ul {
      margin: 0;
      padding: 1px 0 0;
    }

    & li {
      list-style: none;
      line-height: 1;
      padding: 5px 10px;
      cursor: pointer;

      &:hover {
        background: #FFF;
        color: #000;
        border-radius: 2px;
        box-shadow: 2px 1px 2px #000;
        text-shadow: none;
      }
    }
  }

  .menu-current-enter-active, .menu-current-leave-active {
    transition: margin-top .2s linear;
  }

  .menu-current-enter-to, .menu-current-leave {
    margin-top: 0;
  }

  .menu-current-enter, .menu-current-leave-to {
    margin-top: calc(-1 * (1em + 10px) + 1px);
  }

  .menu-list-enter-active, .menu-list-leave-active {
    transition: opacity .2s linear;
  }

  .menu-list-enter-to, .menu-list-leave {
    opacity: 1;
    /*transform: translateY(0);*/
  }

  .menu-list-enter, .menu-list-leave-to {
    opacity: 0;
    /*transform: translateY(5px);*/
  }
</style>