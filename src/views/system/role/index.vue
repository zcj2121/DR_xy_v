<template>
  <div class="app-container" id="roleTable">
    <span class="tabel-title">角色管理列表</span>
    <div class="filter-container">
      <el-input style="width: 200px;" size="medium" class="filter-item" v-model="pageTotal">
      </el-input>
      <el-button class="filter-item" size="medium" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-edit">新增</el-button>
    </div>
    <el-table :data="roleData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="角色名称" prop="tRoleName" sortable></el-table-column>
      <el-table-column label="角色键值" prop="tRoleValue" sortable></el-table-column>
      <el-table-column label="操作" width="134">
        <template slot-scope="scope">
          <el-button-group>
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
    detail(val) {
      this.detailShow = true
    },
    closeDialogs() {
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
