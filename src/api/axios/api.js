import axios from 'axios' // 引入axios库
import config from './config.js' // 基本配置
import {
  Message,
  Loading
} from 'element-ui' // Message消息提醒
import {
  UserInfoApi
} from '@/api/userinfo' // 获取用户信息

let service = axios.create({
  baseURL: config.baseURL, // 请求地址
  timeout: config.timeout, // 请求超时时间
  headers: config.headers, // 请求头
  withCredentials: config.withCredentials // 表示跨域请求时是否需要使用凭证
})
let loading // loading
let userInfo // 用户信息
let isLoginCond // 是否登陆判断条件
let regetUserApiCond // 再次获取用户信息Api条件
let isNeedRegetInfo = true // 防止获取信息接口死循环
let shiledApiArr = ['auth/agent/users/', '/auth/logout'] // 不需要再获取用户信息接口数组

/**
 * @description 请求拦截
 */
service.interceptors.request.use(config => {
  userInfo = sessionStorage.userinfo
  isLoginCond = userInfo && userInfo !== undefined
  if (isLoginCond) {
    loading = Loading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * @description 响应拦截
 */
service.interceptors.response.use(response => {
  let url = response.config.url
  if (isLoginCond) {
    regetUserApiCond = isNeedRegetInfo && url.indexOf(shiledApiArr[0]) === -1 && url.indexOf(shiledApiArr[1]) === -1
    if (regetUserApiCond) {
      isNeedRegetInfo = false
      UserInfoApi(JSON.parse(userInfo).user_id)
        .then(res => {
          sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
          isNeedRegetInfo = true
        })
    }
    loading.close()
  }
  return response
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break
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
  }
}
