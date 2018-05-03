<template>
  <div class="app-container">
    <span class="tabel-title">集群资源列表</span>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="集群名称" prop="name" sortable></el-table-column>
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
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="info" >查看</el-button>
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
      }
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
    }
  }
}
</script>
