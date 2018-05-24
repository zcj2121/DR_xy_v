<template>
  <div class="app-container" id="roleTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.tRoleName" placeholder="请输入角色名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="角色名称" prop="tRoleName" sortable></el-table-column>
      <el-table-column label="角色键值" prop="tRoleValue" sortable></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button-group v-if="scope.row.tRoleValue !== 'supermanager' && scope.row.tRoleValue !== 'query' && scope.row.tRoleValue !== 'operator' && scope.row.tRoleValue !== 'manager'">
            <el-button size="mini" type="primary" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" v-if="scope.row.enable === 1" type="primary" @click="operation({ id: scope.row.id }, '确认停用吗', '/rs/dr/system/rolemanager/enableOrNotRole')">停用</el-button>
            <el-button size="mini" v-else type="primary" @click="operation({ id: scope.row.id }, '确认启用吗', '/rs/dr/system/rolemanager/enableOrNotRole')">启用</el-button>
            <el-button size="mini" type="primary" @click="operation({ id: scope.row.id }, '确认删除吗', '/rs/dr/system/rolemanager/delete')">删除</el-button>
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
    <!--新增、编辑 弹出框-->
    <el-dialog :title="operateTitle" width="500px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose('formAll')">
      <el-form :model="form" ref="formAll" label-position="right" label-width="95px">
        <el-form-item label="角色名称：" prop="tRoleName" :rules="[
                { required: true, message: '请输入角色名称', trigger: 'blur' }
              ]">
          <el-input v-model="form.tRoleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色键值：" prop="tRoleValue" :rules="[
                { required: true, message: '请输入角色键值', trigger: 'blur' }
              ]">
          <el-input v-model="form.tRoleValue" placeholder="请输入角色键值"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="operateClose('formAll')">取 消</el-button>
        <el-button type="primary" @click="save('formAll')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { retrieve, creat, update } from '@/api/system/role'
  import { alertBox } from '@/utils/request'
  export default {
    data() {
      return {
        data: null, // 原始数据
        list: null, // 列表显示数据
        listLoading: true, // 加载动画
        pageTotal: 0, // 数据总条数
        pageSizes: [10, 15, 20], // 每页显示条数 规则
        queryPage: {
          index: 1, // 第几页
          size: 10 // 每页显示条数
        },
        searchQuery: { // 查询数据
          tRoleName: '',
          tRoleValue: ''
        },
        form: { // 新增编辑 数据
          tRoleName: '',
          tRoleValue: ''
        },
        isEdit: false, // 是否是进行编辑操作
        operateTitle: '', // 新增、编辑 弹出框 标题
        formShow: false // 是否 显示 新增、编辑 弹出框
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
        retrieve(this.searchQuery).then(response => {
          if (response) {
            this.data = response.list
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
      // 列表数据 分页 搜索
      // 删除、启用等 公共弹框
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      // 删除、启用等 公共弹框
      // 新增、修改 操作
      // 弹出框 打开
      operate(type, val) {
        if (type === 'add') {
          this.operateTitle = '新增角色信息'
          this.isEdit = false
        } else if (type === 'edit') {
          this.isEdit = true
          if (val) {
            this.form = Object.assign({}, { id: val.id, tRoleName: val.tRoleName, tRoleValue: val.tRoleValue })
          }
          this.operateTitle = '编辑角色信息'
        }
        this.formShow = true
      },
      // 弹出框 关闭
      operateClose(formName) {
        this.$refs[formName].resetFields()
        this.formShow = false
        this.form = {
          tRoleName: '',
          tRoleValue: ''
        }
      },
      // 点击保存
      save(formName) {
        if (this.isEdit === true) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              update(this.form).then(() => {
                this.fetchData()
                this.formShow = false
              })
            } else {
              return false
            }
          })
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              creat(this.form).then(() => {
                this.fetchData()
                this.formShow = false
              })
            } else {
              return false
            }
          })
        }
      }
      // 新增、修改 操作
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
