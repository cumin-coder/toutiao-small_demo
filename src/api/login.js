import request from '../utils/request'
// 请求登录
export const $requestLogin = (userData) => request({ url: '/mp/v1_0/authorizations', method: 'POST', data: userData })

// 获取头像与名字
export const $getHeader2Name = () => {
  return request({
    url: '/mp/v1_0/user/profile',
    method: 'GET'
  })
}
