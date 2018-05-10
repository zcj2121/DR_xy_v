<template>
  <div class="app-container" id="userTable">
    <span class="tabel-title">用户管理列表</span>
    <div class="filter-container">
      <el-input style="width: 200px;" size="medium" class="filter-item" v-model="pageTotal">
      </el-input>
      <el-select style="width: 200px;" size="medium" v-model="role" placeholder="ALL权限">
        <el-option v-for="item in roleDataOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-button class="filter-item" size="medium" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-edit">新增</el-button>
    </div>
    <el-table :data="userData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="用户名" prop="userName" sortable></el-table-column>
      <el-table-column label="显示昵称" prop="displayName" sortable></el-table-column>
      <el-table-column label="手机号码" prop="telphone" sortable></el-table-column>
      <el-table-column label="电子邮箱" prop="email" sortable></el-table-column>
      <el-table-column label="权限" prop="permission" sortable></el-table-column>
      <el-table-column label="操作" width="212">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="info">重置密码</el-button>
            <el-button size="mini" type="info">编辑</el-button>
            <el-button size="mini" type="info">删除</el-button>
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
    <el-dialog title="查看服务组列表" width="600px" :visible.sync="detailShow" :modal-append-to-body="false" @close="closeDialogs">
      <el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="服务组名称" prop="name" sortable></el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state | statusFilter">{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogs">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList } from '@/api/seetable'

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
      detail(val) {
        this.detailShow = true
      },
      closeDialogs() {
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
