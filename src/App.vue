<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
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
