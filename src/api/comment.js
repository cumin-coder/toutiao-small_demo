import request from '../utils/request'

// 获取评论的全部信息状态
export const $getCommentInfo = (responseType, page, prePage) => {
  return request({
    url: '/mp/v1_0/articles',
    method: 'GET',
    params: {
      response_type: responseType,
      page,
      per_page: prePage
    }
  })
}

// 修改文章评论状态
export const $editCommentStatus = (articleId, allowComment) => {
  return request({
    url: '/mp/v1_0/comments/status',
    method: 'PUT',
    params: {
      article_id: articleId // 文章 id
    },
    data: {
      allow_comment: allowComment // 是否允许评论
    }
  })
}
