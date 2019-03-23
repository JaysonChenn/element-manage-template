<template>
  <div id="recordrecharge">
    <div class="container">
      <el-row class="toolbar">
        <el-input v-model="input" placeholder="请输入内容" size="small" class="input"></el-input>
        <el-button type="primary" size="small">查询</el-button>
        <el-button type="primary" size="small">新增</el-button>
      </el-row>
      <el-row class="content-box">
        <el-table :data="tableData" stripe>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="date" label="日期">
          </el-table-column>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  UserInfoApi
} from '@/api/userinfo'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'

export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      input: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    /**
     * @description 获取默认信息
     */
    getDefaultInfo () {
      let userId = JSON.parse(sessionStorage.getItem('userinfo')).user_id
      UserInfoApi(userId)
        .then(res => {

        })
    }
  },
  mounted () {
    this.getDefaultInfo()
  }
}
</script>

<style lang="scss" scoped>
#recordrecharge {
  display: flex;
  flex-direction: column;
  height: 100%;

  .container {
    flex: 1;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

    .toolbar {
      padding: 16px;
      border-bottom: 1px solid #eef3f7;

      .el-button+.el-button {
        margin: 0;
      }

      .input {
        width: auto;
      }
    }

    .content-box {
      padding: 10px;
    }
  }
}
</style>
