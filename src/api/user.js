import { requestNet } from '@/utils/request'
/*
* 用户相关请求模块
* */
// 为什么要有这些模块？
// 1.接口可能需要重用
// 2.url、变量等参数容易变动，不作封装就难以查找和修改
// 这样做的好处是？
// 封装起来方便重用，管理和维护更加方便

// 用户登录
// 接口要求：把用户信息作为data传入
export const login = (user) => {
  return requestNet({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data: user
  })
}
// 获取用户资料
// 接口要求：把用户身份令牌token放到请求头中(在请求拦截器中实现)
export const getUserProfile = (userToken) => {
  return requestNet({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
  })
}

// 修改用户头像
export const updateUserphoto = (data) => {
  return requestNet({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}

// 修改用户基本信息
export const updateUser = data => {
  return requestNet({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}
