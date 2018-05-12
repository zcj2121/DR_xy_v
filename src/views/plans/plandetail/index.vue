<template>
  <div class="app-container" id="plandetailTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table :data="userData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit>
      <el-table-column label="名称" prop="name" min-width="100" sortable></el-table-column>
      <el-table-column label="版本" prop="version" width="80" sortable></el-table-column>
      <el-table-column label="预案类型" prop="type" width="110"sortable></el-table-column>
      <el-table-column label="负责人" prop="leader" width="100" sortable></el-table-column>
      <el-table-column label="描述" prop="remark" min-width="120" sortable></el-table-column>
      <el-table-column label="状态" prop="statu" width="75" sortable></el-table-column>
      <el-table-column label="操作" width="65">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detail">查看</el-button>
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
    <!--查看 弹出框-->
    <el-dialog  class="detail-dialog" title="查看预案计划详情" width="80%" :visible.sync="detailShow" :modal-append-to-body="false" @close="closeDialogDetail">
      <div class="title">预案名称</div>
      <div class="is-scrolling-none">
        <table class="el-table__body">
          <tr>
            <td class="text-bold" style="width:100px;">版本号</td>
            <td colspan="2">1.0</td>
            <td class="text-bold" style="width:100px;">负责人</td>
            <td colspan="2">张三</td>
          </tr>
          <tr>
            <td class="text-bold">预案类型</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr>
            <td class="text-bold">预案文件</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr>
            <td class="text-bold">描述</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr>
            <td class="text-bold">所属预案</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr>
            <td class="text-bold">适用场景</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr style="background: #f7f7f7;">
            <td class="text-bold"></td>
            <td class="text-bold" colspan="4">预案操作</td>
            <td class="text-bold" style="width:100px;">负责人</td>
          </tr>
          <tr>
            <td>1</td>
            <td colspan="4">演练环境准备阶段，XXXXXXXXXX</td>
            <td style="width:100px;">张三</td>
          </tr>
          <tr>
            <td>2</td>
            <td colspan="4">演练环境准备阶段，XXXXXXXXXX</td>
            <td style="width:100px;">李四</td>
          </tr>
        </table>
      </div>
      <div class="child-title">专项预案名称1</div>
      <div class="is-scrolling-none">
        <table class="el-table__body">
          <tr>
            <td class="text-bold" style="width:100px;">版本号</td>
            <td colspan="2">1.0</td>
            <td class="text-bold" style="width:100px;">负责人</td>
            <td colspan="2">张三</td>
          </tr>
          <tr>
            <td class="text-bold">预案类型</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr>
            <td class="text-bold">预案文件</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr>
            <td class="text-bold">描述</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr>
            <td class="text-bold">所属预案</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr>
            <td class="text-bold">适用场景</td>
            <td colspan="5">预案类型</td>
          </tr>
          <tr style="background: #f7f7f7;">
            <td class="text-bold"></td>
            <td class="text-bold" colspan="4">预案操作</td>
            <td class="text-bold" style="width:100px;">负责人</td>
          </tr>
          <tr>
            <td>1</td>
            <td colspan="4">演练环境准备阶段，XXXXXXXXXX</td>
            <td style="width:100px;">张三</td>
          </tr>
          <tr>
            <td>2</td>
            <td colspan="4">演练环境准备阶段，XXXXXXXXXX</td>
            <td style="width:100px;">李四</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogDetail('allform')">关 闭</el-button>
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
        planTitle: '',
        formShow: false,
        detailShow: false,
        nameRepeat: false,
        fileList: [],
        form: {
          name: '',
          version: '',
          leader: '',
          type: '0',
          remark: '',
          belongs: '',
          scene: ''
        },
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        role: '',
        leaderOptions: [
          {
            label: '',
            value: ''
          },
          {
            label: '张三',
            value: 'zhangsan'
          },
          {
            label: '李四',
            value: 'lisi'
          },
          {
            label: '王五',
            value: 'wangwu'
          },
          {
            label: '管理员',
            value: 'admin'
          }
        ],
        typeOptions: [
          {
            label: '总体预案',
            value: '0'
          },
          {
            label: '专项预案',
            value: '1'
          }
        ],
        belongsOptions: [
          {
            label: '总体预案一',
            value: '0'
          },
          {
            label: '专项预案二',
            value: '1'
          }
        ],
        userData: {
          totalCount: 44,
          items: [
            {
              id: 10723,
              name: '预案计划一',
              version: '2.0',
              leader: '管理员',
              statu: '待提交',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '预案计划一',
              version: '2.0',
              leader: '管理员',
              statu: '待审批',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '预案计划一',
              version: '2.0',
              leader: '管理员',
              statu: '驳回',
              type: '总体预案',
              remark: '描述描述描述'
            },
            {
              id: 10723,
              name: '预案计划一',
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
      detail() {
        this.detailShow = true
      },
      closeDialogDetail() {
        this.detailShow = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #plandetailTable{
    .el-dialog__body{
      padding: 10px 20px;
      .el-table__body-wrapper{
        height: 250px;
        overflow-y: auto;
      }
    }
    .el-upload{
      float: left;
    }
    .el-upload-list{
      float: left;
    }
    .detail-dialog{
      .el-dialog{
        margin-top: 6vh;
        .el-dialog__body{
          overflow-y: auto;
          height: 500px;
          padding: 20px 50px;
          .title{
            font-size:16px;
            text-align:center;
            margin-bottom:5px;
            font-weight: bold;
          }
          .child-title{
            font-size:15px;
            margin-top:15px;
            margin-bottom:5px;
          }
        }
      }
    }
    .error-box{

    }
  }
</style>
<style  rel="stylesheet/scss" lang="scss" scoped>
  .filter-container{
    text-align: right;
    margin-bottom: 10px;
  }
  table{
    border-collapse:collapse;
    width:100%;
    font-size: 14px;
    color:#606266;
    tr{
      td{
        border:1px solid #ebeef5;
        padding:10px 12px;
        line-height: 25px;
      }
      th{
        border:1px solid #ebeef5;
      }
    }
  }
  .text-bold{
    font-weight: bold;
  }
  .detail-dialog{
    .el-dialog{
      margin-top: 6vh;
    }
  }
  .error-box{
    overflow: hidden;
    margin-bottom: 20px;
    color: red;
    .error-box-title{
      width:100px;
      padding-right:12px;
      text-align: right;
    }
  }
</style>
