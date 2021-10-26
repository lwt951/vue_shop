import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局樣式
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 導入富文本編輯器
import VueQuillEditor from 'vue-quill-editor'
// 導入富文本編輯器對應樣式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 配置請求根路徑
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 配置請求攔截器，config ← 請求對象
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  // 最後必須return config
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

// 註冊富文本編輯器為全局可用的組件
Vue.use(VueQuillEditor)

// 格式化時間過濾器
Vue.filter('dateFormat', function(originVal) {
  const date = new Date(originVal)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDate() + '').padStart(2, '0')
  const hour = (date.getHours() + '').padStart(2, '0')
  const min = (date.getMinutes() + '').padStart(2, '0')
  const sec = (date.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
