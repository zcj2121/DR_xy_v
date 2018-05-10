<template>
  <div class="app-container" id="menuTable">

    <el-row>
      <el-col :span="5">
        <span class="tabel-title">目录列表</span>
        <div class="menu-left">
          <el-radio-group v-model="radio3">
            <el-radio-button :label="item.id" v-for="(item, index) in menuParent.items" :key="index">{{item.tMenuName}}</el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="19">
        <span class="tabel-title">菜单列表</span>
        <span class="pull-right"><el-button class="filter-item" size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-edit">新增</el-button></span>
        <el-table :data="menuParent.items" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column label="菜单名称" prop="tMenuName" sortable></el-table-column>
          <el-table-column label="菜单键值" prop="tMenuValue" width="160" sortable></el-table-column>
          <el-table-column class-name="status-col" label="菜单图标" width="110" align="center">
            <template slot-scope="scope">
              <el-tag type="success"><i :class="'fa fa-'+scope.row.tMenuStyle"></i></el-tag>
            </template>
          </el-table-column>
          <el-table-column label="菜单顺序" prop="tMenuOrder" width="110" sortable></el-table-column>
          <el-table-column label="菜单类型" prop="tMenuType" width="120" sortable></el-table-column>
          <el-table-column label="是否可用" prop="tMenuEnable" width="80"></el-table-column>
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
      radio3: 4,
      menuParent: {
        count: 4,
        items: [
          {
            id: 4,
            tMenuEnable: '1',
            tMenuName: '预案管理',
            tMenuOrder: 3,
            tMenuParent: 0,
            tMenuStyle: 'icon-file-text',
            tMenuType: '0',
            tMenuValue: 'prepareManage'
          },
          {
            id: 5,
            tMenuEnable: '0',
            tMenuName: '演练管理',
            tMenuOrder: 3,
            tMenuParent: 0,
            tMenuStyle: 'icon-tags',
            tMenuType: '0',
            tMenuValue: 'apply'
          },
          {
            id: 6,
            tMenuEnable: '1',
            tMenuName: '组织架构',
            tMenuOrder: 4,
            tMenuParent: 0,
            tMenuStyle: 'icon-flag',
            tMenuType: '0',
            tMenuValue: null
          },
          {
            id: 13,
            tMenuEnable: '1',
            tMenuName: '系统管理',
            tMenuOrder: 13,
            tMenuParent: 0,
            tMenuStyle: 'icon-leaf',
            tMenuType: '0',
            tMenuValue: 'systemManage'
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
  .tabel-title {
    font-size: 20px;
    margin-bottom: 10px;
    display: inline-block;
    line-height: 35px;
  }
</style>
