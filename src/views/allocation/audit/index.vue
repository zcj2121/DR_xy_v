<template>
  <div class="app-container" id="auditTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.processName" placeholder="请输入切换流程名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
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
      <el-table-column label="操作" width="63">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="audit(scope.row)">审批</el-button>
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
    <!--审批弹出框-->
    <el-dialog title="切换流程审核" id="dialogMitop" width="80%" :visible.sync="auditShow" :modal-append-to-body="false"
               @close="auditClose">
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
      <div class="child-title">审批原因：</div>
      <div>
        <el-input type="textarea" placeholder="请输入审批原因" v-model="form.rebutString" :rows="4"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditClose('allform')">取 消</el-button>
        <el-button type="primary" @click="auditSave(1)">通 过</el-button>
        <el-button type="primary" @click="auditSave(2)">驳 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findAllapproved, updateStatus, findAllToExamine } from '@/api/allocation/audit'
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
        auditShow: false,
        auditName: '1',
        form: {
          id: '',
          rebutString: '',
          mark: null
        },
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        searchQuery: { // 查询数据
          processName: ''
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
          4: '待审批'
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
        findAllapproved(this.searchQuery).then(response => {
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
      audit(val) {
        this.form.id = val.id
        this.detailFrom = {
          process_name: val.process_name,
          process_title: val.process_title,
          user_name: val.user_name
        }
        findAllToExamine({ id: val.id }).then(response => {
          if (response) {
            this.treedata = response.data
            console.log(this.treedata)
          }
        })
        this.auditShow = true
      },
      auditSave(val) {
        this.form.mark = val
        updateStatus(this.form).then(() => {
          this.fetchData()
          this.auditShow = false
        })
      },
      auditClose() {
        this.auditShow = false
      },
      renderContent(h, data) {
        return data.name + '\n' + data.typeName + '   ' + data.userName
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #auditTable {
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
      .el-dialog__body{
        height:550px;
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
  #elStepBox{
    margin-top:35px;
    overflow-x: auto;
    .el-step__head{
      padding-top: 10px;
      .el-step__line {
        width: 2px;
        top: 34px;
        bottom: -11px;
        left: 11px;
      }
    }
    .el-step__main{
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
      .icon-toright{
        float: left;
        margin-left: 10px;
        line-height: 50px;
        color: #aaa;
      }
      .el-step-con{
        float: left;
        margin-left: 10px;
        height: 158px;
        overflow-y: auto;
        .el-step-con-item{
          width: 150px;
          overflow: hidden;
          border:1px solid #ccc;
          padding: 0px 6px;
          border-radius: 2px;
          margin-bottom: 10px;
          height:46px;
          .el-step-con-item-title{
            font-size:14px;
            font-weight: bold;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 26px;
          }
          .el-step-con-item-btm{
            font-size:12px;
            font-weight: bold;
            text-align: center;
            line-height: 14px;
          }
        }
      }
    }

  }
  .child-title{
    font-size: 15px;
    margin-top: 15px;
    margin-bottom: 5px;
    font-weight: bold;
  }
</style>
