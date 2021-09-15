/*
  素材API
 */

import { requestNet } from '@/utils/request'

// 获取素材列表
export const getImages = params => {
  return requestNet({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 上传图片素材，将本地图片处理成可在网上查看的url
export const uploadImage = data => {
  return requestNet({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // 一般文件上传的接口都要求把请求头中的Content-type设置为multipart/form-data
    // 使用axios上传文件的话不需要手动设置，只需给data一个FormData对象即可
    data
  })
}

// 收藏图片
export const collectImage = (imageID, collect) => {
  return requestNet({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageID}`,
    data: { collect }
  })
}

// 删除图片
export const deleteImage = imageID => {
  return requestNet({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageID}`
  })
}
