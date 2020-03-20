import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import './assets/css/global.css'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import dateformat from './assets/js/dateformat'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://127.0.0.1:3000/'

NProgress.configure({ showSpinner: false })

axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
Vue.prototype.$qs = qs
Vue.prototype.dateformat = dateformat

Vue.config.productionTip = false
Vue.filter('dateformat', dateformat)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
