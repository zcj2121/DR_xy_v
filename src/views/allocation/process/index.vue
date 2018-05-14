<template>
  <div class="app-container" id="userTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal" placeholder="请输入名称">
      </el-input>
      <el-select style="width: 200px;" size="mini" v-model="role" placeholder="ALL权限">
        <el-option v-for="item in roleDataOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
    </div>
    <el-table :data="userData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="名称" prop="name" min-width="100" sortable></el-table-column>
      <el-table-column label="描述" prop="remark" min-width="120" sortable></el-table-column>
      <el-table-column label="负责人" prop="leader" width="100" sortable></el-table-column>
      <el-table-column label="状态" prop="statu" width="75" sortable></el-table-column>
      <el-table-column label="操作" width="212">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="info" v-if="scope.row.statu!=='驳回'">查看</el-button>
            <el-button size="mini" type="info" v-if="scope.row.statu==='驳回'">查看驳回建议</el-button>
            <el-button size="mini" type="info" v-if="scope.row.statu==='待提交'||scope.row.statu==='驳回'" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="info" v-if="scope.row.statu==='待提交'||scope.row.statu==='驳回'">提交</el-button>
            <el-button size="mini" type="info" v-if="scope.row.statu==='通过'">申请执行</el-button>
            <el-button size="mini" type="info" v-if="scope.row.statu==='待提交'||scope.row.statu==='驳回'">删除</el-button>
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
    <el-dialog :title="operateTitle" width="600px" :visible.sync="formShow" :modal-append-to-body="false" @close="operateClose">
      <el-form :model="form" label-position="right" label-width="85px">
        <el-form-item label="场景名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入场景名称"></el-input>
          <div class="name-repeat" v-if="nameRepeat">名称重复</div>
        </el-form-item>
        <el-form-item label="场景描述：" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入场景描述"></el-input>
        </el-form-item>
        <el-form-item label="场景负责人：" prop="enabled">
          <el-select v-model="form.belongs" placeholder="请选择场景负责人" style="width:100%;">
            <el-option value="" label=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批流程：" prop="enabled">
          <el-select v-model="form.belongs" placeholder="请选择审批流程" style="width:100%;">
            <el-option value="" label=""></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="operateClose('allform')">取 消</el-button>
        <el-button type="primary" @click="save('allform')">确 定</el-button>
      </div>
    </el-dialog>
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
        operateTitle: '',
        formShow: false,
        form: {
          name: '',
          leader: '',
          type: '0',
          remark: ''
        },
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        detailShow: false,
        role: '',
        roleDataOptions: [
          {
            label: '超级管理员',
            value: 'supermanager'
          },
          {
            label: '观察员',
            value: 'query'
          },
          {
            label: '操作员',
            value: 'operator'
          },
          {
            label: '管理员',
            value: 'manager'
          }
        ],
        userData: {
          totalCount: 44,
          items: [
            {
              id: 10723,
              name: '切换流程一',
              version: '2.0',
              leader: '管理员',
              statu: '待提交',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '切换流程一',
              version: '2.0',
              leader: '管理员',
              statu: '待审批',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '切换流程一',
              version: '2.0',
              leader: '管理员',
              statu: '驳回',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '切换流程一',
              version: '2.0',
              leader: '管理员',
              statu: '通过',
              type: '总体预案',
              remark: '描述描述描述'
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
      operate(type, val) {
        if (type === 'add') {
          this.operateTitle = '新增场景信息'
        } else if (type === 'edit') {
          this.operateTitle = '编辑场景信息'
        }
        this.formShow = true
      },
      operateClose() {
      },
      save() {}
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
