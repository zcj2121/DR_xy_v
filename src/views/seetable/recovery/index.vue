<template>
  <div class="app-container" id="recoveryTable">
    <div class="filter-container">
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-sort" @click="operation('', '确认同步吗', '123')">同步</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="恢复策略名称" prop="name" width="160" sortable></el-table-column>
      <el-table-column label="描述" prop="describe" min-width="250"></el-table-column>
      <el-table-column label="操作" width="62">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detailshow(scope.row)">查看</el-button>
          </el-button-group>
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
    <el-dialog title="恢复计划名称-test1步骤列表" id="otherDialog" width="90%" :visible.sync="detailShow"
                :modal-append-to-body="false" @close='detailClose'>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="序号" prop="id" sortable width="75" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="步骤类型" prop="name" sortable width="105" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="内容" prop="state" sortable min-width="180" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="动作" prop="describe" sortable width="75" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="描述" prop="describe" min-width="180" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="计划时间" prop="time" sortable width="152" :show-overflow-tooltip=true></el-table-column>
        <el-table-column class-name="status-col" label="状态" sortable width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state | statusFilter">{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="204">
          <template slot-scope="scope">
            <el-button-group>
              <!--<el-button type="info" @click="operation(scope.row.id,1)">暂停</el-button>-->
              <!--<el-button type="info" @click="operation(scope.row.id,2)">继续</el-button>-->
              <el-button type="primary" size="mini" @click="operation(scope.row.id,3)">重试</el-button>
              <el-button type="primary" size="mini" @click="operation(scope.row.id,4)">跳过</el-button>
              <el-button type="primary" size="mini" @click="operation(scope.row.id,5)">一键退回</el-button>
              <el-button type="primary" size="mini" @click="operation(scope.row.id,6)">停止</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button>关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/recoverytable'
import { alertBox } from '@/utils/alert'

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
        '离线': 'danger'
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
      getList(this.listQuery).then(response => {
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
    detailshow(val) {
      this.detailShow = true
    },
    operation(id, msg, url) {
      alertBox(this, msg, url, id)
    },
    detailClose() {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  #recoveryTable{
    .el-dialog{
      margin-top:6vh !important;
    }
    .el-dialog__body{
      padding: 10px 20px;
      .el-table__body-wrapper{
        height: 400px;
        overflow-y: auto;
      }
    }
  }
</style>
<style  rel="stylesheet/scss" lang="scss" scoped>

</style>
