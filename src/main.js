import Vue from 'vue'
import Router from 'vue-router'
import VModal from 'vue-js-modal'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueFlash from 'vue2-flash';

import middleware from './middleware'
import App from './App.vue'
import guestRoutes from './guest/router'
import adminRoutes from './admin/router'

import ENV from './env'

axios.defaults.baseURL = ENV.BASE_URL

axios.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')

Vue.use(VueFlash);
Vue.use(Router)
Vue.use(VModal)
Vue.use(VueAxios, axios)

const router = new Router({
  mode: 'history',
  routes: [...guestRoutes,...adminRoutes]
})

window.Bus = new Vue()

middleware(router)

new Vue({
  router,
  render: createEle => createEle(App)
}).$mount('#app')
