<template>
  <div class="app-container" id="processTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.processName" placeholder="请输入切换流程名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="operate('add')">新增
      </el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column label="切换流程名称" prop="process_name" min-width="100" sortable></el-table-column>
      <el-table-column label="描述" prop="process_title" min-width="120" sortable></el-table-column>
      <el-table-column label="负责人" prop="user_name" width="100" sortable></el-table-column>
      <el-table-column class-name="status-col" label="状态" width="75" align="center">
        <template slot-scope="scope">
          {{scope.row.process_status | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="232">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" v-if="scope.row.process_status!==3" @click="detail(scope.row)">查看
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.process_status===3" @click="detailBack(scope.row)">查看驳回建议
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.process_status=== 0||scope.row.process_status===3"
                       @click="operate('edit',scope.row)">编辑
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.process_status=== 0||scope.row.process_status===3"
                       @click="operation({ id: scope.row.id }, '确认提交吗', '/dr/switchingProcess/submission.do')">提交
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.process_status=== 2||scope.row.process_status===4"
                       @click="run(scope.row)">申请执行
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.process_status=== 2||scope.row.process_status===4"
                       @click="operation({ id: scope.row.id }, '确认撤回吗', '/dr/switchingProcess/withdraw.do')">撤回
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.process_status=== 0||scope.row.process_status===3"
                       @click="operationOther({ id: scope.row.id }, '/rs/dr/drmSwitchingProcess/verifyingdelete' , '/rs/dr/drmSwitchingProcess/delete')">删除
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
    <!--新增、编辑 弹出框-->
    <el-dialog :title="operateTitle" width="600px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose('formAll')">
      <el-form :model="form" ref="formAll" label-position="right" label-width="110px">
        <el-form-item label="流程名称：" prop="process_name" :rules="[
                { required: true, message: '请输入流程名称', trigger: 'blur' }
              ]">
          <el-input v-model="form.process_name" placeholder="请输入流程名称"></el-input>
        </el-form-item>
        <el-form-item label="流程描述：" prop="remark">
          <el-input type="textarea" v-model="form.process_title" placeholder="请输入流程描述"></el-input>
        </el-form-item>
        <el-form-item label="流程负责人：" prop="userid" :rules="[
                { required: true, message: '请选择流程负责人', trigger: 'change' }
              ]">
          <el-select v-model="form.userid" placeholder="请选择流程负责人" style="width:100%;">
            <el-option v-for="item in useridOptions" :key="item.id" :label="item.displayName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批流程：" prop="approvalidLong" :rules="[
                { required: true, message: '请选择审批流程', trigger: 'change' }
              ]">
          <el-select v-model="form.approvalidLong" placeholder="请选择审批流程" style="width:100%;">
            <el-option v-for="item in rebutStringOptions" :key="item.id" :label="item.approveName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="operateClose('formAll')">取 消</el-button>
        <el-button type="primary" @click="save('formAll')">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看弹出框-->
    <el-dialog title="查看切换流程" id="dialogMitop" width="90%" :visible.sync="detailShow" :modal-append-to-body="false"
               @close="closeDialog">
      <table class="el-table__body">
        <tr>
          <td class="text-bold" style="width:150px;">切换流程名称</td>
          <td colspan="2">{{detailFrom.process_name}}</td>
          <td class="text-bold" style="width:150px;">负责人</td>
          <td colspan="2">{{detailFrom.user_name}}</td>
        </tr>
        <tr>
          <td class="text-bold">切换流程描述</td>
          <td colspan="5">{{detailFrom.process_title}}</td>
        </tr>
      </table>
      <div id="elStepBox">
        <org-tree
          :data="treedata"
          :horizontal="horizontal"
          :collapsable="collapsable"
          :label-class-name="labelClassName"
          :render-content="renderContent"
        >
        </org-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <!--查看驳回信息 弹出框-->
    <el-dialog title="查看驳回信息" width="450px" :visible.sync="detailBackShow" :modal-append-to-body="false"
               @close="detailBackClose">
      <div style="color:red;    overflow: hidden;    text-indent: 2em;">{{backDetail}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailBackClose('allform')">关 闭</el-button>
      </div>
    </el-dialog>
    <!--申请执行 弹出框-->
    <el-dialog title="申请执行" width="400px" :visible.sync="runShow" :modal-append-to-body="false"
               @close="runClose('formRun')">
      <el-form :model="runForm" label-position="right"ref="formRun" label-width="95px">
        <el-form-item label="审批流程：" prop="approvalid" :rules="[
                { required: true, message: '请选择审批流程', trigger: 'change' }
              ]">
          <el-select placeholder="请选择审批流程" v-model="runForm.approvalid" style="width:100%;">
            <el-option v-for="item in approvalidOptions" :key="item.id" :label="item.approveName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="runClose('formRun')">取 消</el-button>
        <el-button type="primary" @click="runSave('formRun')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllProcess, findApproveTempkate, findAllUser, insert, update, getRebut, enforcement, findAllToExamine } from '@/api/allocation/process'
  import { alertBox, alertOtherBox } from '@/utils/request'
  import OrgTree from '@/components/org-tree'

  export default {
    components: {
      OrgTree
    },
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        operateTitle: '',
        formShow: false,
        isEdit: false, // 是否是进行编辑操作
        detailBackShow: false,
        runShow: false,
        auditName: '1',
        form: {
          process_name: '',
          process_title: '',
          userid: '',
          approvalidLong: ''
        },
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        searchQuery: { // 查询数据
          processName: ''
        },
        queryPage: {
          index: 1,
          size: 10
        },
        detailShow: false,
        useridOptions: [],
        rebutStringOptions: [],
        approvalidOptions: [],
        backDetail: '', // 驳回信息
        runForm: {
          id: '',
          approvalid: ''
        },
        detailFrom: {
          process_name: '',
          process_title: '',
          user_name: ''
        },
        treedata: {},
        horizontal: true,
        collapsable: false,
        labelClassName: 'bg-white'
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '待提交',
          1: '待审批',
          2: '通过',
          3: '驳回',
          4: '通过',
          5: '通过'
        }
        return statusMap[status]
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
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.queryPage.index = 1
        this.listLoading = true
        getAllProcess(this.searchQuery).then(response => {
          if (response) {
            this.data = response.data
            this.pageTotal = response.count
            this.listData()
            this.listLoading = false
          }
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
      // 查询 数据
      search() {
        this.fetchData()
      },
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      operationOther(id, url, makeurl) {
        alertOtherBox(this, url, makeurl, id)
      },
      detail(val) {
        this.detailFrom = {
          process_name: val.process_name,
          process_title: val.process_title,
          user_name: val.user_name
        }
        findAllToExamine({ id: val.id }).then(response => {
          if (response) {
            this.treedata = response.data
          }
        })
        this.detailShow = true
      },
      closeDialog() {
        this.treedata = []
        this.detailShow = false
      },
      operate(type, val) {
        this.useridOptions = []
        this.rebutStringOptions = []
        findAllUser().then(response => {
          if (response) {
            this.useridOptions = Object.assign([], response.userList)
          }
        })
        findApproveTempkate({ approveType: 2 }).then(response => {
          if (response) {
            this.rebutStringOptions = Object.assign([], response.list)
          }
        })
        if (type === 'add') {
          this.operateTitle = '新增流程信息'
          this.isEdit = false
        } else if (type === 'edit') {
          this.isEdit = true
          if (val) {
            this.form = Object.assign({}, {
              id: val.id,
              process_name: val.process_name,
              process_title: val.process_title,
              userid: val.userid,
              approvalidLong: parseInt(val.approvalidLong)
            })
          }
          this.operateTitle = '编辑流程信息'
        }
        this.formShow = true
      },
      operateClose(formName) {
        this.$refs[formName].resetFields()
        this.form = {
          process_name: '',
          process_title: '',
          userid: '',
          approvalidLong: ''
        }
        this.formShow = false
      },
      save(formName) {
        if (this.isEdit === true) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              update(this.form).then(() => {
                this.fetchData()
                this.formShow = false
              })
            } else {
              return false
            }
          })
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              insert(this.form).then(() => {
                this.fetchData()
                this.formShow = false
              })
            } else {
              return false
            }
          })
        }
      },
      detailBack(val) {
        getRebut({ id: val.id }).then(response => {
          this.backDetail = response.data
        })
        this.detailBackShow = true
      },
      detailBackClose() {
        this.backDetail = ''
        this.detailBackShow = false
      },
      run(val) {
        this.approvalidOptions = []
        this.runForm.id = val.id
        findApproveTempkate({ approveType: 3 }).then(response => {
          if (response) {
            this.approvalidOptions = Object.assign([], response.list)
          }
        })
        this.runShow = true
      },
      runClose(formName) {
        this.$refs[formName].resetFields()
        this.runForm.approvalid = ''
        this.runShow = false
      },
      runSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            enforcement(this.runForm).then(response => {
              this.fetchData()
              this.runShow = false
            })
          } else {
            return false
          }
        })
      },
      renderContent(h, data) {
        if (data.typeName) {
          return data.name + '\n' + data.typeName + '   ' + data.userName
        } else {
          return data.name + '\n' + data.userName
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #processTable {
    .el-dialog__body {
      padding: 10px 20px;
      .el-table__body-wrapper {
        height: 250px;
        overflow-y: auto;
      }
    }
    #dialogMitop {
      .el-dialog {
        margin-top: 6vh !important;
      }
      .el-dialog__body {
        height: 550px;
        overflow-y: auto;
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

  #elStepBox {
    margin-top: 35px;
    overflow-x: auto;
    .el-step__head {
      padding-top: 10px;
      .el-step__line {
        width: 2px;
        top: 34px;
        bottom: -11px;
        left: 11px;
      }
    }
    .el-step__main {
      display: inherit;
      .el-step__title {
        line-height: 24px;
        width: 150px;
        border: 1px solid;
        padding: 10px;
        border-radius: 2px;
        float: left;
        display: inline;
        height: 46px;
      }
      .icon-toright {
        float: left;
        margin-left: 10px;
        line-height: 50px;
        color: #aaa;
      }
      .el-step-con {
        float: left;
        margin-left: 10px;
        height: 158px;
        overflow-y: auto;
        .el-step-con-item {
          width: 150px;
          overflow: hidden;
          border: 1px solid #ccc;
          padding: 0px 6px;
          border-radius: 2px;
          margin-bottom: 10px;
          height: 46px;
          .el-step-con-item-title {
            font-size: 14px;
            font-weight: bold;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 26px;
          }
          .el-step-con-item-btm {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            line-height: 14px;
          }
        }
      }
    }

  }
</style>
