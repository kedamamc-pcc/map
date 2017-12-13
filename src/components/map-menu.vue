<script>
  import MAP_TYPES from '../constants/maptypes'

  export default {
    name: 'Menu',
    props: ['mapType'],
    data() {
      return {
        showMenu: false,
      }
    },
    computed: {
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
  }
</script>

<template>
  <div id="map-menu" @mouseover="showMenu = true" @mouseleave="showMenu = false">
    <transition name="menu-current">
      <div v-show="!showMenu">{{mapTypeName}}</div>
    </transition>
    <transition name="menu-list">
      <ul v-show="showMenu">
        <li v-for="type of MAP_TYPES" @click="$emit('update:map-type', type.id)">{{type.name}}</li>
      </ul>
    </transition>
  </div>
</template>

<style>
  #map-menu {
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