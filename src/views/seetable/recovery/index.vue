<template>
  <div class="app-container" id="recoveryTable">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="恢复策略名称" prop="name" width="160" sortable></el-table-column>
      <el-table-column label="描述" prop="description" min-width="250"></el-table-column>
      <el-table-column label="操作" width="62">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detailshow(scope.row)">查看</el-button>
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
    <el-dialog :title="detailTitle" id="otherDialog" width="90%" :visible.sync="detailShow"
                :modal-append-to-body="false" @close='closeDialogs'>
      <el-table :data="childlist" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="序号" prop="task_order" sortable width="75" :show-overflow-tooltip=true></el-table-column>
        <el-table-column class-name="status-col" label="步骤类型">
          <template slot-scope="scope">
            {{scope.row.action | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="动作" prop="action" sortable :show-overflow-tooltip=true></el-table-column>
        <el-table-column class-name="status-col" label="超时时间" width="100">
          <template slot-scope="scope">
            {{scope.row | timeoutFilter }}
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" width="204">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button-group>-->
              <!--&lt;!&ndash;<el-button type="info" @click="operation(scope.row.id,1)">暂停</el-button>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-button type="info" @click="operation(scope.row.id,2)">继续</el-button>&ndash;&gt;-->
              <!--<el-button type="primary" size="mini" @click="operation(scope.row.id,3)">重试</el-button>-->
              <!--<el-button type="primary" size="mini" @click="operation(scope.row.id,4)">跳过</el-button>-->
              <!--<el-button type="primary" size="mini" @click="operation(scope.row.id,5)">一键退回</el-button>-->
              <!--<el-button type="primary" size="mini" @click="operation(scope.row.id,6)">停止</el-button>-->
            <!--</el-button-group>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogs">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { retrieve } from '@/api/seetable/vbs'

export default {
  data() {
    return {
      data: null,
      list: null,
      childlist: null,
      listLoading: true,
      detailTitle: '',
      pageTotal: 0,
      pageSizes: [10, 15, 20],
      queryPage: {
        index: 1,
        size: 10
      },
      listQuery: {
        url: '/vom/api/query/hadr/recoveryplan/'
      },
      detailShow: false
    }
  },
  filters: {
    statusFilter(string) {
      if (string) {
        const str_before = string.split(' ')[0]
        return str_before
      } else {
        return ''
      }
    },
    timeoutFilter(row) {
      if (row) {
        var index = null
        var arrValue = []
        if (row.param_name) {
          const names = row.param_name
          const arr = names.split(',')
          index = arr.findIndex(child => child === 'TIMEOUT')
        }
        if (row.param_value) {
          const value = row.param_value
          arrValue = value.split(',')
        }
        return arrValue[index]
      } else {
        return ''
      }
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
      retrieve(this.listQuery).then(response => {
        if (response) {
          this.data = response.result
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
    detailshow(val) {
      this.detailTitle = val.name + '的步骤列表'
      retrieve({ url: '/vom/api/query/hadr/recoveryplan/' + val.encoded_id + '/task' }).then(response => {
        if (response) {
          this.childlist = Object.assign([], response.result)
        }
      })
      this.detailShow = true
    },
    closeDialogs() {
      this.detailTitle = ''
      this.childlist = []
      this.detailShow = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  #recoveryTable{
    .el-dialog{
      margin-top:6vh !important;
    }
    .el-dialog__body{
      padding: 10px 20px;
      .el-table__body-wrapper{
        height: 400px;
        overflow-y: auto;
      }
    }
  }
</style>
<style  rel="stylesheet/scss" lang="scss" scoped>

</style>
