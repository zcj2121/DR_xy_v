<template>
  <div class="app-container">
    <div id="nowDetail">
      <span class="tabel-title">{{parentData.name}}步骤列表</span>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="序号" prop="id" sortable width="65" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="步骤类型" prop="name" sortable width="90" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="内容" prop="state" sortable min-width="180" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="动作" prop="describe" sortable width="90" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="描述" prop="describe" min-width="180" :show-overflow-tooltip=true></el-table-column>
        <el-table-column label="计划时间" prop="time" sortable width="152" :show-overflow-tooltip=true></el-table-column>
        <el-table-column class-name="status-col" label="状态" sortable width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state | statusFilter">{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="204">
          <template slot-scope="scope">
            <el-button-group>
              <!--<el-button type="info" @click="operation(scope.row.id,1)">暂停</el-button>-->
              <!--<el-button type="info" @click="operation(scope.row.id,2)">继续</el-button>-->
              <el-button type="info" size="mini" @click="operation(scope.row.id,3)">重试</el-button>
              <el-button type="info" size="mini" @click="operation(scope.row.id,4)">跳过</el-button>
              <el-button type="info" size="mini" @click="operation(scope.row.id,5)">一键退回</el-button>
              <el-button type="info" size="mini" @click="operation(scope.row.id,6)">停止</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { getListDetail } from '@/api/recoverytable'
  import { alertBox } from '@/utils/alert'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        parentData: null
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          '在线': 'success',
          '健康': 'gray',
          '离线': 'danger',
          'failover': 'warning'
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData()
      this.parentData = this.$route.query
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getListDetail(this.parentData).then(response => {
          this.list = response.data.items
          this.listLoading = false
        })
      },
      operation(val, type) {
        let url, msg
        switch (type) {
          case 1:
            url = '123' // 暂停
            msg = '确认暂停该步骤吗'
            break
          case 2:
            url = '123' // 继续
            msg = '确认继续该步骤吗'
            break
          case 3:
            url = '123' // 重试
            msg = '确认重试该步骤吗'
            break
          case 4:
            url = '123' // 跳过
            msg = '确认跳过该步骤吗'
            break
          case 5:
            url = '123' // 一键退回
            msg = '确认退回该步骤吗'
            break
          case 6:
            url = '123' // 停止
            msg = '确认停止该步骤吗'
            break
        }
        alertBox(this, msg, url, val)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #nowDetail{
    .el-table {
      .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-button-group{
      .el-button{
        padding: 7px 7px;
      }
    }
  }
</style>
<style  rel="stylesheet/scss" lang="scss" scoped>
  #nowDetail{
    .el-table {
      .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-button-group{
      .el-button{
        padding: 7px 7px;
      }
    }
  }
</style>
