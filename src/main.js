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
import lodash from 'lodash'
import VueMoment from 'vue-moment'
import VeeValidate from 'vee-validate'
import VueQuillEditor from 'vue-quill-editor'
import VueCkeditor from 'vue-ckeditor2'
import vSelect from 'vue-select'
import Loading from './commons/Loading'
import Pagination from './commons/Pagination'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import ENV from './env'

const bugsnag = require('bugsnag-js')
const bugsnagClient = bugsnag('e3800fb1e85ac0024c59fc7237addf7a')
const bugsnagVue = require('bugsnag-vue')
bugsnagClient.use(bugsnagVue(Vue))


Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });

axios.defaults.baseURL = ENV.BASE_URL

axios.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')

Vue.component('v-pagination', Pagination)
Vue.component('v-select', vSelect)
Vue.component('loading', Loading)
Vue.use(VueFlash)
Vue.use(Router)
Vue.use(VModal)
Vue.use(VueAxios, axios)
Vue.use(VueMoment)
Vue.use(VeeValidate)
Vue.use(VueQuillEditor)
Vue.use(VueCkeditor)

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
