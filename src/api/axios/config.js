/* eslint-disable indent */
export default {
  // 基础url前缀
  baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.0.14:1237'
         : process.env.NODE_ENV === 'debug' ? ''
         : process.env.NODE_ENV === 'production' ? ''
         : '',
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json'
}
