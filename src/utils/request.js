import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // withCredentials: true,
  // baseURL: process.env.BASE_API, // api的base_url
  baseURL: 'hatech', // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers = {
    //   'X-Requested-With': 'XMLHttpRequest',
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    // }
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    const msg = (msg, type) => {
      Message({
        message: msg,
        type: type,
        duration: 2 * 1000
      })
    }
    if (res.code && res.code !== 20000 && res.code !== 200) {
      switch (res.code) {
        case 40001:
          msg('密码错误！', 'error')
          break
        case 40005:
          msg('登录失败！', 'error')
          break
        case 0:
          msg(res.msg, 'error')
          break
        case 2:
          msg(res.msg, 'error')
          break
      }
      return Promise.reject('error')
    } else {
      if (res.code === 200) {
        msg('操作成功！', 'success')
      }
      return response.data
    }
  },
  error => {
    Message({
      message: error.msg,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
