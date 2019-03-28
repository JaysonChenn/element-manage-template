<template>
  <div id="diamon">
    <div class="container">
      <el-steps :active="step" simple>
        <el-step title="用户信息" icon="el-icon-search"></el-step>
        <el-step title="充值数量" icon="el-icon-upload"></el-step>
        <el-step title="完成充值" icon="el-icon-check"></el-step>
      </el-steps>
      <div class="inside-content">
        <div class="step-one" v-show="step === 1">
          <p class="title">
            <i class="el-icon-search"></i>
            查询用户信息
          </p>
          <el-form :model="searchForm" :rules="searchRules" ref="searchForm" class="search-form">
            <el-form-item prop="id">
              <el-input v-model="searchForm.id" placeholder="请填写游戏ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="searchUserInfo()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="step-two" v-show="step === 2">
          <el-form :model="chargeForm" :rules="chargeRules" ref="chargeForm" class="charge-form">
            <el-form-item>
              <img class="avatar" :src="userInfo.avatar" alt="">
            </el-form-item>
            <el-form-item>
              {{userInfo.nickname}}(ID：{{userInfo.id}})
            </el-form-item>
            <el-form-item>
              当前钻石({{userInfo.account_now}})
            </el-form-item>
            <el-form-item prop="diamon">
              <el-input v-model="chargeForm.diamon" placeholder="请输入充值钻石数"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="chargeDiamon()">充值</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="step-three" v-show="step === 3">
          <i class="el-icon-success"></i>
          <P>充值成功</P>
          <p class="back" @click="backPage()">
            <i class="el-icon-back"></i>点击返回
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  PlayerInfoApi,
  ChargeDiamonApi
} from '@/api/diamon'

export default {
  data () {
    const valiId = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('游戏ID不能为空'))
      } else {
        callback()
      }
    }
    const valiDiamon = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('充值钻石数不能为空'))
      } else {
        callback()
      }
    }
    return {
      step: 1,
      searchForm: {
        id: ''
      },
      chargeForm: {
        diamon: ''
      },
      searchRules: {
        id: [{
          required: true,
          trigger: 'blur',
          validator: valiId
        }]
      },
      chargeRules: {
        diamon: [{
          required: true,
          trigger: 'blur',
          validator: valiDiamon
        }]
      },
      userInfo: {}
    }
  },
  methods: {
    /**
     * @description 查询用户信息
     */
    searchUserInfo () {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          PlayerInfoApi(this.searchForm.id)
            .then(res => {
              if (res.data.code === 0) {
                this.userInfo = res.data.data
                this.step = 2
              }
            })
        }
      })
    },
    /**
     * @description 充值钻石数
     */
    chargeDiamon () {
      this.$refs['chargeForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认充值钻石吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let param = {
              player_id: this.userInfo.id,
              diamond_num: this.chargeForm.diamon,
              user_agent_id: JSON.parse(sessionStorage.userinfo).user_id
            }
            ChargeDiamonApi(param)
              .then(res => {
                if (res.data.code === 0) {
                  this.step = 3
                }
              })
          }).catch(() => {})
        }
      })
    },
    /**
     * @description 返回
     */
    backPage () {
      this.$refs['searchForm'].resetFields()
      this.$refs['chargeForm'].resetFields()
      this.step = 1
    }
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#diamon {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  .container {
    @include flex-box(column, unset, unset, nowrap);
    flex: 1;
    background: #fff;
    padding: 16px;

    .inside-content{
      @include flex-box(column, flex-start, center, nowrap);
      flex: 1;
      .step-one{
        text-align: center;
        margin-top: 30px;
        .title{
          padding: 30px;
          color: gray;
        }
        .search-form{
          @include flex-box(column, center, center, nowrap);
        }
      }
      .step-two{
        margin-top: 30px;
        text-align: center;
        .avatar{
          width: 80px;
          margin: 0 auto;
          display: block;
          border-radius: 50%;
        }
      }
      .step-three{
        flex: 1;
        @include flex-box(column, center, center, nowrap);
        margin-top: 30px;
        .el-icon-success{
          font-size: 40px;
          color: #67C23A;
        }
        p{
          margin: 10px;
        }
        .back{
          font-size: 12px;
          cursor: pointer;
        }
      }
    }

    .el-steps--simple{
      padding: 6px 8px;
    }
  }
}
</style>
