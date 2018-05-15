<template>
  <div class="app-container" id="userTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal" placeholder="请输入用户名">
      </el-input>
      <el-select style="width: 200px;" size="mini" v-model="role" placeholder="请选择权限">
        <el-option v-for="item in roleDataOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
    </div>
    <el-table :data="userData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="用户名" prop="userName" sortable></el-table-column>
      <el-table-column label="显示昵称" prop="displayName" sortable></el-table-column>
      <el-table-column label="手机号码" prop="telphone" sortable></el-table-column>
      <el-table-column label="电子邮箱" prop="email" sortable></el-table-column>
      <el-table-column label="权限" prop="permission" sortable></el-table-column>
      <el-table-column label="操作" width="164">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operation(scope.row.id, '确认重置密码吗', '123')">重置密码</el-button>
            <el-button size="mini" type="primary" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="operation(scope.row.id, '确认删除吗', '123')">删除</el-button>
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
    <!--新增、编辑 弹出框-->
    <el-dialog :title="operateTitle" width="500px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose">
      <el-form :model="form" label-position="right" label-width="85px">
        <el-form-item label="用户名：" prop="name">
          <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
          <div class="name-repeat" v-if="nameRepeat">名称重复</div>
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
            <el-option v-for="item in roleDataOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
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
  import { getList } from '@/api/seetable'
  import { alertBox } from '@/utils/alert'
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
        form: {
          userName: '',
          displayName: '',
          department: '',
          telphone: '',
          email: '',
          permission: ''
        },
        operateTitle: '',
        formShow: false,
        nameRepeat: false,
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
              permissionValue: 'manager',
              department: '前端开发部',
              displayName: '秦臻',
              email: '272171225@qq.com',
              password: 'MTIzNDU2',
              permission: '管理员',
              sessionid: '1DFA16ACC7F0879F9B41A9AA1D537288',
              telphone: '18268064851',
              userName: 'qinzhen',
              ipAddress: null
            },
            {
              id: 10723,
              permissionValue: 'manager',
              department: '前端开发部',
              displayName: '秦臻',
              email: '272171225@qq.com',
              password: 'MTIzNDU2',
              permission: '管理员',
              sessionid: '1DFA16ACC7F0879F9B41A9AA1D537288',
              telphone: '18268064851',
              userName: 'qinzhen',
              ipAddress: null
            },
            {
              id: 10723,
              permissionValue: 'manager',
              department: '前端开发部',
              displayName: '秦臻',
              email: '272171225@qq.com',
              password: 'MTIzNDU2',
              permission: '管理员',
              sessionid: '1DFA16ACC7F0879F9B41A9AA1D537288',
              telphone: '18268064851',
              userName: 'qinzhen',
              ipAddress: null
            },
            {
              id: 10723,
              permissionValue: 'manager',
              department: '前端开发部',
              displayName: '秦臻',
              email: '272171225@qq.com',
              password: 'MTIzNDU2',
              permission: '管理员',
              sessionid: '1DFA16ACC7F0879F9B41A9AA1D537288',
              telphone: '18268064851',
              userName: 'qinzhen',
              ipAddress: null
            },
            {
              id: 10723,
              permissionValue: 'manager',
              department: '前端开发部',
              displayName: '秦臻',
              email: '272171225@qq.com',
              password: 'MTIzNDU2',
              permission: '管理员',
              sessionid: '1DFA16ACC7F0879F9B41A9AA1D537288',
              telphone: '18268064851',
              userName: 'qinzhen',
              ipAddress: null
            },
            {
              id: 10723,
              permissionValue: 'manager',
              department: '前端开发部',
              displayName: '秦臻',
              email: '272171225@qq.com',
              password: 'MTIzNDU2',
              permission: '管理员',
              sessionid: '1DFA16ACC7F0879F9B41A9AA1D537288',
              telphone: '18268064851',
              userName: 'qinzhen',
              ipAddress: null
            },
            {
              id: 10723,
              permissionValue: 'manager',
              department: '前端开发部',
              displayName: '秦臻',
              email: '272171225@qq.com',
              password: 'MTIzNDU2',
              permission: '管理员',
              sessionid: '1DFA16ACC7F0879F9B41A9AA1D537288',
              telphone: '18268064851',
              userName: 'qinzhen',
              ipAddress: null
            },
            {
              id: 10723,
              permissionValue: 'manager',
              department: '前端开发部',
              displayName: '秦臻',
              email: '272171225@qq.com',
              password: 'MTIzNDU2',
              permission: '管理员',
              sessionid: '1DFA16ACC7F0879F9B41A9AA1D537288',
              telphone: '18268064851',
              userName: 'qinzhen',
              ipAddress: null
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
      operate(type, val) {
        if (type === 'add') {
          this.operateTitle = '新增用户信息'
        } else if (type === 'edit') {
          this.operateTitle = '编辑用户信息'
        }
        this.formShow = true
      },
      operateClose() {
        this.formShow = false
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
