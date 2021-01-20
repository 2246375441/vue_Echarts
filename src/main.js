import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入全局样式文件
import './assets/css/global.less'
// 引入字体样式
import './assets/font/iconfont.css'

// 导入webSocket封装方法
import SocketService from './utils/socket_service'
// 将webSocket挂载到vue原型对象上  this.$socket 调用内部方法
Vue.prototype.$socket = SocketService.Instance
// 对服务端进行webSocket连接
Vue.prototype.$socket.connect()

// 配置axios请求url路径(开发模式)
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 配置axios请求url路径(上线模式)
axios.defaults.baseURL = 'http://chenxinlong.xyz:60102/'

// 将axios对象挂载到vue全局中
Vue.prototype.$axios = axios

// 将Echarts对象挂载到vue全局中
Vue.prototype.$echarts = window.echarts

// 网站域名登记(重要/开发模式)
// Vue.prototype.websiteUrl = 'http://localhost:9000'
// 网站域名登记(重要/上线模式)
Vue.prototype.websiteUrl = 'http://echarts.chenxinlong.xyz/'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
