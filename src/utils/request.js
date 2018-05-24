import axios from 'axios'
import { Message } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'

// ************  本地环境  api的base_url  *********** //
const changeUrl = 'hatech'

// ************  正式环境  api的base_url  *********** //
// const changeUrl = process.env.BASE_API

// 创建axios实例
const service = axios.create({
  // withCredentials: true,
  baseURL: changeUrl,
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
    // Message({
    //   message: '服务器响应失败，请重试！',
    //   type: 'error',
    //   duration: 2 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
// respone拦截器

//  操作接口 公共方法
axios.baseURL = changeUrl
export function alertBox(_this, msg, url, params, otherfun) {
  _this.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.get(axios.baseURL + url, { params: params })
      .then(function(response) {
        console.log(response)
        if (response.data.code === 200 || response.data.code === '200') {
          _this.$message({
            type: 'success',
            message: response.data.msg
          })
          if (otherfun === 'detailDefFun') {
            _this.detailDefFun()
          } else {
            _this.fetchData()
            if (_this.groupTree) {
              _this.groupTree()
            }
          }
        } else {
          _this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      })
      .catch(function(response) {
        _this.$message({
          type: 'error',
          message: '操作失败!'
        })
      })
  }).catch(() => {
    // _this.$message({
    //   type: 'info',
    //   message: '已取消操作'
    // })
  })
}

export function alertOtherBox(_this, url, makeurl, params) {
  var msg = null
  axios.get(axios.baseURL + url, { params: params })
    .then(function(res) {
      msg = res.data.msg
      _this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get(axios.baseURL + makeurl, { params: params })
          .then(function(response) {
            console.log(response)
            if (response.data.code === 200 || response.data.code === '200') {
              _this.$message({
                type: 'success',
                message: response.data.msg
              })
              _this.fetchData()
            } else {
              _this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
          .catch(function(response) {
            _this.$message({
              type: 'error',
              message: '操作失败!'
            })
          })
      }).catch(() => {
        // _this.$message({
        //   type: 'info',
        //   message: '已取消操作'
        // })
      })
    })
}

export function downURL() {
  return changeUrl
}
//  操作接口 公共方法

