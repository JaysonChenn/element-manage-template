<template>
  <div id="agent">
    <div class="container">
      <!-- pc -->
      <el-steps :active="step" simple class="hidden-sm-and-down">
        <el-step title="充值卡" icon="el-icon-search"></el-step>
        <el-step title="支付方式" icon="el-icon-upload"></el-step>
        <el-step title="完成" icon="el-icon-check"></el-step>
      </el-steps>
      <!-- mobile -->
      <el-steps :active="step" simple class="hidden-md-and-up">
        <el-step title="充值卡" icon="el-icon-search"></el-step>
        <el-step title="渠道" icon="el-icon-upload"></el-step>
        <el-step title="完成" icon="el-icon-check"></el-step>
      </el-steps>
      <div class="inside-content">
        <div class="step-one"
        v-show="step === 1">
          <el-row :gutter="10">
            <el-col
            v-for="(item, index) in cardArr"
            :key="index"
            :sm="24"
            :md="12"
            :lg="8">
              <div class="card">
                <div class="top">
                  <div class="icon">
                    <i class="iconfont iconzaixianchongzhi"></i>
                  </div>
                  <div class="content">
                    <p class="title">{{item.charge_card_name}}</p>
                    <p class="price">(可购得{{item.item_buy_amount}}钻石)</p>
                  </div>
                </div>
                <div class="bottom" @click="cardInfo = item; step = 2">
                  <span>点击购买</span>
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="step-two" v-show="step === 2">
          <el-form
          :model="payForm"
          :rules="payRules"
          ref="payForm">
            <el-form-item>
              <el-radio-group
              v-model="payForm.payType">
                <el-radio
                :label="item"
                v-for="(item, index) in cardInfo.payment_method"
                :key="index">
                  <i :class="+item === 1 ? 'iconfont iconchangyonglogo28' : 'iconfont iconrectangle390'"></i>
                  {{item == 1 ? '微信' : '支付宝'}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button
              type="primary"
              size="small"
              @click="submitCharge()">
              充值
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  RecordCardApi,
  ChargeApi
} from '@/api/agent'

export default {
  data () {
    const valiDiamon = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('充值钻石数不能为空'))
      } else {
        callback()
      }
    }
    return {
      step: 1,
      payForm: {
        payType: ''
      },
      payRules: {
        diamon: [{
          required: true,
          trigger: 'blur',
          validator: valiDiamon
        }]
      },
      cardArr: [],
      cardInfo: {}
    }
  },
  methods: {
    /**
     * @description 获取默认信息
     */
    getDefaultInfo () {
      let param = {
        sum_data: 'yes',
        size: 100,
        start: 1,
        order: 'desc',
        payment_can_be_buy: 1
      }
      RecordCardApi(param)
        .then(res => {
          if (res.data.code === 0) {
            this.cardArr = res.data.data.data
          }
        })
    },

    /**
     * @description 充值钻石数
     */
    submitCharge () {
      this.$refs['payForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认充值吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let param = {
              pay_method: +this.payForm.payType === 1 ? 'weixin' : +this.payForm.payType === 2 ? 'alipay' : '',
              temp_id: this.cardInfo.id
            }
            ChargeApi(param)
              .then(res => {
                if (res.data.code === 0) {
                  window.location = res.data.data.pay_link
                }
              })
          }).catch(() => {})
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

#agent {
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
      overflow: auto;
      overflow-x: hidden;
      .step-one{
        flex: 1;
        align-self: stretch;
        .card{
          @include flex-box(column, center, center, nowrap);
          height: 150px;
          box-shadow: 4px 4px 40px rgba(0,0,0,.05);
          .top{
            @include flex-box(row, center, center, nowrap);
            align-self: stretch;
            flex: 1;
            .icon{
              cursor: pointer;
              padding: 10px;
              margin-left: 30px;
              border-radius: 5px;
              .iconzaixianchongzhi{
                font-size: 60px;
                color: #36a3f7
              }
            }
            .icon:hover{
              background: #36a3f7;
              .iconzaixianchongzhi{
                color: #fff;
              }
            }
            .content{
              @include flex-box(column, center, flex-end, nowrap);
              padding: 40px 45px 40px 0;
              flex: 1;
              align-self: stretch;
              .title{
                font-size: 16px;
                color: rgba(0,0,0,.45);
                font-weight: bold;
                text-align: right;
              }
              .price{
                text-align: right;
                font-size: 14px;
                font-weight: 700;
                color: #666;
              }
            }
          }
          .bottom{
            @include flex-box(row, flex-end, center, nowrap);
            align-self: stretch;
            padding: 0 5px;
            height: 18px;
            line-height: 18px;
            background: #36a3f7;
            font-size: 12px;
            color: #fff;
            opacity: .7;
            cursor: pointer;
            i{
              float: right
            }
          }
        }
        .card:nth-of-type(3n+1){
          margin-top: 20px
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
        .iconchangyonglogo28{
          font-size: 22px;
          color: rgb(0, 200, 0);
        }
        .iconrectangle390{
          font-size: 20px;
          color: #409eff;
        }
      }
    }

    .el-steps--simple{
      padding: 6px 8px;
    }
  }
}
</style>
