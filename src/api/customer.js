import request from './axios/api'

// 我的客户
export function MyCustomerApi (params) {
  return request.get('statist/agent_players', {params})
}

// 充值砖石
export function DiamonChargeApi (params) {
  return request.post('/payment/agent_sales', params)
}
