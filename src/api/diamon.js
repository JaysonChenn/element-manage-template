import request from './axios/api'

// 充值记录
export function PlayerInfoApi (params) {
  return request.get('/player/users/' + params)
}

// 充值钻石
export function ChargeDiamonApi (params) {
  return request.post('/payment/agent_sales', params)
}
