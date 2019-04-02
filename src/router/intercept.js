import router from '@/router/index'
import store from '@/store/store'

/**
 * @description 路由拦截
 * @description 放行条件为是否登录
 */
export default router.beforeEach((to, from, next) => {
  store.commit('setCurrentRoute', to)
  let isLogin = window.sessionStorage.getItem('userinfo') == null ? null : window.sessionStorage.getItem('userinfo')
  if (isLogin && isLogin !== null) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
