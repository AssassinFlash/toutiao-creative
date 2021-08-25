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

// 上传图片素材
export const uploadImage = data => {
  return requestNet({
    method: 'POST',
    url: '/mp/v1_0/user/images',
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
