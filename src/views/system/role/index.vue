<template>
  <div class="app-container" id="roleTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal" placeholder="请输入角色名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
    </div>
    <el-table :data="roleData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="角色名称" prop="tRoleName" sortable></el-table-column>
      <el-table-column label="角色键值" prop="tRoleValue" sortable></el-table-column>
      <el-table-column label="操作" width="101">
        <template slot-scope="scope">
          <el-button-group>
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
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="form.tRoleName" placeholder="请输入角色名称"></el-input>
          <div class="name-repeat" v-if="nameRepeat">名称重复</div>
        </el-form-item>
        <el-form-item label="角色键值：" prop="enabled">
          <el-input v-model="form.tRoleValue" placeholder="请输入角色键值"></el-input>
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
        tRoleName: '',
        tRoleValue: ''
      },
      operateTitle: '',
      formShow: false,
      nameRepeat: false,
      roleData: {
        count: 4,
        items: [
          {
            id: 6,
            tRoleName: '超级管理员',
            tRoleValue: 'supermanager',
            enable: 1
          },
          {
            id: 3,
            tRoleName: '观察员',
            tRoleValue: 'query',
            enable: 1
          },
          {
            id: 2,
            tRoleName: '操作员',
            tRoleValue: 'operator',
            enable: 1
          },
          {
            id: 1,
            tRoleName: '管理员',
            tRoleValue: 'manager',
            enable: 1
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
        this.operateTitle = '新增角色信息'
      } else if (type === 'edit') {
        this.operateTitle = '编辑角色信息'
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
  #roleTable{
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
