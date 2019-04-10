<template>
  <el-container id="layout">
    <!-- aside -->
    <Navbar class="hidden-sm-and-down" />
    <MobNavbar class="hidden-md-and-up" :style="isMobNavbarShow? 'height: 100vh; z-index: 1000' : 'height: 0; z-index：-1'" />
    <!-- container -->
    <el-container class="container">
      <!-- header -->
      <Header />
      <!-- breadcrumb -->
      <Breadcrumb :name="$route.name" :path="$route.path" />
      <!-- inside-container -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Header from './child-components/Header'
import Navbar from './child-components/Navbar'
import MobNavbar from './child-components/MobnavBar'
import {
  mapState
} from 'vuex'

export default {
  components: {
    MobNavbar,
    Breadcrumb,
    Header,
    Navbar
  },
  computed: {
    ...mapState(['isMobNavbarShow'])
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

.container{
  display: flex;
  flex-direction: column;
}

.el-container {
  height: 100%;
  width: 100%
}

.el-aside {
  width: auto !important;
  overflow: hidden;
  background: #001529;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  padding: 20px 10px
}
</style>
