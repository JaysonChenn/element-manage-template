import request from './axios/api'

// 通知消息
export function NotifyMesApi (params) {
  return request.get('/message/agent_notice', {params})
}

// 查看通知
export function CheckMesApi (notId, params) {
  return request.put('/message/agent_notice/' + notId, params)
}
