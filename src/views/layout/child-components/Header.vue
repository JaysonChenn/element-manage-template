<template>
  <el-header id="header">
    <div class="toggle-icon hidden-sm-and-down" :style="isCollapse ? 'transform: rotate(-90deg)' : ''">
      <i class="iconfont icontoggle" @click="setCollaspse"></i>
    </div>
    <div class="toggle-icon hidden-md-and-up">
      <i class="iconfont icontoggle" @click="setMobNavbarShow"></i>
    </div>
    <div class="header-tool">
      <i class="iconfont iconlv_zuanshi diamon"></i>
      <span class="num">{{userInfo.diamond_amount}}</span>
      <i class="iconfont iconfanli"></i>
      <span class="num">{{userInfo.rebate_amount}}</span>
      <i class="iconfont iconxieyixiangqing" @click="dialogVisible = true"></i>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <el-badge v-if="mesInfo.unreadArr" :value="mesInfo.unreadArr.length" class="item">
            <i class="el-icon-bell"></i>
          </el-badge>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix">
              <span @click="PublicMethod.toPage('/notify', {type: 'unread'}), reload()">未读</span>
            <el-badge class="mark" v-if="mesInfo.unreadArr" :value="mesInfo.unreadArr.length" />
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
              <span @click="PublicMethod.toPage('/notify', {type: 'haveread'}), reload()">已读</span>
            <el-badge class="mark" v-if="mesInfo.havereadArr" :value="mesInfo.havereadArr.length" type="info"/>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <i class="iconfont icontuichudenglu" @click="signOut()"></i>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="true">
      <span v-html="documentText"></span>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </el-header>
</template>

<script>
import {
  SignOutApi
} from '@/api/login'
import {
  AgentAgreementApi
} from '@/api/agreement'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      dialogVisible: false,
      documentText: null
    }
  },
  computed: {
    ...mapState(['userInfo', 'mesInfo', 'isCollapse'])
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setMesInfo', 'setCollaspse', 'setMobNavbarShow']),
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
              this.setMesInfo({})
              this.setUserInfo({})
              this.$router.push('/login')
            }
          })
      }).catch(() => {})
    },
    /**
     * @description 获取默认信息
     */
    getDefaultInfo () {
      AgentAgreementApi()
        .then(res => {
          if (res.data.code === 0) {
            this.documentText = res.data.data.agent_agreement
          }
        })
    }
  },
  mounted () {
    this.getDefaultInfo()
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#header{
  @include flex-box(row, space-between, center, nowrap);
  background-color: #fff;
  color: #333;
  height: 55px !important;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  .toggle-icon {
    float: left;
    transform: rotate(0);
    transition: all ease-in .3s;
  }

  .header-tool {
    @include flex-box(row, center, center, nowrap);
    float: right;
    align-self: stretch;

    .num {
      font-size: 13px;
      color: #606266;
      margin: 0 5px;
      font-weight: bold;
    }

    .el-icon-bell{
      font-size: 18px;
      margin: 0 2px 0 5px;
      cursor: pointer;
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

  .iconlv_zuanshi{
    font-size: 18px
  }

  .iconfanli {
    font-size: 23px;
    margin: 0;
  }

  .iconxieyixiangqing{
    margin: 0 6px;
    cursor: pointer;
  }

  .icontuichudenglu {
    font-size: 18px;
    margin: 0 0 0 10px;
    cursor: pointer;
  }

  .icontoggle {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
