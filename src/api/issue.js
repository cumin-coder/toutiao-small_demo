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
  console.log(articleId)
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

// (富文本)上传图片 (用于将 base64URL 转为 普通的 URL 格式的路径)
export const $upLoadPicture = data => {
  return request({
    url: '/mp/v1_0/user/images',
    method: 'POST',
    data
  })
}
