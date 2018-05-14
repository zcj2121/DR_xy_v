<template>
  <div class="app-container" id="stageTable">
    <div class="filter-container">
      <el-select style="width: 200px;" size="mini" v-model="name" placeholder="请选择切换流程名称">
        <el-option v-for="item in nameOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="operate('add')">新增
      </el-button>
    </div>
    <el-table :data="Data.items" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column label="切换阶段名称" prop="name" sortable></el-table-column>
      <el-table-column label="阶段负责人" prop="leader" sortable width="120"></el-table-column>
      <el-table-column label="操作" width="100">
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
    <el-dialog :title="operateTitle" width="600px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose">
      <el-form :model="form" label-position="right" label-width="120px">
        <el-form-item label="切换阶段名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入切换阶段名称"></el-input>
          <div class="name-repeat" v-if="nameRepeat">名称重复</div>
        </el-form-item>
        <el-form-item label="场景负责人：" prop="enabled">
          <el-select v-model="form.leader" placeholder="请选择场景负责人" style="width:100%;">
            <el-option value="" label=""></el-option>
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
        operateTitle: '',
        formShow: false,
        form: {
          name: '',
          leader: ''
        },
        nameRepeat: false,
        name: '1',
        nameOptions: [
          {
            label: '切换流程名称1',
            value: '1'
          },
          {
            label: '切换流程名称2',
            value: '2'
          },
          {
            label: '切换流程名称3',
            value: '3'
          }
        ],
        Data: {
          totalCount: 44,
          items: [
            {
              id: 10723,
              name: '切换阶段一',
              leader: '张三'
            },
            {
              id: 10723,
              name: '切换阶段一',
              leader: '张三'
            },
            {
              id: 10723,
              name: '切换阶段一',
              leader: '张三'
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
          this.operateTitle = '新增切换阶段信息'
        } else if (type === 'edit') {
          this.operateTitle = '编辑切换阶段信息'
        }
        this.formShow = true
      },
      operateClose() {
        this.formShow = false
      },
      save() {
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #stageTable {
    .el-dialog__body {
      padding: 10px 20px;
      .el-table__body-wrapper {
        height: 250px;
        overflow-y: auto;
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .filter-container {
    text-align: right;
    margin-bottom: 10px;
  }
</style>
