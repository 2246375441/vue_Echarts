import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入全局样式文件
import './assets/css/global.less'

// 配置axios请求url路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将axios对象挂载到vue全局中
Vue.prototype.$axios = axios

// 将Echarts对象挂载到vue全局中
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
