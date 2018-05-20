<template>
  <div class="app-container" id="seetableVbs">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit>
      <el-table-column label="名称" prop="name" width="160" sortable></el-table-column>
      <el-table-column label="描述" prop="description" min-width="250"></el-table-column>
      <el-table-column label="状态" prop="display_availability_status" width="110"></el-table-column>
      <el-table-column label="健康度" prop="display_state" width="110"></el-table-column>
      <el-table-column label="操作" width="62">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="queryPage.index"
       :page-sizes="pageSizes"
       :page-size="queryPage.size"
       layout="total, sizes, prev, pager, next, jumper"
       :total="pageTotal">
    </el-pagination>
    <!--查看弹出框-->
    <el-dialog title="查看服务组列表" width="600px" :visible.sync="detailShow" :modal-append-to-body="false" @close="closeDialogs">
      <el-table :data="childlist" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="服务组名称" prop="name" sortable></el-table-column>
        <el-table-column label="状态" prop="sgstate" width="110" sortable></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogs">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { retrieve } from '@/api/seetable/vbs'

export default {
  data() {
    return {
      data: null,
      list: null,
      childlist: null,
      listLoading: true,
      pageTotal: 0,
      pageSizes: [10, 15, 20],
      queryPage: {
        index: 1,
        size: 10
      },
      listQuery: {
        url: '/vom/api/query/hadr/vbs/'
      },
      detailShow: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '在线': 'success',
        '健康': 'gray',
        '离线': 'danger'
      }
      return statusMap[status]
    },
    typesFilter(types) {
      const typesMap = {
        1: '在线',
        2: '离线'
      }
      return typesMap[types]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 列表数据 分页 搜索
    // 请求 原始数据
    fetchData() {
      this.listLoading = true
      retrieve(this.listQuery).then(response => {
        if (response) {
          this.data = response.result
          this.pageTotal = response.count
          this.listData()
          this.listLoading = false
        }
      })
    },
    // 每页 条数
    handleSizeChange(val) {
      this.queryPage.size = val
      this.listData()
    },
    // 第几页
    handleCurrentChange(val) {
      this.queryPage.index = val
      this.listData()
    },
    // 当前列表 显示数据
    listData() {
      const size = this.queryPage.size
      const index = this.queryPage.index
      this.list = this.data.slice(size * (index - 1), size * index)
    },
    detail(val) {
      retrieve({ url: '/vom/api/query/hadr/vbs/' + val.encoded_id + '/sg' }).then(response => {
        if (response) {
          this.childlist = Object.assign([], response.result)
        }
      })
      this.detailShow = true
    },
    closeDialogs() {
      this.childlist = []
      this.detailShow = false
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  #seetableVbs{
    .el-dialog__body{
      padding: 10px 20px;
      .el-table__body-wrapper{
        height: 250px;
        overflow-y: auto;
      }
    }
  }
</style>
<style  rel="stylesheet/scss" lang="scss" scoped>

</style>
