<template>
  <div id="recordrecharge">
    <el-row class="toolbar">
      <el-input
      v-model="chargeStart"
      @input="PublicMethod.toPage('/mybill/chargerecord', PublicMethod.removeProperty({chargeStart: chargeStart, chargeEnd: chargeEnd}))"
      placeholder="充值范围起"
      size="small"
      class="input w-150"
      clearable>
      </el-input>
      <span class="arrow">-</span>
      <el-input
      v-model="chargeEnd"
      @input="PublicMethod.toPage('/mybill/chargerecord', PublicMethod.removeProperty({chargeStart: chargeStart, chargeEnd: chargeEnd}))"
      placeholder="充值范围止"
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
        label="充值金额">
          <template slot-scope="slot">
            <i class="iconfont iconqiandai"></i>
            {{slot.row.cash_num/100}}
          </template>
        </el-table-column>
        <el-table-column
        prop="diamond_num"
        align="center"
        label="砖石数量">
        </el-table-column>
        <el-table-column
        prop="diamond_num"
        align="center"
        label="购买日期">
          <template slot-scope="slot">
            {{PublicMethod.formatDate(slot.row.datetime)}}
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
  RecordRechargeApi
} from '@/api/bill'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'

export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 15,
      chargeStart: '',
      chargeEnd: ''
    }
  },
  methods: {
    /**
     * @description 获取默认信息
     * @param
     * {
     *  sum_data 是否计算总数
     *  order 默认排序
     *  created_time__gte 最近3天数据
     *  price__gte 充值范围起
     *  price__lte 充值范围止
     *  size 数据数量
     *  start 当前页
     *  status 状态
     * }
     */
    getDefaultInfo () {
      let param = {
        sum_data: 'yes',
        order: 'desc',
        // created_time__gte: new Date(new Date().setHours(0, 0, 0, 0)) * 1 - 86400000 * 3,
        // status: 40,
        price__gte: this.chargeStart * 100 === 0 ? '' : this.chargeStart * 100,
        price__lte: this.chargeEnd * 100 === 0 ? '' : this.chargeEnd * 100,
        size: this.pageSize,
        start: this.currentPage
      }
      RecordRechargeApi(this.PublicMethod.removeProperty(param))
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

#recordrecharge{
  @include flex-box(column, flex-start, none);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  background: #fff;
  width: 100%;
  height: 100%;
  .toolbar{
    padding: 16px;
    border-bottom: 1px solid #eef3f7;

    .el-button+.el-button {
      margin: 0;
    }

    .arrow {
      color: #C0C4CC;
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
