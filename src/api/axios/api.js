import axios from 'axios'
import config from './config.js'
import router from '@/router/index'
import {
  Message,
  Loading
} from 'element-ui'

/**
 * @param{
 * service {
 *  baseURL 请求地址
 *  timeout 请求超时时间
 *  headers 请求头
 *  withCredentials 表示跨域请求时是否需要使用凭证
 * }
 * loading loading
 * }
 */
let service = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: config.headers,
  withCredentials: config.withCredentials
})
let loading

// 请求拦截
service.interceptors.request.use(config => {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
service.interceptors.response.use(response => {
  loading.close()
  return response
}, error => {
  loading.close()
  if (error && error.response) {
    switch (error.response.status) {
      case 401:
        router.push('/login')
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
