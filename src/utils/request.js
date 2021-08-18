// 引入axios
import axios from 'axios'

// 请求配置
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net'
})

export default request
