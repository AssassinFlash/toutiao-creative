// 引入axios
import axios from 'axios'
import JSONbig from 'json-bigint'
// 引入json-bigint处理文章ID
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
  baseURL: 'http://api-toutiao-web.itheima.net',
  // 定制后端返回的原始数据的处理，不让axios走默认的JSON.parse把数据转换成JS对象
  // 参数data就是后端返回的原始数据（未经处理的JSON格式的字符串）
  transformResponse: [function (data) {
    // 默认的是return JSON.parse(data)
    try {
      return JSONbig.parse(data)
    } catch {
      // 如果后端返回的不是标准格式的JSON字符串，JSONbig.parse的调用就会报错
      // 就用catch捕获异常，直接返回原始数据
      return data
    }
  }]
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
