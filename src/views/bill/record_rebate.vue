<template>
  <div id="recordrebate">
    <el-row class="toolbar">
      <el-input
      v-model="agentId"
      @input="PublicMethod.toPage('/mybill/chargerebate', PublicMethod.removeProperty({agentId: agentId, diamonStart: diamonStart, diamonEnd: diamonEnd}))"
      placeholder="代理ID"
      size="small"
      class="input w-150"
      clearable>
      </el-input>
      <el-input
      v-model="diamonStart"
      @input="PublicMethod.toPage('/mybill/chargerebate', PublicMethod.removeProperty({agentId: agentId, diamonStart: diamonStart, diamonEnd: diamonEnd}))"
      placeholder="砖石范围起"
      size="small"
      class="input w-150"
      clearable>
      </el-input>
      <span class="arrow">-</span>
      <el-input
      v-model="diamonEnd"
      @input="PublicMethod.toPage('/mybill/chargerebate', PublicMethod.removeProperty({agentId: agentId, diamonStart: diamonStart, diamonEnd: diamonEnd}))"
      placeholder="砖石范围止"
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
        prop="user_agent_user_id"
        align="center"
        label="代理ID">
        </el-table-column>
        <el-table-column
        prop="user_agent_name"
        align="center"
        label="名字">
        </el-table-column>
        <el-table-column
        prop="user_agent_phone"
        align="center"
        label="手机号">
        </el-table-column>
        <el-table-column
        prop="diamond_num"
        align="center"
        label="返砖数量">
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
  RecordRebateApi
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
      pageSize: 13,
      diamonStart: '',
      diamonEnd: '',
      agentId: ''
    }
  },
  methods: {
    /**
     * @description 获取默认信息
     * @param
     * {
     *  sum_data 是否计算总数
     *  order 默认排序
     *  datetime__gte 最近3天数据
     *  diamond_num__gte 砖石范围起
     *  diamond_num__lte 砖石范围止
     *  agent_id 代理ID
     *  size 数据数量
     *  start 当前页
     * }
     */
    getDefaultInfo () {
      let param = {
        sum_data: 'yes',
        order: 'desc',
        datetime__gte: new Date(new Date().setHours(0, 0, 0, 0)) * 1 - 86400000 * 3,
        diamond_num__gte: this.diamonStart,
        diamond_num__lte: this.diamonEnd,
        size: this.pageSize,
        start: this.currentPage,
        agent_id: this.agentId
      }
      RecordRebateApi(this.PublicMethod.removeProperty(param))
        .then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.data
            this.totalPage = res.data.data.total
          }
        })
    }
  },
  mounted () {
    this.PublicMethod.bindRouteParamToData(this.$route.query, this.$data)
    this.getDefaultInfo()
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#recordrebate{
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
