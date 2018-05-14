<template>
  <div class="app-container" id="historyTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="名称" prop="name" sortable width="160"></el-table-column>
      <el-table-column label="时间" prop="time" sortable width="152"></el-table-column>
      <el-table-column label="描述" prop="describe" min-width="220"></el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{scope.row.state}}</el-tag>
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
                   :page-sizes="[10, 20, 30, 40, 50,1000]"
                   :page-size="queryPage.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="pageTotal">
    </el-pagination>
    <!--查看弹出框-->
    <el-dialog title="查看历史记录" id="dialogMitop" width="90%" :visible.sync="detailShow" :modal-append-to-body="false"
               @close="closeDialog">
      <div class="title"><span>切换流程一</span> 的报告</div>
      <div style="margin-bottom:5px;">
        <span>
          <span style="font-weight: bold;">执行时间：</span>
          <span>2018-05-14 15:21:00</span>
        </span>
        <span style="margin-left:20px;">
          <span style="font-weight: bold;">完成时间：</span>
          <span>2018-05-14 15:21:00</span>
        </span>
      </div>
      <el-table :data="processData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit :show-overflow-tooltip="true">
        <el-table-column label="切换阶段" :show-overflow-tooltip="true" prop="stage" min-width="100"></el-table-column>
        <el-table-column label="切换步骤" :show-overflow-tooltip="true" prop="step" min-width="100"></el-table-column>
        <el-table-column label="分类" prop="type" width="50"></el-table-column>
        <el-table-column label="负责人" prop="leader" :show-overflow-tooltip="true" width="78"></el-table-column>
        <el-table-column label="开始时间" prop="startTime" :show-overflow-tooltip="true" width="151"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" :show-overflow-tooltip="true" width="151"></el-table-column>
        <el-table-column label="实际用时(分钟)" prop="time" width="115"></el-table-column>
        <el-table-column label="结果" prop="statu" width="65"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getListHistory } from '@/api/recoverytable'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      detailShow: false,
      pageTotal: 0,
      pageSizes: [10, 15, 20],
      queryPage: {
        index: 1,
        size: 10
      },
      processData: {
        totalCount: 44,
        items: [
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤一',
            leader: '管理是员',
            statu: '运行中',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤二',
            leader: '管理员',
            statu: '运行中',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          },
          {
            id: 10723,
            process: '切换流程一',
            stage: '阶段一',
            step: '阶段一步骤三',
            leader: '管理员',
            statu: '完成',
            type: '手动',
            startTime: '2018-05-14 15:21:00',
            endTime: '2018-05-14 15:21:00',
            time: '5'
          }
        ]
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
      getListHistory(this.listQuery).then(response => {
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
    closeDialog() {
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
