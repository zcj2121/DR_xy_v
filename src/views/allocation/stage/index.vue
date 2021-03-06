<template>
  <div class="app-container" id="stageTable">
    <div class="filter-container">
      <el-select style="width: 200px;" size="mini" v-model="searchQuery.processName" placeholder="请选择切换流程">
        <el-option v-for="item in processNameOptions" :key="item.id" :label="item.process_name"
                   :value="item.id"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="operate('add')">新增
      </el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column label="切换阶段名称" prop="nameString" sortable></el-table-column>
      <el-table-column label="阶段负责人" prop="userName" sortable width="120"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="operationOther({ id: scope.row.id }, '/rs/dr/drmSwitchingStage/verifyingdelete', '/rs/dr/drmSwitchingStage/delete')">删除</el-button>
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
      <el-form :model="form" ref="formAll" label-position="right" label-width="120px">
        <el-form-item label="切换阶段名称：" prop="nameString" :rules="[
                { required: true, message: '请输入切换阶段名称', trigger: 'blur' }
              ]">
          <el-input v-model="form.nameString" placeholder="请输入切换阶段名称"></el-input>
        </el-form-item>
        <el-form-item label="阶段负责人：" prop="userid" :rules="[
                { required: true, message: '请选择阶段负责人', trigger: 'change' }
              ]">
          <el-select v-model="form.userid" placeholder="请选择阶段负责人" style="width:100%;">
            <el-option v-for="item in useridOptions" :key="item.id" :label="item.displayName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="operateClose('formAll')">取 消</el-button>
        <el-button type="primary" @click="save('formAll')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllProcess, getAllStage, findAllUser, update, insert } from '@/api/allocation/stage'
  import { alertBox, alertOtherBox } from '@/utils/request'
  export default {
    data() {
      return {
        data: null,
        list: null,
        listLoading: false,
        isEdit: false, // 是否是进行编辑操作
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        searchQuery: { // 查询数据
          processName: ''
        },
        operateTitle: '',
        formShow: false,
        useridOptions: [],
        processNameOptions: [],
        form: {
          nameString: '',
          userid: '',
          processidLong: ''
        }
      }
    },
    watch: {
      // 监听 查询条件
      searchQuery: {
        handler(searchQuery) {
          this.fetchData()
          this.queryPage.index = 1
        },
        deep: true
      }
    },
    created() {
      this.fetchDataProcess()
    },
    methods: {
      fetchDataProcess() {
        getAllProcess(this.searchQuery).then(response => {
          if (response) {
            if (response.data.length > 0) {
              this.processNameOptions = response.data
              this.searchQuery.processName = response.data[0].id
            }
          }
        })
      },
      fetchData() {
        this.queryPage.index = 1
        this.list = []
        this.listLoading = false
        getAllStage({ id: this.searchQuery.processName }).then(response => {
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
      operate(type, val) {
        this.useridOptions = []
        findAllUser().then(response => {
          if (response) {
            this.useridOptions = Object.assign([], response.userList)
          }
        })
        if (type === 'add') {
          this.operateTitle = '新增切换阶段信息'
          this.form.processidLong = this.searchQuery.processName
          this.isEdit = false
        } else if (type === 'edit') {
          this.isEdit = true
          if (val) {
            this.form = Object.assign({}, {
              id: val.id,
              nameString: val.nameString,
              userid: val.userid,
              processidLong: val.processidLong
            })
          }
          this.operateTitle = '编辑切换阶段信息'
        }
        this.formShow = true
      },
      operateClose(formName) {
        this.$refs[formName].resetFields()
        this.formShow = false
        this.form = {
          nameString: '',
          userid: '',
          processidLong: ''
        }
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
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #stageTable {
    .el-dialog__body {
      padding: 10px 20px;
      .el-table__body-wrapper {
        height: 250px;
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
</style>
