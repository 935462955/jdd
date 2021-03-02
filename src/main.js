import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global_css.css'
import axios from 'axios'

//全局变量$http
Vue.prototype.$axios = axios
//配置请求根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/' //可能token过期了重新登录试试
axios.interceptors.request.use(config=>{
	//console.log(config) //请求对象，必须返回config
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
