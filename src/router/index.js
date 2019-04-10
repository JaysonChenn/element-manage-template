import Vue from 'vue'
import Router from 'vue-router'

const Layout = resolve => require(['@/views/layout/layout'], resolve) // 布局结构
const Login = resolve => require(['@/views/login/login'], resolve) // 登陆
const UserInfo = resolve => require(['@/views/userinfo/userinfo'], resolve) // 用户信息
const ChargeDiamon = resolve => require(['@/views/diamon/diamon'], resolve) // 玩家冲砖
const ChargeAgent = resolve => require(['@/views/agent/agent'], resolve) // 代理充值
const MyCustomer = resolve => require(['@/views/customer/customer'], resolve) // 我的客户
const ChargeRecord = resolve => require(['@/views/bill/record_recharge'], resolve) // 充值记录
const ChargeSale = resolve => require(['@/views/bill/record_sale'], resolve) // 出售记录
const ChargeWithdraw = resolve => require(['@/views/bill/record_withdraw'], resolve) // 提现记录
const ChargeRebate = resolve => require(['@/views/bill/record_rebate'], resolve) // 返利记录
const ReplaceRoom = resolve => require(['@/views/room/room'], resolve) // 代开房间
const Notify = resolve => require(['@/views/notify/notify'], resolve) // 通知信息
// const AgentAgreement = resolve => require(['@/views/agreement/agreement'], resolve) // 代理协议
const CompalintSuggest = resolve => require(['@/views/suggest/suggest'], resolve) // 投诉建议

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/userinfo',
    name: '用户信息 ',
    icon: 'iconuserinfo',
    component: Layout,
    children: [{
      path: '/userinfo',
      name: '用户信息',
      component: UserInfo
    }]
  },
  {
    path: '/chargediamon',
    name: '玩家充砖 ',
    icon: 'iconlv_zuanshi',
    component: Layout,
    children: [{
      path: '/chargediamon',
      name: '玩家冲砖',
      component: ChargeDiamon
    }]
  },
  {
    path: '/chargeagent',
    name: '代理充值 ',
    icon: 'iconchongzhi',
    component: Layout,
    children: [{
      path: '/chargeagent',
      name: '代理充值',
      component: ChargeAgent
    }]
  },
  {
    path: '/mycustomer',
    name: '我的客户 ',
    icon: 'iconkehuliebiao',
    component: Layout,
    children: [{
      path: '/mycustomer',
      name: '我的客户',
      component: MyCustomer
    }]
  },
  {
    path: '/mybill',
    name: '我的账单',
    icon: 'iconicon--',
    component: Layout,
    children: [{
      path: '/mybill/chargerecord',
      name: '充值记录',
      component: ChargeRecord
    },
    {
      path: '/mybill/chargesale',
      name: '出售记录',
      component: ChargeSale
    },
    {
      path: '/mybill/chargewithdraw',
      name: '提现记录',
      component: ChargeWithdraw
    },
    {
      path: '/mybill/chargerebate',
      name: '返利记录',
      component: ChargeRebate
    }]
  },
  {
    path: '/replaceroom',
    name: '代开房间 ',
    icon: 'iconfangjian',
    component: Layout,
    children: [{
      path: '/replaceroom',
      name: '代开房间',
      component: ReplaceRoom
    }]
  },
  {
    path: '/notify',
    name: '通知信息 ',
    icon: 'iconxiaoxi',
    component: Layout,
    children: [{
      path: '/notify',
      name: '通知信息',
      component: Notify
    }]
  },
  // {
  //   path: '/agreement',
  //   name: '代理协议 ',
  //   icon: 'iconxieyixiangqing',
  //   component: Layout,
  //   children: [{
  //     path: '/agreement',
  //     name: '代理协议',
  //     component: AgentAgreement
  //   }]
  // },
  {
    path: '/complaintsuggest',
    name: '投诉建议 ',
    icon: 'icontousujianyi',
    component: Layout,
    children: [{
      path: '/complaintsuggest',
      name: '投诉建议',
      component: CompalintSuggest
    }]
  }
  ]
})
