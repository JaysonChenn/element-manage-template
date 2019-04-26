<template>
  <el-container id="layout">
    <!-- aside -->
    <Navbar class="hidden-sm-and-down" />
    <MobNavbar class="hidden-md-and-up" :style="isMobNavbarShow? 'transform: none; z-index: 1000' : 'transform: translateX(-100%); z-index：-1'" />
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

</style>
