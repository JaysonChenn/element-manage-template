import request from './axios/api'

// 充值记录
export function RecordRechargeApi (params) {
  return request.get('/payment/agent_charges', {params})
}

// 提现记录
export function RecordWithdrawApi (params) {
  return request.get('/payment/agent_orders', {params})
}

// 返利记录
export function RecordRebateApi (params) {
  return request.get('/payment/agent_rebates', {params})
}

// 出售记录
export function RecordSaleApi (params) {
  return request.get('/payment/agent_sales', {params})
}
