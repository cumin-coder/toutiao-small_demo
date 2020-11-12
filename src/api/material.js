import request from '../utils/request'

// 获取图片素材
export const $getImages = (collect, page, currentCount) => {
  return request({
    url: '/mp/v1_0/user/images',
    method: 'GET',
    params: {
      collect,
      page,
      per_page: currentCount
    }
  })
}

// 收藏素材
export const $StarImage = (id, collect) => {
  return request({
    url: `/mp/v1_0/user/images/${id}`,
    method: 'PUT',
    data: {
      collect
    }
  })
}

// 删除图片素材
export const $DelImage = id => {
  return request({
    url: `/mp/v1_0/user/images/${id}`,
    method: 'DELETE'
  })
}
