<template>
  <div id="recordsale">
    <el-row class="toolbar">
      <el-input
      v-model="playId"
      @input="PublicMethod.toPage('/mybill/chargesale', PublicMethod.removeProperty({playId: playId, diamonStart: diamonStart, diamonEnd: diamonEnd}))"
      placeholder="玩家ID"
      size="small"
      class="input w-150"
      clearable>
      </el-input>
      <el-input
      v-model="diamonStart"
      @input="PublicMethod.toPage('/mybill/chargesale', PublicMethod.removeProperty({playId: playId, diamonStart: diamonStart, diamonEnd: diamonEnd}))"
      placeholder="砖石范围起"
      size="small"
      class="input w-150"
      clearable>
      </el-input>
      <span class="arrow">-</span>
      <el-input
      v-model="diamonEnd"
      @input="PublicMethod.toPage('/mybill/chargesale', PublicMethod.removeProperty({playId: playId, diamonStart: diamonStart, diamonEnd: diamonEnd}))"
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
        prop="avatar"
        align="center"
        label="头像">
          <template slot-scope="slot">
            <img :src="slot.row.avatar" alt="头像" class="avatar">
          </template>
        </el-table-column>
        <el-table-column
        prop="id"
        align="center"
        label="ID">
        </el-table-column>
        <el-table-column
        prop="player_id"
        align="center"
        label="玩家ID">
        </el-table-column>
        <el-table-column
        prop="nickname"
        align="center"
        label="玩家昵称">
        </el-table-column>
        <el-table-column
        prop="diamond_num"
        align="center"
        label="购买砖石">
        </el-table-column>
        <el-table-column
        prop="datetime"
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
  RecordSaleApi
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
      pageSize: 10,
      diamonStart: '',
      diamonEnd: '',
      playId: ''
    }
  },
  methods: {
    /**
     * @description 获取默认信息
     * @param
     * {
     *  sum_data 是否计算总数
     *  order 默认排序
     *  datetime__gte 最近3天时间
     *  diamond_num__gte 砖石范围起
     *  diamond_num__lte 砖石范围止
     *  player_id 玩家ID
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
        player_id: this.playId
      }
      RecordSaleApi(this.PublicMethod.removeProperty(param))
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

#recordsale{
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

    .avatar{
      width: 23px;
      display: block;
      margin: 0 auto;
    }
  }

  .footer{
    text-align: center;
    height: auto!important;
    padding: 16px 0
  }
}
</style>
