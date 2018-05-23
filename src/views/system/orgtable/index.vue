<template>
  <div class="app-container" id="orgtableTable">
    <el-row>
      <el-col :span="6">
        <span class="tabel-title">组织列表</span>
        <span class="pull-right" style="margin-right: 20px;"><el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" @click="handleAddTop">添加顶级组织</el-button></span>
        <div class="menu-left">
          <div class="expand">
              <el-tree ref="expandMenuList" class="expand-tree"
                       v-if="isLoadingTree"
                       :data="setTree"
                       node-key="id"
                       highlight-current
                       :props="defaultProps"
                       default-expand-all
                       :expand-on-click-node="false"
                       :render-content="renderContent"
                       :default-expanded-keys="defaultExpandKeys"
                       @node-click="handleNodeClick"></el-tree>
            </div>
        </div>
      </el-col>
      <el-col :span="18">
        <span class="tabel-title">成员列表</span>
        <span class="pull-right">
          <el-input style="width: 200px;" size="mini" class="filter-item" v-model="listQuery.displayName" placeholder="请输入成员姓名">
          </el-input>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
        </span>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column label="成员姓名" prop="displayName" :show-overflow-tooltip="true" sortable></el-table-column>
          <el-table-column label="手机号码" prop="telphone" :show-overflow-tooltip="true" sortable></el-table-column>
          <el-table-column label="电子邮箱" prop="email" :show-overflow-tooltip="true" sortable></el-table-column>
          <el-table-column label="部门" prop="department" :show-overflow-tooltip="true" sortable></el-table-column>
          <el-table-column label="职务" prop="personPost" :show-overflow-tooltip="true" sortable></el-table-column>
          <el-table-column label="职责" prop="personDuty" :show-overflow-tooltip="true" sortable></el-table-column>
          <el-table-column label="操作" width="101">
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" type="primary" @click="operate('edit',scope.row)">编辑</el-button>
                <el-button size="mini" type="primary" @click="operation({ id: scope.row.id }, '确认删除吗', '/rs/dr/groupUserManager/deletePersonById')">删除</el-button>
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
      </el-col>
    </el-row>

    <!--弹出框-->
    <el-dialog title="新增组织" width="500px" :visible.sync="orgShow"
               :modal-append-to-body="false" @close='closeOrg("orgform")'>
      <el-form :model="orgForm" ref="orgform" label-position="right" label-width="95px">
        <el-form-item label="组织名称：" prop="facilityType">
          <el-input v-model="orgForm.groupName" placeholder="请输入组织名称"></el-input>
        </el-form-item>
        <el-form-item label="组织描述：" prop="oid">
          <el-input v-model="orgForm.groupDesc" placeholder="请输入组织描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOrg('orgform')">取 消</el-button>
        <el-button type="primary" @click="saveOrg('orgform')">确 定</el-button>

      </div>
    </el-dialog>
    <!--弹出框-->
    <el-dialog :title="operateTitle" width="500px" :visible.sync="operateShow"
               :modal-append-to-body="false" @close='closeOperate("form")'>
      <el-form :model="form" ref="form" label-position="right" label-width="95px">
        <el-form-item label="组织名称：" prop="facilityType">
          <el-select v-model="form.groupId" placeholder="请选择组织名称" style="width:100%;">
            <el-option v-for="(item, index) in groupIdOptions" :value="item.id" :label="item.groupName" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="成员姓名：" prop="facilityType">
          <el-autocomplete
            v-model="autocomplete"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect" style="width: 100%" :disabled="isFormEdit"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="职务：" prop="facilityType">
          <el-select v-model="form.personPost" placeholder="请选择职务" style="width:100%;">
            <el-option value="组长" label="组长"></el-option>
            <el-option value="副组长" label="副组长"></el-option>
            <el-option value="成员" label="成员"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="isFormEdit">
          <el-form-item label="手机号码：" prop="oid">
            <el-input v-model="form.telphone" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="oid">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="部门：" prop="oid">
            <el-input v-model="form.department" placeholder="请输入部门"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="职责：" prop="oid">
          <el-input type="textarea" :rows="2" v-model="form.personDuty" placeholder="请输入职责"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOperate('form')">取 消</el-button>
        <el-button type="primary" @click="saveOperate('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { orgtableList, findAllGroupToTree, saveOrUpdateGroup, deleteGroupById, findAllUserInRoleEnable, findAllGroup, saveOrUpdatePerson } from '@/api/system/orgtable'
  import { alertBox } from '@/utils/alert'
  import TreeRender from './tree_render'

  export default {
    name: 'tree',
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        pageTotal: 0,
        // 成员列表 查询数据
        listQuery: {
          displayName: '',
          groupId: ''
        },
        orgForm: {
          groupParent: '0',
          id: '',
          groupDesc: '',
          groupName: ''
        },
        modelTitle: '',
        orgShow: false,
        isAdd: '',
        isFormEdit: false,
        isChecked: '',
        groupIdOptions: [],
        userIdOptions: [],
        autocomplete: '',
        timeout: null,
        operateTitle: '',
        operateShow: false,
        form: {
          groupId: '',
          userId: '',
          personPost: '',
          personDuty: '',
          id: '',
          displayName: ''
        },
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        detailShow: false,
        radio3: 4,
        isLoadingTree: false, // 是否加载节点树
        setTree: [], // 节点树数据
        defaultProps: {
          id: 'id',
          children: 'child',
          label: 'groupName'
        },
        defaultExpandKeys: [] // 默认展开节点列表
      }
    },
    watch: {
      // 监听 搜索条件
      'isChecked': {
        handler(isChecked) {
          if (isChecked) {
            this.fetchData()
          }
        },
        deep: true
      },
      listQuery: {
        handler(listQuery) {
          this.search()
          this.queryPage.index = 1
        },
        deep: true
      }
    },
    created() {
      this.groupTree()
    },
    mounted() {
      this.initExpand()
    },
    methods: {
      groupTree() {
        findAllGroupToTree().then(response => {
          if (response) {
            this.setTree = response.list
            this.isChecked = response.list[0].id
          }
        })
      },
      initExpand() {
        this.setTree.map((a) => {
          this.defaultExpandKeys.push(a.id)
        })
        this.isLoadingTree = true
      },
      handleNodeClick(d, n, s) { // 点击节点
        this.isChecked = d.id
      },
      renderContent(h, { node, data, store }) { // 加载节点
        const that = this
        return h(TreeRender, {
          props: {
            DATA: data,
            NODE: node,
            STORE: store
          },
          on: {
            nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
            nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
            nodeDel: (s, d, n) => that.handleDelete(s, d, n)
          }
        })
      },
      handleAddTop() { // 增加顶级节点
        this.orgShow = true
      },
      closeOrg() { // 关闭
        this.orgShow = false
        this.orgForm = {
          groupParent: '0',
          id: '',
          groupDesc: '',
          groupName: ''
        }
      },
      handleAdd(s, d, n) { // 增加节点
        this.orgShow = true
        this.orgForm.groupParent = d.id
        this.modelTitle = '新增组织'
        this.isAdd = 'add'
        // 展开节点
        if (!n.expanded) {
          n.expanded = true
        }
      },
      handleEdit(s, d, n) { // 编辑节点
        this.orgShow = true
        this.modelTitle = '编辑组织'
        this.isAdd = 'eidt'
        this.orgForm = Object.assign({}, { id: d.id, groupParent: d.groupParent, groupDesc: d.groupDesc, groupName: d.groupName })
      },
      handleDelete(s, d, n) { // 删除节点
        this.$confirm('是否删除此组织？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGroupById({ groupId: d.id }).then(response => {
            this.groupTree()
          }).catch(() => {
          })
        }).catch(() => {
          return false
        })
      },
      saveOrg() { // 保存
        saveOrUpdateGroup(this.orgForm).then(response => {
          this.groupTree()
          this.orgShow = false
        }).catch(() => {
        })
      },
      fetchData() {
        this.queryPage.index = 1
        this.listLoading = true
        this.listQuery.groupId = this.isChecked
        this.data = []
        orgtableList(this.listQuery).then(response => {
          if (response) {
            this.data = response.groupUserDtoList
            this.pageTotal = response.groupUserDtoList.length
            this.listData()
            this.listLoading = false
          }
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
        // if (this.list.length === 0 && this.queryPage.index > 1) {
        //   this.list = this.data.slice(size * (index - 2), size * index)
        // }
      },
      search() {
        this.fetchData()
      },
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      operate(type, row) {
        this.groupIdOptions = []
        findAllGroup().then(response => {
          if (response) {
            this.groupIdOptions = response.list
            this.form.groupId = this.isChecked
          }
        })
        findAllUserInRoleEnable().then(response => {
          if (response) {
            const deffindall = Object.assign({}, response.list)
            const arr = []
            for (const i in deffindall) {
              arr.push({
                value: deffindall[i].displayName,
                id: deffindall[i].id
              })
            }
            this.userIdOptions = arr
            console.log(this.userIdOptions)
          }
        })
        if (type === 'add') {
          this.isFormEdit = false
          this.autocomplete = ''
          this.operateTitle = '新增成员信息'
        } else if (type === 'edit') {
          this.isFormEdit = true
          this.form = Object.assign({}, row)
          this.autocomplete = row.displayName
          this.operateTitle = '编辑成员信息'
        }
        this.operateShow = true
      },
      closeOperate() {
        this.operateShow = false
        this.form = {
          groupId: '',
          userId: '',
          personPost: '',
          personDuty: '',
          id: '',
          displayName: ''
        }
      },
      saveOperate() {
        saveOrUpdatePerson(this.form).then(response => {
          this.groupTree()
          this.fetchData()
          this.operateShow = false
        }).catch(() => {
        })
      },
      querySearchAsync(queryString, cb) {
        var userIdOptions = this.userIdOptions
        var results = queryString ? userIdOptions.filter(this.createStateFilter(queryString)) : userIdOptions
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 1000 * Math.random())
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        this.form.userId = item.id
        this.form.displayName = item.value
      }
    }
  }
</script>
<style lang="scss">
  #orgtableTable{
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
<style  rel="stylesheet/css">
  .expand {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .expand > div {
    height: 85%;
    width: 100%;
    overflow-y: auto;
  }

  .expand > div::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    border-radius: 5px;
  }

  .expand > div::-webkit-scrollbar-thumb {
    background-color: rgba(50, 65, 87, 0.5);
    outline: 1px solid slategrey;
    border-radius: 5px;
  }

  .expand > div::-webkit-scrollbar {
    width: 10px;
  }

  .expand-tree {
    border: 1px solid #ebeef5;
    padding-top:10px;
    padding-bottom: 10px;
  }

  .expand-tree .el-tree-node.is-current,
  .expand-tree .el-tree-node:hover {
    overflow: hidden;
  }

  .expand-tree .is-current > .el-tree-node__content .tree-btn,
  .expand-tree .el-tree-node__content:hover .tree-btn {
    display: inline-block;
  }

  .expand-tree .is-current > .el-tree-node__content .tree-label {
    font-weight: 600;
    white-space: normal;
  }

  .tree-label span{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 100px;
  }
  .tabel-title {
    font-size: 20px;
    margin-bottom: 10px;
    display: inline-block;
    line-height: 25px;
  }

</style>
