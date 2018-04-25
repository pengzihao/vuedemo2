// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import ApiConfig from '../config/api.config'
// (解决跨域)不会区分生产和开发环境的配置
Axios.defaults.baseURL = ApiConfig.baseUrl
// 配置全局http请求
Vue.prototype.$axios = Axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
