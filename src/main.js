import Vue from 'vue'

import App from './app'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  functional: true,
  render: h => h(App),
})