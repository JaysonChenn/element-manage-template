import request from './axios/api'

// 代理协议
export function AgentAgreementApi (params) {
  return request.get('/variable/agent_agreement', {params})
}
