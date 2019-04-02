import request from './axios/api'

let userId = JSON.parse(sessionStorage.userinfo).user_id

// 绑定用户
export function BindUserApi (params) {
  return request.put('auth/agent/users/' + userId, params)
}

// 解绑用户
export function UnbindUserApi (params) {
  return request.put('auth/agent/users/' + userId, params)
}

// 用户下的房间列表
export function RoomListApi (params) {
  return request.get('/player/room/delegation', {params})
}

// 删除用户下的房间
export function DeleteRoomApi (params) {
  return request.post('player/room/delegation', params)
}
