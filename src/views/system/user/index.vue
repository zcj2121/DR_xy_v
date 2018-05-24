<template>
  <div class="app-container" id="userTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.userName" placeholder="请输入用户名">
      </el-input>
      <el-select style="width: 200px;" size="mini" v-model="searchQuery.permission" placeholder="请选择权限">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="item in roleDataOptions" :key="item.tRoleValue" :label="item.tRoleName"
                   :value="item.tRoleValue"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="用户名" prop="userName" :show-overflow-tooltip="true" sortable></el-table-column>
      <el-table-column label="显示昵称" prop="displayName" :show-overflow-tooltip="true" sortable></el-table-column>
      <el-table-column label="手机号码" prop="telphone" :show-overflow-tooltip="true" sortable></el-table-column>
      <el-table-column label="电子邮箱" prop="email" :show-overflow-tooltip="true" sortable></el-table-column>
      <el-table-column label="权限" prop="permission" :show-overflow-tooltip="true" sortable></el-table-column>
      <el-table-column label="操作" width="164">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operation({ id: scope.row.id }, '确认重置密码吗', '/rs/dr/system/usermanager/resetPassword')">重置密码</el-button>
            <el-button size="mini" type="primary" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="operation({ id: scope.row.id }, '确认删除吗', '/rs/dr/system/usermanager/delete')">删除</el-button>
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
    <el-dialog :title="operateTitle" width="530px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose('formAll')">
      <el-form :model="form" ref="formAll" :rules="rules" label-position="right" label-width="95px">
        <el-form-item label="用户名：" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="显示昵称：" prop="displayName" :rules="[
                { required: true, message: '请输入显示昵称', trigger: 'blur' }
              ]">
          <el-input v-model="form.displayName" placeholder="请输入显示昵称"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="department" :rules="[
                { required: true, message: '请输入部门', trigger: 'blur' }
              ]">
          <el-input v-model="form.department" placeholder="请输入部门"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="telphone">
          <el-input v-model="form.telphone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="email" :rules="[
            { required: true, message: '请输入电子邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的电子邮箱', trigger: ['blur', 'change'] }
          ]">
          <el-input v-model="form.email" placeholder="请输入电子邮箱"></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="permission" :rules="[
                { required: true, message: '请选择权限', trigger: 'change' }
              ]">
          <el-select v-model="form.permission" placeholder="请选择权限" style="width:100%;">
            <el-option v-for="item in roleDataOptions" :key="item.tRoleValue" :label="item.tRoleName"
                       :value="item.tRoleValue"></el-option>
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
  import { retrieve, retrieveRole, creat, update } from '@/api/system/user'
  import { validatePhone, userNamePhone } from '@/utils/validate'
  import { alertBox } from '@/utils/request'

  var validUserName = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入用户名'))
    } else if (!userNamePhone(value)) {
      callback(new Error('请输入正确的用户名，字母、数字、下划线、并不能以下划线开头结尾'))
    } else {
      callback()
    }
  }
  var validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入手机号码'))
    } else if (!validatePhone(value)) {
      callback(new Error('请输入正确的11位手机号码'))
    } else {
      callback()
    }
  }
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
          userName: '',
          permission: ''
        },
        form: { // 新增编辑 数据
          userName: '',
          displayName: '',
          department: '',
          telphone: '',
          email: '',
          permission: ''
        },
        isEdit: false, // 是否是进行编辑操作
        operateTitle: '', // 新增、编辑 弹出框 标题
        formShow: false, // 是否 显示 新增、编辑 弹出框
        roleDataOptions: [],
        rules: {
          userName: [
            { required: true, trigger: 'blur', validator: validUserName } // 这里需要用到全局变量
          ],
          telphone: [
            { required: true, trigger: 'blur', validator: validPhone } // 这里需要用到全局变量
          ]
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
      }
    },
    created() {
      this.fetchData()
      this.rolehData()
    },
    methods: {
      // 列表数据 分页 搜索
      // 请求 原始数据
      fetchData() {
        this.queryPage.index = 1
        this.listLoading = true
        retrieve(this.searchQuery).then(response => {
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
      // 请求 权限
      rolehData() {
        this.roleDataOptions = []
        retrieveRole({ enable: 1 }).then(response => {
          if (response) {
            this.roleDataOptions = response.list
          }
        })
      },
      // 请求 权限
      // 删除、启用等 公共弹框
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      // 删除、启用等 公共弹框
      // 新增、修改 操作
      // 弹出框 打开
      operate(type, val) {
        if (type === 'add') {
          this.operateTitle = '新增用户信息'
          this.isEdit = false
        } else if (type === 'edit') {
          this.isEdit = true
          this.form = Object.assign({}, {
            id: val.id,
            userName: val.userName,
            displayName: val.displayName,
            department: val.department,
            telphone: val.telphone,
            email: val.email,
            permission: val.permissionValue
          })
          this.operateTitle = '编辑用户信息'
        }
        this.formShow = true
      },
      // 弹出框 关闭
      operateClose(formName) {
        this.$refs[formName].resetFields()
        this.formShow = false
        this.form = {
          userName: '',
          displayName: '',
          department: '',
          telphone: '',
          email: '',
          permission: ''
        }
      },
      // 点击保存
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
              creat(this.form).then(() => {
                this.fetchData()
                this.formShow = false
              })
            } else {
              return false
            }
          })
        }
      }
      // 新增、修改 操作
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
