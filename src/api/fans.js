import request from '../utils/request'

// 获取粉丝列表
export const $getFansList = (page, perPage) => {
  return request({
    url: '/mp/v1_0/followers',
    method: 'GET',
    params: {
      page,
      per_page: perPage
    }
  })
}
