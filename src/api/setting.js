import request from '../utils/request'

// 编辑用户资料
export const $editUserInfo = data => {
  return request({
    url: '/mp/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}

// 获取用户资料
export const $getUserInfo = () => {
  return request({
    url: '/mp/v1_0/user/profile',
    method: 'GET'
  })
}

// 编辑用户头像
export const $editUserHead = data => {
  return request({
    url: '/mp/v1_0/user/photo',
    method: 'PATCH',
    data
  })
}
