// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
// 引入 ElementUI 组件库及其样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/index.css'
// 引入echarts
import * as echarts from 'echarts'
// 挂载到Vue原型上
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios;
Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
