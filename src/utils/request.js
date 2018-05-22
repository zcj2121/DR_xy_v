import axios from 'axios'
import { Message } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // withCredentials: true,
  // baseURL: process.env.BASE_API, // api的base_url
  baseURL: 'hatech', // api的base_url
  timeout: 15000 // 请求超时时间
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    const msg = (msg, type) => {
      Message({
        message: msg,
        type: type,
        duration: 2 * 1000
      })
    }
    if (res.code) {
      if (res.code && res.code !== 20000 && res.code !== 200 && res.code !== 2000 && res.code !== '2000' && res.code !== '200') {
        msg(res.msg, 'error')
        return Promise.reject('error')
      } else if (res.code === 20000 || res.code === 2000 || res.code === '2000') {
        return response.data
      } else {
        if (res.code === 200 || res.code === '200') {
          msg('操作成功！', 'success')
          return response.data
        }
      }
    } else {
      return response.data
    }
  },
  error => {
    Message({
      message: '服务器响应失败，请重试！',
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
