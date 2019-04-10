<template>
  <el-aside id="navbar">
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :collapse="isCollapse" :router="true" :unique-opened="true"
      background-color="#001529" text-color="#E2E2E2">
      <el-menu-item :index="item.path" v-for="(item, index) in this.$router.options.routes.slice(2)" :key="index"
        v-show="item.children.length == 1">
        <i :class="`iconfont ${item.icon}`"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
      <el-submenu :index="items.path" v-for="(items, indexs) in this.$router.options.routes.slice(2)" :key="indexs + items.path"
        v-show="items.children.length > 1">
        <template slot="title">
          <i :class="`iconfont ${items.icon}`"></i>
          <span slot="title">{{items.name}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="itemchild.path" v-for="(itemchild, indexchild) in items.children" :key="indexchild">{{itemchild.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import {
  mapState
} from 'vuex'

export default {
  computed: {
    ...mapState(['isCollapse'])
  }
}
</script>

<style lang="scss" scoped>
#navbar{
  .iconfont{
    margin-right: 6px;
  }

  .el-dropdown{
    margin-right: 6px
  }

  .el-menu {
    border: none;
  }

  .el-submenu .el-menu-item {
    text-align: center;
    background-color: #010b15c2 !important;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
}
</style>
