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
