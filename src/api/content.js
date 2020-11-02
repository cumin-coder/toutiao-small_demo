import request from '../utils/request'

export const $textInfo = (params) => {
  return request({
    url: '/mp/v1_0/articles',
    method: 'GET',
    params
  })
}

// 获取文章频道
export const $getTextChannel = () => {
  return request({
    url: '/mp/v1_0/channels',
    method: 'GET'
  })
}

// 删除文章
export const $DeleteArticle = articleId => {
  return request({
    url: `/mp/v1_0/articles/${articleId}`,
    method: 'DELETE'
  })
}
