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
        console.log(response)
        if (response.data.code === 200) {
          _this.$message({
            type: 'success',
            message: response.data.msg
          })
          _this.fetchData()
          if (_this.groupTree) {
            _this.groupTree()
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
