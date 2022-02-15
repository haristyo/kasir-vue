import Vue from 'vue'
import App from './App.vue'
import router from './router.js'

import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue'
Vue.config.productionTip = false
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// // import moment from 'moment'

// import moment from 'moment';
// moment().format();


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')