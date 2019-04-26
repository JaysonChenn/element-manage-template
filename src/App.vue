<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>

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
  methods: {
    /**
     * @description 刷新子组件
     */
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
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
