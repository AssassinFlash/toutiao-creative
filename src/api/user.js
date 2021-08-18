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
export const login = (user) => {
  return requestNet({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data: user
  })
}
