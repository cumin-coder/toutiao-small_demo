import axios from 'axios'
import jsonBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
  timeout: 5000,

  // 定制后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据
  transformResponse: [function (data) {
    // 原始数据
    // console.log(data)
    try {
      // 将原始数据转换为Json对象
      return jsonBig.parse(data)
    } catch (e) {
      // 原始数据（Json字符串数据）
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器
request.interceptors.response.use((response) => {
  return response
})

export default request
