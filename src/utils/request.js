// 引入axios
import axios from 'axios'
// 如果设置axios.default.baseURL，那么只能设置1个

// 请求配置
// 测试账号：13911111111
// 验证码：246810
// 或通过移动端接口注册一个账号：
// http://vue-toutiao-m.lipengzhou.com/#/login
// 手机号：自己的，验证码：246810或接受一个真实的验证码

// 通过创建实例来复制axios，通过这个实例去发请求
// 复制出来的axios与axios本身一模一样
const requestNet = axios.create({
  // 请求的基础url（黑马网页），通过create方法可以设置多个baseURL
  // 不同的axios实例可以有不同的配置，且不会冲突
  baseURL: 'http://api-toutiao-web.itheima.net'
})
// 请求拦截器，所有请求会先经过请求拦截器拦截下来，进行相关检查和配置
requestNet.interceptors.request.use(config => {
  // config 是当前请求相关的配置信息对象，可以在这里添加或修改配置
  // console.log(config)
  // 如果本地存储有登录用户令牌，则统一设置token
  if (window.localStorage.getItem('user')) {
    config.headers.Authorization = `Bearer ${window.localStorage.getItem('user')}`
  }
  // return config之后 请求才会真正的发出去
  return config
}, error => {
  // 请求失败时会经过这里
  return Promise.reject(error)
})
const requestLocal = axios.create({
  // 请求的基础url（本地）
  baseURL: 'http://127.0.0.1'
})
export { requestNet, requestLocal }
