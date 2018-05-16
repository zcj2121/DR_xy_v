import axios from 'axios'

// axios.baseURL = process.env.BASE_API
axios.baseURL = 'hatech'

export function alertBox(_this, msg, url, params) {
  _this.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post(axios.baseURL + url + '?id=' + params)
      .then(function(response) {
        if (response === 'ok') {
          _this.$message({
            type: 'success',
            message: '操作成功!'
          })
          _this.fetchData()
        } else {
          _this.$message({
            type: 'error',
            message: '操作失败!'
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
    _this.$message({
      type: 'info',
      message: '已取消操作'
    })
  })
}
