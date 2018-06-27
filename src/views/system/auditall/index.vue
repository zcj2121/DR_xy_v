<template>
  <div class="app-container" id="userTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.approveName" placeholder="请输入审核流程名称">
      </el-input>
      <el-select style="width: 200px;" size="mini" v-model="searchQuery.approveType" placeholder="请选择分类">
        <el-option key="0" label="全部审核" value=""></el-option>
        <el-option key="1" label="预案审核" value="1"></el-option>
        <el-option key="2" label="切换流程" value="2"></el-option>
        <el-option key="3" label="切换执行" value="3"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit>
      <el-table-column label="审核流程名称" prop="approveName" min-width="150" sortable></el-table-column>
      <el-table-column class-name="status-col" label="分类" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.approveType | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="审核人"  min-width="300">
        <template slot-scope="scope">
          {{scope.row.userList | processFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="101">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="operation({ id: scope.row.id }, '确认删除吗', '/rs/dr/approveTemplateManager/deleteApproveTempkate')">删除</el-button>
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
    <el-dialog :title="operateTitle" width="610px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose('formAll')">
      <el-form :model="form" ref="formAll" label-position="right" label-width="95px">
        <el-form-item label="名称：" prop="approveName" :rules="[
                { required: true, message: '请输入名称', trigger: 'blur' }
              ]">
          <el-input v-model="form.approveName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="审核类型：" prop="approveType" :rules="[
                { required: true, message: '请选择审核类型', trigger: 'change' }
              ]">
          <el-select v-model="form.approveType" placeholder="请选择审核类型" style="width:100%;">
            <el-option key="1" label="预案审核" value="1"></el-option>
            <el-option key="2" label="切换流程" value="2"></el-option>
            <el-option key="3" label="切换执行" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="index === 0?'审核人：':''" :prop="'userList.' + index + '.value'" v-for="(item, index) in form.userList" :key="index" :rules="[
                { required: true, message: '请选择审核人', trigger: 'change' }
              ]">
          <el-select v-model="item.value" placeholder="请选择审核人" style="width:86.3%;">
            <el-option v-for="userOption in userOptions" :key="userOption.id+'-'+index" :label="userOption.displayName"
                       :value="userOption.id"></el-option>
          </el-select>
          <el-button v-if="index === 0" class="filter-item" size="mini" style="margin-left: 10px;padding:12px;" type="" @click="add()">添加</el-button>
          <el-button v-else class="filter-item" size="mini" style="margin-left: 10px;padding:12px;" type="" @click="del(index)">删除</el-button>
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
  import { findAllUserInRoleEnable, saveApproveTemplate, updateApproveTemplate, findApproveTempkate } from '@/api/system/auditall'
  import { alertBox } from '@/utils/request'
  export default {
    data() {
      return {
        data: null, // 原始数据
        list: null, // 列表显示数据
        listLoading: true, // 加载动画
        pageTotal: 0, // 数据总条数
        pageSizes: [10, 15, 20], // 每页显示条数 规则
        queryPage: {
          index: 1, // 第几页
          size: 10 // 每页显示条数
        },
        searchQuery: { // 查询数据
          approveName: '',
          approveType: ''
        },
        thisId: '',
        form: { // 新增编辑 数据
          approveName: '',
          approveType: '',
          userList: [{
            value: ''
          }]
        },
        isEdit: false, // 是否是进行编辑操作
        operateTitle: '', // 新增、编辑 弹出框 标题
        formShow: false, // 是否 显示 新增、编辑 弹出框
        userOptions: []
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '预案审核',
          2: '切换流程',
          3: '切换执行'
        }
        return statusMap[status]
      },
      processFilter(data) {
        if (data instanceof Array) {
          if (data.length > 0) {
            const arr = []
            const defarr = Object.assign([], data)
            for (const i in defarr) {
              if (defarr[i]) {
                arr.push(defarr[i].displayName)
              }
            }
            const processMap = arr.join('→')
            return processMap
          } else {
            return ''
          }
        } else {
          return ''
        }
      }
    },
    watch: {
      // 监听 查询条件
      searchQuery: {
        handler(searchQuery) {
          this.queryPage.index = 1
          this.search()
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
        findApproveTempkate(this.searchQuery).then(response => {
          if (response) {
            this.data = response.list
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
        // if (this.list.length === 0 && this.queryPage.index > 1) {
        //   this.list = this.data.slice(size * (index - 2), size * index)
        // }
      },
      // 查询 数据
      search() {
        this.fetchData()
      },
      // 列表数据 分页 搜索
      // 删除、启用等 公共弹框
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      // 删除、启用等 公共弹框
      // 新增、修改 操作
      // 弹出框 打开
      operate(type, val) {
        this.userOptions = []
        findAllUserInRoleEnable().then(response => {
          this.userOptions = response.list
        })
        if (type === 'add') {
          this.operateTitle = '新增审核模板'
          this.isEdit = false
        } else if (type === 'edit') {
          this.isEdit = true
          this.thisId = val.id
          if (val) {
            this.form.approveName = val.approveName
            this.form.approveType = (val.approveType).toString()
            if (val.userList) {
              const arr = []
              for (const i in val.userList) {
                arr.push({
                  value: val.userList[i].id
                })
              }
              this.form.userList = Object.assign([], arr)
            }
          }
          this.operateTitle = '编辑审核模板'
        }
        this.formShow = true
      },
      // 弹出框 关闭
      operateClose(formName) {
        this.$refs[formName].resetFields()
        this.formShow = false
        this.form = {
          approveName: '',
          approveType: '',
          userList: [{
            value: ''
          }]
        }
      },
      // 新增、修改 操作
      add() {
        this.form.userList.push({
          value: ''
        })
      },
      del(index) {
        this.form.userList.splice(index, 1)
      },
      // 点击保存
      save(formName) {
        const arr = []
        const defArr = Object.assign([], this.form.userList)
        for (const i in defArr) {
          arr.push(defArr[i].value)
        }
        if (this.isEdit === false) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              saveApproveTemplate({
                approveName: this.form.approveName,
                approveType: this.form.approveType,
                userList: arr
              }).then(() => {
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
              updateApproveTemplate(
                {
                  id: this.thisId,
                  approveName: this.form.approveName,
                  approveType: this.form.approveType,
                  userList: arr
                }
              ).then(() => {
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
  #userTable{
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
