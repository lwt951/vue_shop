import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局樣式
import './assets/css/global.css'
import axios from 'axios'
// 配置請求根路徑
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 配置請求攔截器，config ← 請求對象
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  // 最後必須return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
