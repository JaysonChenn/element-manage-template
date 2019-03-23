import request from './axios/api'

// 提现记录
export function RecordWithdraw (params) {
  return request.get('/payment/agent_orders', {params})
}

// 出售记录
export function RecordSale (params) {
  return request.get('/payment/agent_sales', {params})
}
