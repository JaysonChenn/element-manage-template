import request from './axios/api'

// 获取充值卡
export function RecordCardApi (params) {
  return request.get('/payment/charge_card_templates', {params})
}

// 充值
export function ChargeApi (params) {
  return request.post('/store/orders', params)
}
