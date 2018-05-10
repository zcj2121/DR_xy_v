<template>
  <div class="app-container" id="menuTable">
    <el-row>
      <el-col :span="6">
        <span class="tabel-title">目录列表</span>
        <span class="pull-right" style="margin-right: 20px;"><el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" @click="handleAddTop">添加顶级节点</el-button></span>
        <div class="menu-left">
          <div class="expand">
              <el-tree ref="expandMenuList" class="expand-tree"
                       v-if="isLoadingTree"
                       :data="setTree"
                       node-key="id"
                       highlight-current
                       :props="defaultProps"
                       :expand-on-click-node="false"
                       :render-content="renderContent"
                       :default-expanded-keys="defaultExpandKeys"
                       @node-click="handleNodeClick"></el-tree>
            </div>
        </div>
      </el-col>
      <el-col :span="18">
        <span class="tabel-title">菜单列表</span>
        <span class="pull-right"><el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit">新增</el-button></span>
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
    <!--弹出框-->
    <el-dialog title="新增组织" width="500px" :visible.sync="dialogShow"
               :modal-append-to-body="false" @close='dialogClose'>
      <el-form :model="form" label-position="right" label-width="95px">
        <el-form-item label="组织名称：" prop="facilityType">
          <el-input v-model="form.groupName" placeholder="请输入组织名称"></el-input>
        </el-form-item>
        <el-form-item label="前置节点：" prop="field">
          <el-select v-model="form.groupParent" placeholder="请选择前置节点" style="width:100%">
            <el-option v-for="item in groupOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织描述：" prop="oid">
          <el-input type="textarea" :rows="2" v-model="form.groupDesc" placeholder="请输入组织描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('form')">确 定</el-button>
        <el-button @click="reset('form')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList } from '@/api/seetable'
  import { findParentAndAboveNode, findAllGroupToTree } from '@/api/orgtable'
  import TreeRender from './tree_render'
  import api from './api'

  export default {
    name: 'tree',
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        pageTotal: 0,
        modelTitle: '',
        dialogShow: false,
        groupOptions: [],
        dataQuery: {
          groupId: 1
        },
        form: {
          groupParent: '0',
          groupDesc: '',
          groupName: ''
        },
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
        },
        isLoadingTree: false, // 是否加载节点树
        setTree: [], // 节点树数据
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultExpandKeys: [] // 默认展开节点列表
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
      this.groupTree()
    },
    mounted() {
      console.log(api)
      this.initExpand()
    },
    methods: {
      groupTree() {
        findAllGroupToTree(this.dataQuery).then(response => {
          this.setTree = response
        })
      },
      initExpand() {
        this.setTree.map((a) => {
          this.defaultExpandKeys.push(a.id)
        })
        this.isLoadingTree = true
      },
      handleNodeClick(d, n, s) { // 点击节点
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
      handleAddTop() {
        this.dialogShow = true
        findParentAndAboveNode().then(response => {
          this.groupOptions = [{
            label: '无',
            value: '0'
          }]
          if (response) {
            for (const i in response) {
              this.groupOptions.push({
                label: response[i].groupName,
                value: response[i].id
              })
            }
          }
        })
      },
      handleAdd(s, d, n) { // 增加节点
        // 展开节点
        if (!n.expanded) {
          n.expanded = true
        }
      },
      handleEdit(s, d, n) { // 编辑节点
        console.log(s, d, n)
      },
      handleDelete(s, d, n) { // 删除节点
        console.log(s, d, n)
      },
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
      },
      dialogClose() {
      },
      save() {
      },
      reset() {
      }
    }

  }
</script>
<style lang="scss">
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
