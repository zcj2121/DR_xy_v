<template>
  <div class="app-container" id="userTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal" placeholder="请输入审批流程名称">
      </el-input>
      <el-select style="width: 200px;" size="mini" v-model="process" placeholder="请选择分类">
        <el-option v-for="item in processOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
    </div>
    <el-table :data="userData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit>
      <el-table-column label="审批流程名称" prop="name" min-width="150" sortable></el-table-column>
      <el-table-column label="分类" prop="type" width="150" sortable></el-table-column>
      <el-table-column label="审批人流程" prop="process" min-width="300" sortable></el-table-column>
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
    <el-dialog :title="operateTitle" width="600px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose">
      <el-form :model="form" label-position="right" label-width="85px">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
          <div class="name-repeat" v-if="nameRepeat">名称重复</div>
        </el-form-item>
        <el-form-item label="审批类型：" prop="enabled">
          <el-select v-model="form.type" placeholder="请选择审批类型" style="width:100%;">
            <el-option v-for="item in processOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="index === 0?'审批人：':''" prop="enabled" v-for="(item, index) in form.processList" :key="index">
          <el-select v-model="item.value" placeholder="请选择审批人" style="width:86.3%;">
            <el-option v-for="item in userOptions" :key="item.value+index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-button v-if="index === 0" class="filter-item" size="mini" style="margin-left: 10px;padding:12px;" type="" @click="add()">添加</el-button>
          <el-button v-else class="filter-item" size="mini" style="margin-left: 10px;padding:12px;" type="" @click="del(index)">删除</el-button>
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
          name: '',
          type: '',
          processList: [{
            value: ''
          }]
        },
        operateTitle: '',
        formShow: false,
        nameRepeat: false,
        process: '',
        processOptions: [
          {
            label: '预案审批',
            value: '1'
          },
          {
            label: '切换流程',
            value: '2'
          },
          {
            label: '切换执行',
            value: '3'
          }
        ],
        userOptions: [
          {
            label: '张三',
            value: '1'
          },
          {
            label: '李四',
            value: '2'
          },
          {
            label: '王五',
            value: '3'
          }
        ],
        userData: {
          totalCount: 44,
          items: [
            {
              name: '审批流程名称一',
              type: '预案审批',
              process: '刘XX、王XX、【姓名2】、【姓名3】'
            },
            {
              name: '审批流程名称一',
              type: '切换流程',
              process: '刘XX、王XX、【姓名2】、【姓名3】'
            },
            {
              name: '审批流程名称一',
              type: '切换执行',
              process: '刘XX、王XX、【姓名2】、【姓名3】'
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
          this.operateTitle = '新增审批模板'
        } else if (type === 'edit') {
          this.operateTitle = '编辑审批模板'
        }
        this.formShow = true
      },
      operateClose() {
        this.formShow = false
      },
      add() {
        this.form.processList.push({
          value: ''
        })
      },
      del(index) {
        this.form.processList.splice(index, 1)
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
