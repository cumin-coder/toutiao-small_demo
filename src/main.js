import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.less'

// 按需引入 Element-UI
import './utils/element-ui'

// 清楚默认样式
import './utils/cssreset.less'

// // 网络请求
// import request from './utils/request'
// Vue.prototype.$request = request

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
