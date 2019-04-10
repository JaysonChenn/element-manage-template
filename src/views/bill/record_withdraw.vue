<template>
  <div id="recordwithdraw" class="container">
    <el-row class="toolbar">
      <el-select
      v-model="payTypeId"
      placeholder="选择支付方式"
      size="small"
      class="w-150"
      clearable
      @change="PublicMethod.toPage('/mybill/chargewithdraw', PublicMethod.removeProperty({payTypeId: payTypeId, withdrawStart: withdrawStart, withdrawEnd: withdrawEnd}))">
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
      </el-select>
      <el-input
      v-model="withdrawStart"
      @input="PublicMethod.toPage('/mybill/chargewithdraw', PublicMethod.removeProperty({payTypeId: payTypeId, withdrawStart: withdrawStart, withdrawEnd: withdrawEnd}))"
      placeholder="提现范围起"
      size="small"
      class="input w-150"
      clearable>
      </el-input>
      <span class="arrow">-</span>
      <el-input
      v-model="withdrawEnd"
      @input="PublicMethod.toPage('/mybill/chargewithdraw', PublicMethod.removeProperty({payTypeId: payTypeId, withdrawStart: withdrawStart, withdrawEnd: withdrawEnd}))"
      placeholder="提现范围止"
      size="small"
      class="input w-150"
      clearable>
      </el-input>
      <el-button
      type="primary"
      size="small"
      @click="getDefaultInfo(); currentPage = 1"
      >查询</el-button>
    </el-row>
    <el-row class="inside-container">
      <el-table
      :data="tableData"
      :border="true"
      size="small"
      stripe>
        <el-table-column
        prop="id"
        align="center"
        label="ID">
        </el-table-column>
        <el-table-column
        prop="cash_num"
        align="center"
        label="提现金额">
          <template slot-scope="slot">
            <i class="iconfont iconqiandai"></i>
            {{slot.row.cash_num}}
          </template>
        </el-table-column>
        <el-table-column
        prop="diamond_num"
        align="center"
        label="对应钻石数">
        </el-table-column>
        <el-table-column
        prop="pay_type"
        align="center"
        label="支付方式">
          <template slot-scope="slot">
            {{slot.row.pay_type == 1 ? '微信' : slot.row.pay_type == 2 ? '支付宝' : '银行卡'}}
          </template>
        </el-table-column>
        <el-table-column
        prop="bank_name"
        align="center"
        label="支付渠道">
        </el-table-column>
        <el-table-column
        prop="account_name"
        align="center"
        label="户主姓名">
        </el-table-column>
        <el-table-column
        prop="bank_account"
        align="center"
        label="银行卡号">
        </el-table-column>
        <el-table-column
        prop="apply_time"
        align="center"
        label="申请时间">
          <template slot-scope="slot">
            {{PublicMethod.formatDate(slot.row.apply_time)}}
          </template>
        </el-table-column>
        <el-table-column
        prop="order_status"
        align="center"
        label="订单状态">
          <template slot-scope="slot">
            <el-tag type="danger" size="small" v-if="slot.row.order_status === 0">已拒绝</el-tag>
            <el-tag type="success" size="small" v-else-if="slot.row.order_status === 1">已支付</el-tag>
            <el-tag size="small" v-else>未处理</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="footer">
      <el-pagination
        small
        @current-change="getDefaultInfo"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalPage">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import {
  RecordWithdrawApi
} from '@/api/bill'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'

export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      tableData: [],
      payTypeId: '',
      currentPage: 1,
      totalPage: 0,
      pageSize: 13,
      withdrawStart: '',
      withdrawEnd: '',
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '微信'
      }, {
        value: 2,
        label: '支付宝'
      }, {
        value: 3,
        label: '银行卡'
      }]
    }
  },
  methods: {
    /**
     * @description 获取默认信息
     * @param
     * {
     *  sum_data 是否计算总数
     *  order 默认排序
     *  apply_time__gte 最近3天时间数据
     *  cash_num__gte 提现范围起
     *  cash_num__lte 提现范围止
     *  pay_type 支付类型
     *  size 数据数量
     *  start 当前页
     * }
     */
    getDefaultInfo () {
      let param = {
        sum_data: 'yes',
        order: 'desc',
        apply_time__gte: new Date(new Date().setHours(0, 0, 0, 0)) * 1 - 86400000 * 3,
        cash_num__gte: this.withdrawStart,
        cash_num__lte: this.withdrawEnd,
        size: this.pageSize,
        start: this.currentPage,
        pay_type: this.payTypeId
      }
      RecordWithdrawApi(this.PublicMethod.removeProperty(param))
        .then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.data
            this.totalPage = res.data.data.total
          }
        })
    }
  },
  mounted () {
    this.getDefaultInfo()
    this.PublicMethod.bindRouteParamToData(this.$route.query, this.$data)
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#recordwithdraw{
  @include flex-box(column, flex-start, none);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  background: #fff;
  width: 100%;
  height: 100%;

  .toolbar {
    padding: 16px;
    border-bottom: 1px solid #eef3f7;

    .el-button+.el-button {
      margin: 0;
    }
  }

  .inside-container{
    padding: 10px;
    flex: 1;
    overflow: auto;
  }

  .footer{
    text-align: center;
    height: auto!important;
    padding: 16px 0
  }
}
</style>
