<template>
  <el-container id="layout">
    <!-- aside -->
    <el-aside class="hidden-sm-and-down">
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :collapse="isCollapse" :router="true"
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
    <MobNavbar class="hidden-md-and-up" v-on:navbarByVal="navbarByVal" :style="isMobNavbarShow? 'height: 100vh; z-index: 1000' : 'height: 0; z-index：-1'" />
    <!-- container -->
    <el-container>
      <el-header>
        <div class="toggle-icon hidden-sm-and-down" :style="isCollapse ? 'transform: rotate(-90deg)' : ''">
          <i class="iconfont icontoggle" @click="isCollapse = !isCollapse"></i>
        </div>
        <div class="toggle-icon hidden-md-and-up">
          <i class="iconfont icontoggle" @click="isMobNavbarShow = true"></i>
        </div>
        <div class="header-tool">
          <i class="iconfont iconlv_zuanshi diamon"></i>
          <span class="num">{{diamon}}</span>
          <i class="iconfont iconfanli"></i>
          <span class="num">{{rebate}}</span>
          <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-badge :value="2" class="item">
              <i class="el-icon-bell"></i>
            </el-badge>
          </span>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix">
              未读
              <el-badge class="mark" :value="2" />
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              已读
              <el-badge class="mark" :value="6" type="info"/>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
          <i class="iconfont icontuichudenglu" @click="signOut()"></i>
        </div>
      </el-header>
      <Breadcrumb :name="$route.name" :path="$route.path" />
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MobNavbar from '@/components/MobNavbar/MobNavbar'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import {
  SignOutApi
} from '@/api/login'

export default {
  components: {
    MobNavbar,
    Breadcrumb
  },
  data () {
    return {
      isCollapse: false,
      isMobNavbarShow: false,
      diamon: JSON.parse(sessionStorage.userinfo).diamond_amount ? JSON.parse(sessionStorage.userinfo).diamond_amount : 0,
      rebate: JSON.parse(sessionStorage.userinfo).rebate_amount ? JSON.parse(sessionStorage.userinfo).rebate_amount : 0
    }
  },
  methods: {
    /**
     * @description 退出登录
     */
    signOut () {
      this.$confirm('此操作将退出后台系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SignOutApi()
          .then(res => {
            if (res.data.code === 0) {
              sessionStorage.removeItem('userinfo')
              this.$router.push('/login')
            }
          })
      }).catch(() => {})
    },
    /**
     * @description MobNavbar回传值
     */
    navbarByVal (val) {
      this.isMobNavbarShow = val
    }
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#layout {
  .toggle-icon {
    float: left;
    transform: rotate(0);
    transition: all ease-in .3s;
  }

  .header-tool {
    @include flex-box(row, center, center, nowrap);
    float: right;
    cursor: pointer;

    .num {
      font-size: 13px;
      color: #606266;
      margin: 0 5px;
      font-weight: bold;
    }

    .el-icon-bell{
      font-size: 18px;
      margin: 0 2px 0 5px;
    }
  }

  .iconfont {
    margin-right: 10px;
  }

  .diamon {
    font-size: 17px;
    margin: 0;
    padding-bottom: 1px;
  }

  .iconfanli {
    font-size: 23px;
    margin: 0;
  }

  .icontuichudenglu {
    font-size: 18px;
    margin: 0 0 0 10px;
  }

  .icontoggle {
    font-size: 20px;
    font-weight: bold;
  }
}

.el-container {
  height: 100%;
}

.el-menu {
  border: none;
}

.el-header {
  @include flex-box(row, space-between, center, nowrap);
  background-color: #fff;
  color: #333;
  height: 55px !important;
}

.el-aside {
  width: auto !important;
  background: #001529;
}

.el-submenu .el-menu-item {
  text-align: center;
  background-color: #010b15c2 !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
}
</style>
