import request from '../utils/request'

// 新建文章
export const $addArticle = (data, draft) => {
  return request({
    url: '/mp/v1_0/articles',
    method: 'POST',
    params: {
      draft // 是否存为草稿（true 为草稿）
    },
    data
  })
}

// 获取文章内容 （用于编辑）
export const $getArticle = (articleId) => {
  return request({
    url: `/mp/v1_0/articles/${articleId}`,
    method: 'GET'
  })
}

// 编辑文章（修改）
export const $editArticle = (articleId, draft, data) => {
  return request({
    url: `/mp/v1_0/articles/${articleId}`,
    method: 'PUT',
    params: {
      draft
    },
    data
  })
}
