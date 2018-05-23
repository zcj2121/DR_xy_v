<template>
  <div class="app-container" id="executeTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.processName" placeholder="请输入切换流程名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column label="切换流程名称" prop="processName" min-width="100" sortable></el-table-column>
      <el-table-column label="描述" prop="processTitle" min-width="120" sortable></el-table-column>
      <el-table-column class-name="status-col" label="状态" width="75" align="center">
        <template slot-scope="scope">
          {{scope.row.state | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detail(scope.row)">查看</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.state===0"
                       @click="operation({ id: scope.row.id }, '确认开始执行吗', '/rs/dr/drmProcessExecution/start')">开始
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.state!==0"><a @click="isRest" href="#/bigscreen" target="_blank">大屏</a>
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.state===8||scope.row.state===10"
                       @click="operation({ id: scope.row.id }, '确认完成执行吗', '/rs/dr/drmProcessExecution/completeProcess')">完毕
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
    <!--查看弹出框-->
    <el-dialog title="查看切换流程执行详情" id="dialogMitop" width="90%" :visible.sync="detailShow" :modal-append-to-body="false"
               @close="closeDialog">
      <div class="title pull-left">{{detailForm.processName}}</div>
      <span class="pull-right" style="margin-bottom: 5px;">
        <el-button size="mini" type="primary" @click="operation({ id: detailForm.id}, '确认暂停执行吗', '/rs/dr/drmProcessExecution/stopProcess', 'detailDefFun')">暂停</el-button>
        <el-button size="mini" type="primary" @click="operation({ id: detailForm.id}, '确认终止执行吗', '/rs/dr/drmProcessExecution/stopitProcess', 'detailDefFun')">终止</el-button>
        <!--<el-button size="mini" type="primary" @click="operation({ id: detailForm.id}, '确认一键回退吗', '123', 'detailDefFun')">一键回退</el-button>-->
      </span>
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
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" v-if="scope.row.state===3"
                         @click="operation({ id: scope.row.id }, '确认恢复执行吗', '/rs/dr/drmProcessExecution/startStep', 'detailDefFun')">恢复
              </el-button>
              <el-button size="mini" type="primary" v-if="scope.row.state===13"
                         @click="operation({ id: scope.row.id }, '确认跳过执行吗', '/rs/dr/drmProcessExecution/skipStep', 'detailDefFun')">跳过
              </el-button>
              <el-button size="mini" type="primary" v-if="scope.row.state===13"
                         @click="operation({ id: scope.row.id }, '确认重试吗', '/rs/dr/drmProcessExecution/retryStep', 'detailDefFun')">重试
              </el-button>
            </el-button-group>
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
  import { getExecutionProcess, getAll } from '@/api/change/execute'
  import { alertBox } from '@/utils/alert'
  import { formatDate } from '@/utils/index'

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
        detailShow: false,
        searchQuery: { // 查询数据
          processName: ''
        },
        thisIdbox: {},
        detailForm: {
          processName: '',
          list: []
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '执行中',
          7: '暂停',
          8: '完成',
          9: '历史',
          10: '终止',
          0: '未执行'
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
    watch: {
      // 监听 查询条件
      searchQuery: {
        handler(searchQuery) {
          this.search()
          this.queryPage.index = 1
        },
        deep: true
      },
      detailShow: {
        handler(detailShow) {
          if (this.detailShow === true) {
            this.timeInts()
          }
        },
        deep: true
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
        getExecutionProcess(this.searchQuery).then(response => {
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
      // 查询 数据
      search() {
        this.fetchData()
      },
      operation(id, msg, url, deffun) {
        alertBox(this, msg, url, id, deffun)
      },
      detail(val) {
        this.thisIdbox = val
        this.detailShow = true
        this.detailDefFun()
      },
      closeDialog() {
        this.fetchData()
        this.detailForm = {
          processName: '',
          id: '',
          list: []
        }
        this.detailShow = false
      },
      detailDefFun() {
        getAll({ id: this.thisIdbox.id }).then(response => {
          if (response) {
            this.detailForm.id = response.data.id
            this.detailForm.processName = response.data.processName
            console.log()
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
      },
      isRest() {
        location.reload()
      },
      timeInts() {
        setInterval(this.detailDefFun, 5000)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #executeTable {
    .el-dialog__body {
      padding: 10px 20px;
      .el-table__body-wrapper {
        height: 450px;
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
  .filter-container {
    text-align: right;
    margin-bottom: 10px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    color: #606266;
    tr {
      td {
        border: 1px solid #ebeef5;
        padding: 10px 12px;
        line-height: 25px;
      }
      th {
        border: 1px solid #ebeef5;
      }
    }
  }

  .text-bold {
    font-weight: bold;
  }
  .title{
    font-size: 16px;
    text-align: center;
    margin-bottom: 5px;
    font-weight: bold;
  }
</style>
