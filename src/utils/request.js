// 引入axios
import axios from 'axios'

// 请求配置
// 测试账号：13911111111
// 验证码：246810
// 或通过移动端接口注册一个账号：
// http://vue-toutiao-m.lipengzhou.com/#/login
// 手机号：自己的，验证码：246810或接受一个真实的验证码
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net'
})

export default request
