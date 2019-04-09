import request from './axios/api'

// 获取图片服务器
export function OsspolicyApi () {
  return request.get('/message/oss_policy')
}

// 创建建议
export function CreateSuggestApi (params) {
  return request.post('/message/agent_feedback', params)
}
