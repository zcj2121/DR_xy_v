import axios from 'axios'

// const changeUrl = process.env.BASE_API
const changeUrl = 'hatech'

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

export function downURL() {
  return changeUrl
}
