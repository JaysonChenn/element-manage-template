<template>
  <div id="customer">
    <el-row class="toolbar">
      <el-tag>代理({{agentName}})</el-tag>
    </el-row>
    <el-row class="inside-container">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="头像">
          <template slot-scope="slot">
            <img class="avatar" :src="slot.row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="player_id"
          label="玩家ID">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="玩家昵称">
        </el-table-column>
        <el-table-column
          prop="buy_times"
          label="充值次数">
        </el-table-column>
        <el-table-column
          prop="all_buy_diamond_amount"
          label="总充值数量">
        </el-table-column>
        <el-table-column
          prop="last_buy_diamond_amount"
          label="最近充值数">
        </el-table-column>
        <el-table-column
          prop="last_charge_time"
          label="最近充值时间">
          <template slot-scope="slot">
            {{PublicMethod.formatDate(slot.row.last_charge_time)}}
          </template>
        </el-table-column>
         <el-table-column
          label="操作">
          <template slot-scope="slot">
            <el-button type="primary" size="mini" @click="handleCharge(slot.row)">充值</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="footer"></el-row>

    <el-dialog title="充值砖石" :visible.sync="chargeToast" width="50%" @close="resetForm()">
      <el-form :model="chargeForm" ref="chargeForm" :rules="chargeRules">
        <el-form-item class="user-avatar">
          <img :src="userInfo.avatar" alt="">
        </el-form-item>
        <el-form-item class="user-nickname">
          {{userInfo.nickname}}(ID: {{userInfo.player_id}})
        </el-form-item>
        <el-form-item class="user-nickname">
          当前钻石：{{userInfo.account_now}}
        </el-form-item>
        <el-form-item class="user-diamon" prop="diamon">
          <el-input v-model="chargeForm.diamon" placeholder="请输入充值砖石数" size="small" width="50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chargeToast = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  MyCustomerApi,
  DiamonChargeApi
} from '@/api/customer'

export default {
  data () {
    const valiDiamon = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('充值砖石数不能为空'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      agentName: JSON.parse(sessionStorage.getItem('userinfo')).agent_phone,
      chargeToast: false,
      chargeForm: {
        diamon: ''
      },
      userInfo: {},
      input: '',
      chargeRules: {
        diamon: [{
          required: true,
          trigger: 'blur',
          validator: valiDiamon
        }]
      }
    }
  },
  methods: {
    /**
     * @description 获取默认信息
     */
    getDefaultInfo () {
      let userObJ = JSON.parse(sessionStorage.getItem('userinfo'))
      let param = {
        user_agent_id: userObJ.user_id
      }
      if (userObJ && userObJ !== null) {
        MyCustomerApi(param)
          .then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data
            }
          })
      }
    },
    /**
     * @description 充值弹框
     */
    handleCharge (val) {
      this.chargeToast = true
      this.userInfo = val
    },
    /**
     * @description 提交表单
     */
    submitForm () {
      this.$refs['chargeForm'].validate((valid) => {
        if (valid) {
          this.chargeToast = false
          let param = {
            player_id: this.userInfo.player_id,
            diamond_num: this.chargeForm.diamon,
            user_agent_id: this.userInfo.user_agent_id
          }
          DiamonChargeApi(param)
            .then(res => {
              if (res.data.code === 0) {
                this.$message({
                  message: '充值成功',
                  type: 'success'
                })
                this.getDefaultInfo()
              }
            })
        }
      })
    },
    /**
     * @description 重置Form
     */
    resetForm () {
      this.$refs['chargeForm'].resetFields()
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

#customer{
  @include flex-box(column, flex-start, none);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  background: #fff;
  width: 100%;
  height: 100%;
  .toolbar{
    padding: 16px;
    border-bottom: 1px solid #eef3f7;
  }

  .inside-container{
    padding: 10px;
    flex: 1;
    overflow: auto;

    .avatar{
      width: 30px;
      display: block;
    }
  }

  .footer{
    text-align: center;
    height: auto!important;
    padding: 16px 0
  }

  .user-avatar{
    img{
      width: 80px;
      display: block;
      margin: 0 auto;
      border-radius: 50%;
    }
  }

  .user-nickname{
    text-align: center;
    margin: 0
  }

  .user-diamon{
    width: 50%;
    margin: 0 auto;
  }
}
</style>
