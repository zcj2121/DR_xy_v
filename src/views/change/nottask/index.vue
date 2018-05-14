<template>
  <div class="app-container" id="changeauditTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table :data="processData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit :show-overflow-tooltip="true">
      <el-table-column label="切换流程名称" :show-overflow-tooltip="true" prop="process" min-width="100"></el-table-column>
      <el-table-column label="切换阶段" :show-overflow-tooltip="true" prop="stage" min-width="100"></el-table-column>
      <el-table-column label="切换步骤" :show-overflow-tooltip="true" prop="step" min-width="100"></el-table-column>
      <el-table-column label="开始时间" prop="startTime" :show-overflow-tooltip="true" width="151"></el-table-column>
      <el-table-column label="实际用时(分钟)" prop="time" width="115"></el-table-column>
      <el-table-column label="状态" prop="statu" width="65"></el-table-column>
      <el-table-column label="操作" width="62">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operation(scope.row.id, '确认完成吗', '123')">确认
            </el-button>
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
        processData: {
          totalCount: 44,
          items: [
            {
              id: 10723,
              process: '切换流程一',
              stage: '阶段一',
              step: '阶段一步骤一',
              leader: '管理是员',
              statu: '运行中',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
            },
            {
              id: 10723,
              process: '切换流程一',
              stage: '阶段一',
              step: '阶段一步骤二',
              leader: '管理员',
              statu: '运行中',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
            },
            {
              id: 10723,
              process: '切换流程一',
              stage: '阶段一',
              step: '阶段一步骤三',
              leader: '管理员',
              statu: '完成',
              type: '手动',
              startTime: '2018-05-14 15:21:00',
              endTime: '2018-05-14 15:21:00',
              time: '5'
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
