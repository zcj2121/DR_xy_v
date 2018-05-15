<template>
  <div class="app-container" id="executeTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal" placeholder="请输入切换流程名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table :data="userData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column label="切换流程名称" prop="name" min-width="100" sortable></el-table-column>
      <el-table-column label="描述" prop="remark" min-width="120" sortable></el-table-column>
      <el-table-column label="状态" prop="statu" width="75" sortable></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detail(scope.row)">查看</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.statu==='未运行'"
                       @click="operation(scope.row.id, '确认开始执行吗', '123')">开始
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.statu!=='未运行'" @click="goBigScreen">大屏
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.statu==='完成'||scope.row.statu==='终止'"
                       @click="operation(scope.row.id, '确认完成执行吗', '123')">完毕
            </el-button>
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
    <!--查看弹出框-->
    <el-dialog title="查看切换流程执行详情" id="dialogMitop" width="90%" :visible.sync="detailShow" :modal-append-to-body="false"
               @close="closeDialog">
      <div class="title pull-left">切换流程一</div>
      <span class="pull-right" style="margin-bottom: 5px;">
        <el-button size="mini" type="primary" @click="operationAll('', '确认暂停执行吗', '123')">暂停</el-button>
        <el-button size="mini" type="primary" @click="operationAll('', '确认停止执行吗', '123')">停止</el-button>
        <el-button size="mini" type="primary" @click="operationAll('', '确认一键回退吗', '123')">一键回退</el-button>
      </span>
      <el-table :data="processData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit :show-overflow-tooltip="true">
        <el-table-column label="切换阶段" :show-overflow-tooltip="true" prop="stage" min-width="100"></el-table-column>
        <el-table-column label="切换步骤" :show-overflow-tooltip="true" prop="step" min-width="100"></el-table-column>
        <el-table-column label="分类" prop="type" width="50"></el-table-column>
        <el-table-column label="负责人" prop="leader" :show-overflow-tooltip="true" width="78"></el-table-column>
        <el-table-column label="开始时间" prop="startTime" :show-overflow-tooltip="true" width="151"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" :show-overflow-tooltip="true" width="151"></el-table-column>
        <el-table-column label="实际用时(分钟)" prop="time" width="115"></el-table-column>
        <el-table-column label="状态" prop="statu" width="65"></el-table-column>
        <el-table-column label="操作" width="104">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" v-if="scope.row.statu==='暂停'"
                         @click="operation(scope.row.id, '确认恢复执行吗', '123')">恢复
              </el-button>
              <el-button size="mini" type="primary" v-if="scope.row.statu==='异常'"
                         @click="operation(scope.row.id, '确认跳过执行吗', '123')">跳过
              </el-button>
              <el-button size="mini" type="primary" v-if="scope.row.statu==='异常'||scope.row.statu==='回退'"
                         @click="operation(scope.row.id, '确认重试吗', '123')">重试
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
  import { getList } from '@/api/seetable'
  import { alertBox } from '@/utils/alert'

  export default {
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        operateTitle: '',
        formShow: false,
        nameRepeat: false,
        detailBackShow: false,
        runShow: false,
        auditName: '1',
        form: {
          name: '',
          leader: '',
          type: '0',
          remark: '',
          process: ''
        },
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        detailShow: false,
        role: '',
        roleDataOptions: [
          {
            label: '超级管理员',
            value: 'supermanager'
          },
          {
            label: '观察员',
            value: 'query'
          },
          {
            label: '操作员',
            value: 'operator'
          },
          {
            label: '管理员',
            value: 'manager'
          }
        ],
        userData: {
          totalCount: 44,
          items: [
            {
              id: 10723,
              name: '切换流程一',
              version: '2.0',
              leader: '管理员',
              statu: '未运行',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '切换流程一',
              version: '2.0',
              leader: '管理员',
              statu: '运行中',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '切换流程一',
              version: '2.0',
              leader: '管理员',
              statu: '完成',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '切换流程一',
              version: '2.0',
              leader: '管理员',
              statu: '终止',
              type: '总体预案',
              remark: '描述描述描述'
            }
          ]
        },
        processData: {
          totalCount: 44,
          items: [
            {
              id: 10723,
              stage: '阶段一',
              step: '',
              leader: '',
              statu: '',
              type: '',
              startTime: '',
              endTime: '',
              time: ''
            },
            {
              id: 10723,
              stage: '',
              step: '阶段一步骤一',
              leader: '管理是员',
              statu: '未运行',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
            },
            {
              id: 10723,
              stage: '',
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
              stage: '',
              step: '阶段一步骤三',
              leader: '管理员',
              statu: '暂停',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
            },
            {
              id: 10723,
              stage: '',
              step: '阶段一步骤四',
              leader: '管理员',
              statu: '完成',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
            },
            {
              id: 10723,
              stage: '',
              step: '阶段一步骤五',
              leader: '管理员',
              statu: '停止',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
            },
            {
              id: 10723,
              stage: '阶段二',
              step: '',
              leader: '',
              statu: '',
              type: '',
              startTime: '',
              endTime: '',
              time: ''
            },
            {
              id: 10723,
              stage: '',
              step: '阶段二步骤一',
              leader: '管理员',
              statu: '异常',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
            },
            {
              id: 10723,
              stage: '',
              step: '阶段二步骤二',
              leader: '管理员',
              statu: '跳过',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
            },
            {
              id: 10723,
              stage: '',
              step: '阶段二步骤三',
              leader: '管理员',
              statu: '回退',
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
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      operationAll(id = '', msg, url) {
        alertBox(this, msg, url, id)
      },
      detail(val) {
        this.detailShow = true
      },
      closeDialog() {
        this.detailShow = false
      },
      goBigScreen() {
        this.$router.push({ path: '/bigscreen' })
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
