import Vue from 'vue'
import Router from 'vue-router'

const Layout = resolve => require(['@/views/layout/layout'], resolve) // 布局结构
const Login = resolve => require(['@/views/login/login'], resolve) // 登陆

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/index',
    name: '主页 ',
    icon: 'iconzhuye',
    component: Layout,
    children: [{
      path: '/index',
      name: '主页'
    }]
  }]
})
