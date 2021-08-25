/*
* 文章相关请求模块 */
import { requestNet } from '@/utils/request'

// 获取文章列表
export const getArticles = params => {
  return requestNet({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // body参数用data传，query参数用params传
    params: params
  })
}

// 获取文章频道
export const getArticleChannels = () => {
  return requestNet({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
// 删除失败的原因：这是因为后端返回的ID是字符串
// axios为了方便，把字符串转成JS对象，在JS对象中，大整数字符串会被转成整数
// 如果大整数太大，那么转成整数就会出现超出界限导致出现误差
// 这样子axios返回的ID就不是后端返回的那个原来的ID
// 导致删除时ID传进去接口找不到对应文章，因此删除失败

// 解决思路：axios会在内部使用JSON.parse把后端返回的数据转为js数据对象
// 那就不要让axios使用JSON.parse转换数据，而是使用json-bigint来做转换处理
export const deleteArticle = articleId => {
  return requestNet({
    method: 'DELETE',
    // 接口文档写的路径参数需要在url中传递
    // :xxx 就是路径参数，把数据替换掉:xxx
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 新建文章
export const addArticle = (data, draft = false) => {
  return requestNet({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft
    },
    data
  })
}

// 获取指定文章
export const getArticle = (articleId) => {
  return requestNet({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 编辑文章
export const updateArticle = (articleId, data, draft = false) => {
  return requestNet({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}
// 修改文章评论状态
export const updateCommentStatus = (articleID, allowComment) => {
  return requestNet({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleID
    },
    data: {
      allow_comment: allowComment
    }
  })
}
