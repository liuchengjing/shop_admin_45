import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 1.将axios挂载到vue的原型上，将来所有的vue实例都能直接用axios
Vue.prototype.$axios = axios

// 2.配置统一的基准地址，将来所有的axios请求，都会默认加上基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 3. 通过请求拦截器
// 所有的请求, 被发送前, 都会经过请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  // console.log(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 4.添加响应拦截器
// 所有的响应，在被.then和.catch处理前都会经过响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  if (response.meta.status === 401) {
    localStorage.removeItem('token')
    response.meta.msg = '尊敬的用户，您的登录状态已过期，请重新登录'
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
