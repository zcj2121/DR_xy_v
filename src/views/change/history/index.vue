<template>
  <div class="app-container" id="historyTable">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="名称" prop="processName" sortable width="160"></el-table-column>
      <el-table-column class-name="status-col" label="时间" width="152" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.endTime | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="processTitle" min-width="220"></el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.state | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="86">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detail(scope.row)">查看报告</el-button>
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
    <el-dialog title="查看历史记录" id="dialogMitop" width="90%" :visible.sync="detailShow" :modal-append-to-body="false"
               @close="closeDialog">
      <div class="title"><span>{{detailForm.processName}}</span> 的报告</div>
      <div style="margin-bottom:5px;">
        <span>
          <span style="font-weight: bold;">执行时间：</span>
          <span>{{detailForm.startTime | dateFilter}}</span>
        </span>
        <span style="margin-left:20px;">
          <span style="font-weight: bold;">完成时间：</span>
          <span>{{detailForm.endTime | dateFilter}}</span>
        </span>
      </div>
      <el-table :data="detailForm.list" v-loading.body="listLoading" element-loading-text="Loading" border fit :show-overflow-tooltip="true">
        <el-table-column label="切换阶段" :show-overflow-tooltip="true" prop="stageName" min-width="100"></el-table-column>
        <el-table-column label="切换步骤" :show-overflow-tooltip="true" prop="stepName" min-width="100"></el-table-column>
        <el-table-column class-name="status-col" label="分类" width="50" align="center">
          <template slot-scope="scope">
            {{scope.row.stepType | stepTypeFilter}}
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="userName" :show-overflow-tooltip="true" width="78"></el-table-column>
        <el-table-column class-name="status-col" label="开始时间" :show-overflow-tooltip="true" width="151">
          <template slot-scope="scope">
            {{scope.row.startTime | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="结束时间" :show-overflow-tooltip="true" width="151">
          <template slot-scope="scope">
            {{scope.row.endTime | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column label="实际用时(分钟)" prop="times" width="115"></el-table-column>
        <el-table-column class-name="status-col" label="状态" width="65">
          <template slot-scope="scope">
            {{scope.row.state | stepFilter}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllImplement, getAll } from '@/api/change/history'
import { formatDate } from '@/utils/index'

export default {
  data() {
    return {
      data: null,
      list: null,
      listLoading: true,
      pageTotal: 0,
      pageSizes: [10, 15, 20],
      detailShow: false,
      queryPage: {
        index: 1,
        size: 10
      },
      detailForm: {
        processName: '',
        startTime: '',
        endTime: '',
        list: []
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        9: '完成'
      }
      return statusMap[status]
    },
    stepFilter(states) {
      const statesMap = {
        1: '执行中',
        3: '暂停',
        4: '跳过',
        2: '完成',
        5: '终止',
        0: '未执行',
        13: '异常',
        14: '正常'
      }
      return statesMap[states]
    },
    stepTypeFilter(stepType) {
      const stepTypeMap = {
        1: '手动',
        0: '自动'
      }
      return stepTypeMap[stepType]
    },
    dateFilter(time) {
      if (time) {
        const date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      } else {
        return ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 列表数据 分页 搜索
    // 请求 原始数据
    fetchData() {
      this.queryPage.index = 1
      this.listLoading = true
      getAllImplement().then(response => {
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
    detail(val) {
      getAll({ id: val.id }).then(response => {
        if (response) {
          this.detailForm.processName = response.data.processName
          this.detailForm.startTime = response.data.startTime
          this.detailForm.endTime = response.data.endTime
          if (response.data.drmSwitchingStageInstanceDtos) {
            const defdata = Object.assign({}, response.data.drmSwitchingStageInstanceDtos)
            const arr = []
            for (const i in defdata) {
              const lists = defdata[i].lists
              lists.splice(0, 0, defdata[i])
              for (const j in lists) {
                arr.push(lists[j])
              }
            }
            this.detailForm.list = arr
          }
        }
      })
      this.detailShow = true
    },
    closeDialog() {
      this.detailForm = {
        processName: '',
        startTime: '',
        endTime: '',
        list: []
      }
      this.detailShow = false
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  #historyTable{
    .el-dialog__body{
      padding: 10px 20px;
      .el-table__body-wrapper{
        min-height: 100px;
        max-height: 450px;
        overflow-y: auto;
      }
    }
    #dialogMitop {
      .el-dialog {
        margin-top: 6vh !important;
      }
      .el-dialog__body{
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .title{
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: bold;
  }
</style>
