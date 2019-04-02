<template>
  <div id="userinfo">
    <el-row :gutter="10" style="width: 100%">
      <el-col :md="24" :lg="12">
        <div class="basic-info">
          <div class="bg"></div>
          <div class="info">
            <p>用户名：{{userInfo.agent_name}}</p>
            <p>游戏Id：{{userInfo.player_id}}</p>
            <p>手机号：{{userInfo.agent_phone}}</p>
            <p v-if="userInfo.login_time">登录时间：{{PublicMethod.formatDate(userInfo.login_time)}}</p>
            <P v-if="userInfo.regist_time">注册时间：{{PublicMethod.formatDate(userInfo.regist_time)}}</P>
          </div>
        </div>
      </el-col>
      <el-col :md="24" :lg="12">
        <div class="other-info">
          <div class="info">
            <p>代理类型：{{userInfo.agent_type}}</p>
            <P>上级代理名：{{userInfo.parent_agent_name}}</P>
            <p>上级代理手机号：{{userInfo.parent_agent_phone}}</p>
            <P v-if="userInfo.child_agents">下级代理数：{{userInfo.child_agents.length}}<i class="el-icon-search" @click="checkAgent()"></i></P>
            <p>剩余钻石数：{{userInfo.diamond_amount}}</p>
          </div>
          <div class="info">
            <p>总返利钻石数：{{userInfo.rebate_all}}</p>
            <P>可领取砖石数：{{userInfo.rebate_amount}}</P>
            <p></p>
            <p></p>
            <p></p>
          </div>
        </div>
      </el-col>
      <el-col>
        <div id="myChart" class="echart"></div>
      </el-col>
  </el-row>

  <el-dialog title="下级代理" :visible.sync="juniorAgentVisibal">
    <el-table :data="juniorData">
      <el-table-column property="agent_phone" label="手机号"></el-table-column>
      <el-table-column property="agent_name" label="代理名称"></el-table-column>
    </el-table>
  </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import {
  UserInfoApi,
  JuniorAgentApi
} from '@/api/userinfo'
import {
  NotifyMesApi
} from '@/api/notify'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  components: {
    Breadcrumb
  },
  inject: ['reload'],
  data () {
    return {
      myChart: '',
      juniorAgentVisibal: false,
      juniorData: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setMesInfo']),
    /**
     * @description 获取默认信息
     */
    async getDefaultInfo () {
      if (JSON.parse(sessionStorage.userinfo) && JSON.parse(sessionStorage.userinfo) !== null) {
        await UserInfoApi(JSON.parse(sessionStorage.userinfo).user_id)
          .then(res => {
            sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
            this.setUserInfo(res.data.data)
          })
        await NotifyMesApi()
          .then(res => {
            if (res.data.code === 0) {
              let obj = {}
              obj.allArr = res.data.data.data
              obj.unreadArr = res.data.data.data.filter(item => { return item.notice_state === 0 })
              obj.havereadArr = res.data.data.data.filter(item => { return item.notice_state !== 0 })
              this.setMesInfo(obj)
            }
          })
        await this.initEchart()
      }
    },
    /**
     * @description 查看下级代理
     * @param
     * {
     *  parent_agent_id id
     *  size 分页大小
     *  start 当前页
     *  order 排序方式
     * }
     */
    checkAgent () {
      this.juniorAgentVisibal = true
      let param = {
        parent_agent_id: this.userInfo.id,
        size: 15,
        start: 1,
        order: 'desc'
      }
      JuniorAgentApi(param)
        .then(res => {
          if (res.data.code === 0) {
            this.juniorData = res.data.data.data
          }
        })
    },
    /**
     * @description 初始Echart
     */
    initEchart () {
      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      this.myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['钻石剩余数', '总返利钻石数', '可领取钻石数']
        },
        calculable: true,
        series: [
          {
            name: '半径模式',
            type: 'pie',
            radius: [20, 110],
            center: ['25%', '50%'],
            roseType: 'radius',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: [
              {value: this.userInfo.diamond_amount, name: '钻石剩余数'},
              {value: this.userInfo.rebate_all, name: '总返利钻石数'},
              {value: this.userInfo.rebate_amount, name: '可领取钻石数'}
            ]
          },
          {
            name: '面积模式',
            type: 'pie',
            radius: [30, 110],
            center: ['75%', '50%'],
            roseType: 'area',
            data: [
              {value: this.userInfo.diamond_amount, name: '钻石剩余数'},
              {value: this.userInfo.rebate_all, name: '总返利钻石数'},
              {value: this.userInfo.rebate_amount, name: '可领取钻石数'}
            ]
          }
        ]
      })
    }
  },
  mounted () {
    this.getDefaultInfo()
    window.onresize = this.myChart.resize
  }
}
</script>

<style lang="scss" scoped>
#userinfo {
  width: 100%;
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .basic-info{
    display: flex;
    height: 300px;
    background: #fff;
    margin: 10px 0;

    .bg{
      position: relative;
      width: 50%;
      height: 100%;
      background: url(../../assets/img/userinfo_bg1.jpg) no-repeat;
      background-size: 100% 100%;
    }

    .info{
      display: flex;
      flex-direction: column;
      padding: 40px 0 40px 40px;
      font-size: 14px;
      flex: 1;
      font-weight: bold;
      color: gray;
      font-weight: 400;
      letter-spacing: normal!important;
      font-family: Roboto,sans-serif!important;
      p{
        display: flex;
        align-items: center;
        flex: 1;
      }
    }
  }

  .other-info{
    display: flex;
    height: 300px;
    background: #fff;
    margin: 10px 0;
    .info{
      display: flex;
      flex-direction: column;
      font-size: 14px;
      flex: 1;
      padding: 40px;
      font-weight: bold;
      color: gray;
      font-weight: 400;
      letter-spacing: normal!important;
      font-family: Roboto,sans-serif!important;
      p{
        flex: 1;
      }
      .el-icon-search{
        cursor: pointer;
        margin-left: 10px
      }
    }
    .info:nth-of-type(1){
      border-left: 1px dotted rgba($color: gray, $alpha: .2);
      border-right: 1px dotted rgba($color: gray, $alpha: .2);
    }
  }

  .echart{
    width: 100%;
    height: 400px;
    background: #fff;
    margin-top: 10px;
    padding: 15px 0
  }
}
</style>
