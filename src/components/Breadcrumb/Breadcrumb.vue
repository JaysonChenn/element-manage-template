<template>
  <div id="breadcrumb" class="hidden-sm-and-down">
    <div class="name">{{name}}</div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/userinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    path: String
  },
  methods: {
    /**
     * @description 页面跳转
     */
    toPage (path, params) {
      this.$router.push({
        path: path,
        query: params
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#breadcrumb {
  position: relative;
  padding: 6px 20px;
  background-color: #f8f8f8;

  .name {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 22px;
    line-height: 22px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    border-radius: 3px;
  }

  .el-breadcrumb {
    position: absolute;
    right: 20px;
    top: 50%;
    @include translate(0, -50%);
    font-size: 13px;
    float: right;
  }

  .el-breadcrumb__item {
    color: #97a8be;
  }
}
</style>
