<template>
  <div id="mobnavbar">
    <header>
      <i class="iconfont iconquxiao" @click="cancelNavbar"></i>
    </header>
    <section>
      <ul>
        <li v-for="(item, index) in navBarArr" :key="index">
          <div :class="[$route.path == item.path ? 'active-navbar' : '']" class="select-title" @click="item.children.length > 1 ? handleExpand('expand', item, index) : handleExpand('location', item, index)">
            <i :class="`iconfont ${item.icon}`"></i>
            <span class="navar-title">{{item.name}}</span>
            <i :class="item.isSelected? 'el-icon-arrow-up arrow' : 'el-icon-arrow-down arrow'" v-if="item.children.length > 1"></i>
          </div>
          <div class="select-content" :style="item.isSelected? 'display: block' : 'display: none'">
            <p v-show="item.children.length > 1" v-for="(itemChild, indexChild) in item.children" :key="indexChild"
              @click="toPage(itemChild.path, ''); cancelNavbar()">
              <span :class="[$route.path == itemChild.path ? 'active-navbar' : '']">{{itemChild.name}}</span>
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      navBarArr: []
    }
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
    },

    /**
     * @description 取消弹框
     */
    cancelNavbar () {
      this.$emit('navbarByVal', false)
    },

    /**
     * @description 侧边栏数据重置
     */
    resetNavData () {
      let routerObj = this.$router.options.routes.slice(2)
      routerObj.forEach(item => {
        if (item.children.length > 1) {
          item.isSelected = false
        };
        this.navBarArr.push(item)
      })
    },

    /**
     * @description 处理展开选择框
     */
    handleExpand (val, items, index) {
      switch (val) {
        case 'expand':
          this.navBarArr.forEach((item, indexs) => {
            if (index === indexs) {
              item.isSelected = !item.isSelected
            };
          })
          break
        case 'location':
          this.navBarArr.forEach((item, indexs) => {
            if (item.isSelected) {
              item.isSelected = false
            };
          })
          this.toPage(items.path, '')
          this.cancelNavbar()
          break
      }
    }
  },
  mounted () {
    this.resetNavData()
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#mobnavbar {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 0;
  z-index: -1;
  background: rgba(0, 0, 0, .98);
  transition: height ease-in .15s;

  header {
    padding: 20px;

    .iconquxiao {
      font-size: 20px;
      color: #fff;
    }
  }

  section {
    padding: 10px 45px;
    flex: 1;
    overflow: auto;

    ul {
      padding: 0;
      list-style: none;

      li {
        color: #fff;
        font-size: 14px;
        padding: 12px 0;

        .el-icon-arrow-down {
          float: right;
        }

        p {
          margin: 0;
          padding: 12px 20px 0 35px;
        }

        .select-title {
          @include flex-box(row, flex-start, center, nowrap);
          cursor: pointer;
        }

        .navar-title{
          margin-left: 10px;
        }

        .arrow{
          flex: 1;
          text-align: right
        }

        .select-content {
          p {
            cursor: pointer;
          }
        }
      }
    }

    .active-navbar {
      color: #409EFF;
    }
  }
}
</style>
