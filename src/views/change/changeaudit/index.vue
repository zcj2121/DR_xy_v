<template>
  <div class="app-container" id="changeauditTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.processName" placeholder="请输入切换流程名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="切换流程名称" prop="process_name" sortable></el-table-column>
      <el-table-column label="描述" prop="process_title" sortable></el-table-column>
      <el-table-column label="操作" width="63">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operation(scope.row)">审核</el-button>
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
    <el-dialog
      title="提示"
      :visible.sync="auditShow"
      width="420px"
      :before-close="handleClose">
      <span><div class="el-message-box__status el-icon-warning"></div><div style="padding-left: 36px;">确认审核吗</div></span>
      <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="handleClose">取 消</el-button>
    <el-button size="mini" type="primary" @click="audit(1)">通 过</el-button>
    <el-button size="mini" type="primary" @click="audit(2)">驳 回</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllProcess, updateStatus } from '@/api/change/changeaudit'
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
        auditShow: false,
        thisId: '',
        searchQuery: { // 查询数据
          processName: ''
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
    },
    methods: {
      // 列表数据 分页 搜索
      // 请求 原始数据
      fetchData() {
        this.queryPage.index = 1
        this.listLoading = true
        getAllProcess(this.searchQuery).then(response => {
          if (response) {
            this.data = response.data
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
      operation(val) {
        this.thisId = val.id
        this.auditShow = true
      },
      handleClose() {
        this.auditShow = false
      },
      audit(val) {
        updateStatus({ id: this.thisId, mark: val }).then(response => {
          this.fetchData()
          this.auditShow = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #changeauditTable{
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
