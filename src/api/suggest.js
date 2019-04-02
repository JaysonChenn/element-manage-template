import request from './axios/api'

// 充值记录
export function OsspolicyApi () {
  return request.get('/message/oss_policy')
}
