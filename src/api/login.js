import request from './axios/api'

// 登陆
export function LoginApi (params) {
  return request.post('/auth/login', params)
}

// 退出
export function SignOutApi (params) {
  return request.post('/auth/logout', params)
}
