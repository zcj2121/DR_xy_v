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
      <el-table-column label="用户名" prop="userName" sortable></el-table-column>
      <el-table-column label="显示昵称" prop="displayName" sortable></el-table-column>
      <el-table-column label="手机号码" prop="telphone" sortable></el-table-column>
      <el-table-column label="电子邮箱" prop="email" sortable></el-table-column>
      <el-table-column label="权限" prop="permission" sortable></el-table-column>
      <el-table-column label="操作" width="164">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operation(scope.row.id, '确认重置密码吗', '/rs/dr/system/usermanager/resetPassword')">重置密码</el-button>
            <el-button size="mini" type="primary" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="operation(scope.row.id, '确认删除吗', '/rs/dr/system/usermanager/delete')">删除</el-button>
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
    <el-dialog :title="operateTitle" width="500px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose">
      <el-form :model="form" label-position="right" label-width="85px">
        <el-form-item label="用户名：" prop="name">
          <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="显示昵称：" prop="enabled">
          <el-input v-model="form.displayName" placeholder="请输入显示昵称"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="enabled">
          <el-input v-model="form.department" placeholder="请输入部门"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="enabled">
          <el-input v-model="form.telphone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="enabled">
          <el-input v-model="form.email" placeholder="请输入电子邮箱"></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="enabled">
          <el-select v-model="form.permission" placeholder="请选择权限" style="width:100%;">
            <el-option v-for="item in roleDataOptions" :key="item.tRoleValue" :label="item.tRoleName"
                       :value="item.tRoleValue"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="operateClose('allform')">取 消</el-button>
        <el-button type="primary" @click="save('allform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { retrieve, retrieveRole, creat, update } from '@/api/system/user'
  import { alertBox } from '@/utils/alert'
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
        ]
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
      },
      // 查询 数据
      search() {
        this.fetchData()
      },
      // 列表数据 分页 搜索
      // 请求 权限
      rolehData() {
        this.roleDataOptions = []
        retrieveRole().then(response => {
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
      operateClose() {
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
      save() {
        if (this.isEdit === true) {
          update(this.form).then(() => {
            this.fetchData()
            this.formShow = false
          })
        } else {
          creat(this.form).then(() => {
            this.fetchData()
            this.formShow = false
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
