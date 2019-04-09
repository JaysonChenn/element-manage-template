<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import {
  UserInfoApi
} from '@/api/userinfo'
import {
  NotifyMesApi
} from '@/api/notify'
import {
  mapMutations, mapState
} from 'vuex'

export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    ...mapState(['mesInfo', 'currentRoute', 'userInfo'])
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setMesInfo']),
    /**
     * @description 获取用户、通知信息(刷新防止vuex数据丢失)
     * @description App根组件获取用户信息ID值必须为sessionstorage里的值(vuex刷新即清空)
     */
    async getDefaultInfo () {
      if (sessionStorage.userinfo) {
        await UserInfoApi(JSON.parse(sessionStorage.userinfo).user_id)
          .then(res => {
            if (res.data.code === 0) {
              sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
              this.setUserInfo(res.data.data)
            }
          })
        await NotifyMesApi()
          .then(res => {
            if (res.data.code === 0) {
              let obj = {}
              obj.allArr = res.data.data.data
              obj.unreadArr = res.data.data.data.filter(item => { return item.notice_state === 0 })
              obj.havereadArr = res.data.data.data.filter(item => { return item.notice_state !== 0 })
              this.setMesInfo(obj)
            }
          })
      } else {
        this.PublicMethod.toPage('/login', {})
      }
    },
    /**
     * @description 刷新子组件
     */
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  },
  mounted () {
    /**
     * @description 根组件刷新
     * @description 不刷新条件为: 用户已经登录,用户信息和通知信息两个组件不刷新
     */
    // let condArr = ['用户信息', '通知信息']
    // if (sessionStorage.userinfo && sessionStorage.userinfo !== undefined && condArr.indexOf(this.currentRoute.name) === -1) {
    //   this.getDefaultInfo()
    // }
    this.getDefaultInfo()
  }
}
</script>

<style lang="scss">
/* import iconfont */
@import "./assets/icon/iconfont.css";
/* import app css */
@import "./style/app.min.css";
// import public css
@import "./style/public.min.css";
</style>
