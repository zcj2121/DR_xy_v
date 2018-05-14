<template>
  <div class="app-container" id="seetableAll">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="集群名称" prop="name" sortable min-width="300"></el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="健康度" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.healthtype | statusFilter">{{scope.row.healthtype}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类型" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | statusFilter">{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="62">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="detail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="queryPage.index"
                   :page-sizes="[10, 20, 30, 40, 50,1000]"
                   :page-size="queryPage.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="pageTotal">
    </el-pagination>
    <!--查看弹出框-->
    <el-dialog title="查看服务组列表" width="600px" :visible.sync="detailShow" :modal-append-to-body="false" @close="closeDialogs">
      <el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="服务组名称" prop="name" sortable></el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state | statusFilter">{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogs">关 闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getListAll } from '@/api/seetable'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      pageTotal: 0,
      pageSizes: [10, 15, 20],
      queryPage: {
        index: 1,
        size: 10
      },
      detailShow: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '在线': 'success',
        '健康': 'gray',
        '离线': 'danger',
        'failover': 'warning'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getListAll(this.listQuery).then(response => {
        this.data = response.data.items
        this.pageTotal = response.data.items.length
        this.listData()
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.queryPage.size = val
      this.listData()
    },
    handleCurrentChange(val) {
      this.queryPage.index = val
      this.listData()
    },
    listData() {
      const size = this.queryPage.size
      const index = this.queryPage.index
      this.list = this.data.slice(size * (index - 1), size * index)
    },
    detail(val) {
      this.detailShow = true
    },
    closeDialogs() {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  #seetableAll{
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
  .el-dialog__body{
    padding: 10px 20px;
  }
</style>
