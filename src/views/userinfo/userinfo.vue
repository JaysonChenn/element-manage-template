<template>
  <div id="userinfo">
    <el-row :gutter="10" style="width: 100%">
      <el-col :md="24" :lg="12">
        <div class="basic-info">
          <div class="head">用户信息</div>
          <el-row class="body">
            <el-col class="col" :xs="12" :sm="12" :md="12" :lg="6">
              <div class="icon">
                <i class="iconfont iconhome-page"></i>
                <p class="title">用户名</p>
                <p class="num">{{userInfo.agent_name}}</p>
              </div>
            </el-col>
            <el-col class="col" :xs="12" :sm="12" :md="12" :lg="6">
              <div class="icon">
                <i class="iconfont iconhome-page"></i>
                <p class="title">游戏Id</p>
                <p class="num">{{userInfo.player_id}}</p>
              </div>
            </el-col>
            <el-col class="col" :xs="12" :sm="12" :md="12" :lg="6">
              <div class="icon">
                <i class="iconfont iconhome-page"></i>
                <p class="title">登录时间</p>
                <p class="num">{{PublicMethod.formatDate(userInfo.login_time)}}</p>
              </div>
            </el-col>
            <el-col class="col" :xs="12" :sm="12" :md="12" :lg="6">
              <div class="icon">
                <i class="iconfont iconhome-page"></i>
                <p class="title">注册时间</p>
                <p class="num">{{PublicMethod.formatDate(userInfo.regist_time)}}</p>
              </div>
            </el-col>
            <el-col class="col" :xs="12" :sm="12" :md="12" :lg="6">
              <div class="icon">
                <i class="iconfont iconhome-page"></i>
                <p class="title">手机号</p>
                <p class="num">{{userInfo.agent_phone}}</p>
              </div>
            </el-col>
            <el-col class="col" :xs="12" :sm="12" :md="12" :lg="6">
              <div class="icon">
                <i class="iconfont iconhome-page"></i>
                <p class="title">代理类型</p>
                <p class="num">{{Number(userInfo.agent_type) == 1 ? '麻将' : Number(userInfo.agent_type) == 2 ? '扑克' : '纸牌'}}</p>
              </div>
            </el-col>
            <el-col class="col" :xs="12" :sm="12" :md="12" :lg="6">
              <div class="icon">
                <i class="iconfont iconhome-page"></i>
                <p class="title">上级代理名</p>
                <p class="num">{{userInfo.parent_agent_name}}</p>
              </div>
            </el-col>
            <el-col class="col" :xs="12" :sm="12" :md="12" :lg="6">
              <div class="icon">
                <i class="iconfont iconhome-page"></i>
                <p class="title">上级代理手机号</p>
                <p class="num">{{userInfo.parent_agent_phone}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :md="24" :lg="12">
        <div class="other-info">
          <div class="head">砖石相关</div>
          <el-row class="body">
            <el-col @click="checkAgent()" class="col" :md="24" :lg="12">
              <div class="icon">
                <p class="title">下级代理数</p>
                <p class="num" v-if="userInfo.child_agents">
                  <CountTo :startVal='0' :endVal='userInfo.child_agents.length' :duration='2500'></CountTo>
                </p>
              </div>
            </el-col>
            <el-col class="col" :md="24" :lg="12">
              <div class="icon">
                <p class="title">剩余钻石数</p>
                <p class="num">
                  <CountTo :startVal='0' :endVal='userInfo.diamond_amount' :duration='2500'></CountTo>
                </p>
              </div>
            </el-col>
            <el-col class="col" :md="24" :lg="12">
              <div class="icon">
                <p class="title">总返利钻石数</p>
                <p class="num">
                  <CountTo :startVal='0' :endVal='userInfo.rebate_all' :duration='2500'></CountTo>
                </p>
              </div>
            </el-col>
            <el-col class="col" :md="24" :lg="12">
              <div class="icon">
                <p class="title">可领取砖石数</p>
                <p class="num">
                  <CountTo :startVal='0' :endVal='userInfo.rebate_amount' :duration='2500'></CountTo>
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col class="hidden-sm-and-down">
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
  mapState,
  mapMutations
} from 'vuex'
import CountTo from 'vue-count-to'

export default {
  components: {
    Breadcrumb,
    CountTo
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
    getDefaultInfo () {
      UserInfoApi(JSON.parse(sessionStorage.userinfo).user_id)
        .then(res => {
          sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
          this.setUserInfo(res.data.data)
        })
        .then(() => {
          this.initEchart()
        })
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
      window.onresize = this.myChart.resize
    }
  },
  mounted () {
    this.getDefaultInfo()
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
    flex-direction: column;
    background: #fff;

    .head{
      line-height: 42px;
      padding: 0 15px;
      border-bottom: 1px solid #f6f6f6;
      color: #333;
      font-size: 13px
    }
    .body{
      .col{
        .icon{
          text-align: center;
          padding: 20px 0;
          margin: 10px;
          background: #F8F8F8;
          p{
            line-height: 16px;
            text-align: center;
          }
          .iconfont{
            font-size: 30px
          }
          .num{
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
          }
          .title{
            font-size: 12px;
            text-align: center;
            color: #666;
          }
        }
      }
    }
  }

  .other-info{
    display: flex;
    flex-direction: column;
    background: #fff;

    .head{
      line-height: 42px;
      padding: 0 15px;
      border-bottom: 1px solid #f6f6f6;
      border-top: 1px solid #f6f6f6;
      color: #333;
      font-size: 13px
    }

    .body{
      .col{
        .icon{
          text-align: left;
          padding: 20px 0;
          margin: 12.25px 15px;
          background: #F8F8F8;
          .title{
            margin-left: 10px;
            font-size: 12px;
            font-weight: 400;
            color: #999;
            padding-bottom: 10px;
          }
          .num{
            margin-left: 10px;
            font-style: normal;
            font-size: 30px;
            font-weight: 300;
            color: #009688;
          }
        }
      }
    }
  }

  .echart{
    width: 100%;
    height: 400px;
    background: #fff;
    margin-top: 20px;
    padding: 15px 0
  }
}
</style>
