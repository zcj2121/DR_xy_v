<template>
  <div class="app-container" id="changeauditTable">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit :show-overflow-tooltip="true">
      <el-table-column label="切换流程名称" :show-overflow-tooltip="true" prop="processName" min-width="100"></el-table-column>
      <el-table-column label="切换阶段" :show-overflow-tooltip="true" prop="stageName" min-width="100"></el-table-column>
      <el-table-column label="切换步骤" :show-overflow-tooltip="true" prop="stepName" min-width="100"></el-table-column>
      <el-table-column class-name="status-col" label="创建时间" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.startTime | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="完成时间" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.startTime | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="65">
        <template slot-scope="scope">
          {{scope.row.state | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="62">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operation(scope.row.id, '确认完成吗', '/rs/dr/drmSwitchingProcess/submitArtificial')">确认
            </el-button>
          </el-button-group>
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
  </div>
</template>

<script>
  import { getAllTask } from '@/api/change/nottask'
  import { alertBox } from '@/utils/alert'
  import { formatTime } from '@/utils/index'
  export default {
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        thisId: '',
        searchQuery: { // 查询数据
          processName: ''
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '执行中',
          7: '暂停',
          8: '完成',
          10: '终止',
          0: '未执行'
        }
        return statusMap[status]
      },
      dateFilter(date) {
        return formatTime(date, 'yyyy-MM-dd HH:mm:ss')
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
        getAllTask(this.searchQuery).then(response => {
          if (response) {
            this.data = response.data
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
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #changeauditTable{
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
  .filter-container{
    text-align: right;
    margin-bottom: 10px;
  }
</style>
