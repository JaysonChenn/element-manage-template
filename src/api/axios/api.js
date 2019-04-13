import axios from 'axios'
import config from './config.js'
import {
  Message,
  Loading
} from 'element-ui'
import {
  UserInfoApi
} from '@/api/userinfo'
import {
  NotifyMesApi
} from '@/api/notify'
import store from '@/store/store'
import router from '@/router/index'

/**
 * @param{
 * service {
 *  baseURL 请求地址
 *  timeout 请求超时时间
 *  headers 请求头
 *  withCredentials 表示跨域请求时是否需要使用凭证
 * }
 * loading loading
 * userInfo 用户信息
 * isLoginCond 是否登陆判断条件
 * regetUserApiCond 再次获取用户信息Api条件
 * isNeedRegetInfo 防止获取信息接口死循环
 * shiledApiArr 不需要再请求(用户信息、通知信息)的接口数组
 * }
 */
let service = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: config.headers,
  withCredentials: config.withCredentials
})
let loading, userInfo, isLoginCond, regetUserApiCond
let isNeedRegetInfo = true
let shiledApiArr = ['/auth/login', 'auth/agent/users/', '/auth/logout', '/message/agent_notice']

// 请求拦截
service.interceptors.request.use(config => {
  userInfo = store.state.userInfo
  isLoginCond = Object.keys(userInfo).length !== 0 && userInfo !== undefined
  if (isLoginCond) {
    loading = Loading.service({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
service.interceptors.response.use(response => {
  let url = response.config.url
  if (isLoginCond) {
    regetUserApiCond = isNeedRegetInfo && url.indexOf(shiledApiArr[0]) === -1 && url.indexOf(shiledApiArr[1]) === -1 && url.indexOf(shiledApiArr[2]) === -1
    if (regetUserApiCond) {
      isNeedRegetInfo = false
      UserInfoApi(userInfo.user_id)
        .then(res => {
          sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
          store.commit('setUserInfo', res.data.data)
        })
        .then(() => {
          let param = {
            order: 'desc'
          }
          NotifyMesApi(param)
            .then(res => {
              let obj = {}
              obj.allArr = res.data.data.data
              obj.unreadArr = res.data.data.data.filter(item => { return item.notice_state === 0 })
              obj.havereadArr = res.data.data.data.filter(item => { return item.notice_state !== 0 })
              store.commit('setMesInfo', obj)
              isNeedRegetInfo = true
            })
        })
    }
    loading.close()
  }
  return response
}, error => {
  if (isLoginCond) {
    loading.close()
  }
  if (error.response.status !== 400) {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          error.message = '未授权，请重新登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求错误,未找到该资源'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
      }
    } else {
      error.message = '连接到服务器失败'
    }
  } else {
    switch (error.response.data.code) {
      case 2001:
        error.message = '用户不存在'
        break
      case 2002:
        error.message = '手机号或密码错误'
        break
      case 2003:
        router.push('/login')
        break
      case 2004:
        error.message = '用户不存在'
        break
      case 2005:
        error.message = '登录用户不是代理账号'
        break
      case 2006:
        error.message = '账户冻结中'
        break
      case 4012:
        error.message = '请求参数有误'
        break
      case 4028:
        error.message = '系统处理错误'
        break
      case 4031:
        error.message = '玩家不存在'
        break
      case 4033:
        error.message = '订单号已经存在'
        break
      case 4036:
        error.message = '充值数据有误'
        break
      case 4037:
        error.message = '剩余砖石数不够'
        break
      case 4041:
        error.message = '请求游戏后台错误'
        break
      case 6002:
        error.message = '请求游戏后台失败'
        break
      case 6003:
        error.message = '玩家不存在'
        break
      case 6018:
        error.message = '代理ID不存在'
        break
      default:
        error.message = `客户端错误${error.response.status}`
    }
  }
  return Promise.reject(error.message)
})

export default {
  get (url, param) {
    return new Promise((resolve, reject) => {
      service.get(url, param).then(res => {
        resolve(res)
      }, err => {
        Message({
          showClose: true,
          message: err,
          type: 'error'
        })
        reject(err)
      })
    })
  },
  post (url, param) {
    return new Promise((resolve, reject) => {
      service.post(url, param).then(res => {
        resolve(res)
      }, err => {
        Message({
          showClose: true,
          message: err,
          type: 'error'
        })
        reject(err)
      })
    })
  },
  put (url, param) {
    return new Promise((resolve, reject) => {
      service.put(url, param).then(res => {
        resolve(res)
      }, err => {
        Message({
          showClose: true,
          message: err,
          type: 'error'
        })
        reject(err)
      })
    })
  }
}
