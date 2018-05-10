<template>
  <div class="app-container" id="menuTable">

    <el-row>
      <el-col :span="5">
        <span class="tabel-title">角色列表</span>
        <div class="menu-left">
          <el-radio-group v-model="radio3">
            <el-radio-button :label="item.id" v-for="(item, index) in roleData.items" :key="index">{{item.tRoleName}}</el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="19">
        <span class="tabel-title">菜单树</span>
        <div class="menu-tree">
          <el-tree
            :data="data2"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="btn-box-bottom">
          <el-button class="filter-item" size="medium" type="primary" >保存</el-button> <el-button class="filter-item" style="margin-left:10px;" size="medium" type="primary" >重置</el-button>
        </div>

      </el-col>
    </el-row>

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
        radio3: 6,
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
        },
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
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
  #menuTable{
    .menu-left{
      margin-right: 20px;
      .el-radio-group{
        display: block;
        width:100%;
        .el-radio-button, .el-radio-button__inner{
          display: block;
        }
        .el-radio-button:first-child .el-radio-button__inner{
          border-radius: 0px;
        }
        .el-radio-button__inner{
          border-left:1px solid #dcdfe6;
          border-bottom: none;
        }
        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
          border-left:1px solid #409EFF;
        }
        .el-radio-button:last-child .el-radio-button__inner{
          border-radius: 0px;
        }
        .el-radio-button:last-child .el-radio-button__inner{
          border-bottom:1px solid #dcdfe6;
        }
      }
    }
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
  .menu-tree{
    border:1px solid #dcdfe6;
    padding:15px;
  }
  .btn-box-bottom{
    margin-top:15px;
  }
</style>
