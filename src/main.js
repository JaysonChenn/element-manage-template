// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import intercept from '@/router/intercept'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/display.css'
import 'element-ui/lib/theme-chalk/index.css'
import publicMethodObj from '@/assets/js/public'
import echarts from 'echarts'

Vue.prototype.PublicMethod = publicMethodObj
Vue.prototype.$echarts = echarts

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  intercept,
  components: {
    App
  },
  template: '<App/>'
})