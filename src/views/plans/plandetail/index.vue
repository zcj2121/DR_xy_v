<template>
  <div class="app-container" id="plandetailTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.preplanName" placeholder="请输入预案名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit>
      <el-table-column label="名称" prop="preplanName" min-width="100" sortable></el-table-column>
      <el-table-column label="版本" prop="versionNum" width="80" sortable></el-table-column>
      <el-table-column class-name="status-col" label="预案类型" width="110">
        <template slot-scope="scope">
          {{scope.row.type === 1 ? '专项预案' : '总体预案'}}
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="userName" width="100" sortable></el-table-column>
      <el-table-column label="描述" prop="preDesc" min-width="120" sortable></el-table-column>
      <el-table-column class-name="status-col" label="状态" width="75" align="center">
        <template slot-scope="scope">
          {{scope.row.preStatus | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="62">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detail(scope.row)">查看</el-button>
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
    <!--查看 弹出框-->
    <el-dialog  class="detail-dialog" title="查看预案计划详情" width="80%" :visible.sync="detailShow" :modal-append-to-body="false" @close="closeDialogDetail">
      <div class="title">{{detailForm.preplanName}}</div>
      <div class="is-scrolling-none">
        <table class="el-table__body">
          <tr>
            <td class="text-bold" style="width:100px;">版本号</td>
            <td colspan="2">{{detailForm.versionNum}}</td>
            <td class="text-bold" style="width:100px;">负责人</td>
            <td colspan="2">{{detailForm.userName}}</td>
          </tr>
          <tr>
            <td class="text-bold">预案类型</td>
            <td colspan="5">{{detailForm.type | typesFilter}}</td>
          </tr>
          <tr>
            <td class="text-bold">预案文件</td>
            <td colspan="5">
              <a class="dwon-class" :download="detailForm.fileNameList[0]" :href="downUrl+ detailForm.fileNameList[0]" v-if="detailForm.fileNameList && detailForm.fileNameList.length > 0">{{detailForm.fileNameList[0] | fileFilter}}</a>
            </td>
          </tr>
          <tr>
            <td class="text-bold">描述</td>
            <td colspan="5">{{detailForm.preDesc}}</td>
          </tr>
          <tr>
            <td class="text-bold">所属预案</td>
            <td colspan="5">{{detailForm.parentPreplanName}}</td>
          </tr>
          <tr>
            <td class="text-bold">适用场景</td>
            <td colspan="5">{{detailForm.scene}}</td>
          </tr>
          <tr style="background: #f7f7f7;">
            <td class="text-bold"></td>
            <td class="text-bold" colspan="4">预案验证执行操作</td>
            <td class="text-bold" style="width:100px;">负责人</td>
          </tr>
          <tr v-for="(item,index) in detailForm.executionList" :key="index">
            <td>{{index}}</td>
            <td colspan="4">{{item.executionName}}</td>
            <td style="width:100px;">{{item.userName}}</td>
          </tr>
        </table>
      </div>
      <div v-for="(item,index) in detailForm.childList" :key="index">
        <div class="child-title">{{item.preplanName}}</div>
        <div class="is-scrolling-none">
          <table class="el-table__body">
            <tr>
              <td class="text-bold" style="width:100px;">版本号</td>
              <td colspan="2">{{item.versionNum}}</td>
              <td class="text-bold" style="width:100px;">负责人</td>
              <td colspan="2">{{item.userName}}</td>
            </tr>
            <tr>
              <td class="text-bold">预案类型</td>
              <td colspan="5">{{item.type | typesFilter}}</td>
            </tr>
            <tr>
              <td class="text-bold">预案文件</td>
              <td colspan="5">
                <a class="dwon-class" :download="item.fileNameList[0]" :href="downUrl+ item.fileNameList[0]" v-if="item.fileNameList && item.fileNameList.length > 0">{{item.fileNameList[0] | fileFilter}}</a>
              </td>
            </tr>
            <tr>
              <td class="text-bold">描述</td>
              <td colspan="5">{{item.preDesc}}</td>
            </tr>
            <tr>
              <td class="text-bold">所属预案</td>
              <td colspan="5">{{item.parentPreplanName}}</td>
            </tr>
            <tr>
              <td class="text-bold">适用场景</td>
              <td colspan="5">{{item.scene}}</td>
            </tr>
            <tr style="background: #f7f7f7;">
              <td class="text-bold"></td>
              <td class="text-bold" colspan="4">预案验证执行操作</td>
              <td class="text-bold" style="width:100px;">负责人</td>
            </tr>
            <tr v-for="(child,childindex) in item.executionList" :key="index+'-'+childindex">
              <td>{{childindex}}</td>
              <td colspan="4">{{child.executionName}}</td>
              <td style="width:100px;">{{child.userName}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogDetail('allform')">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findPreplan, findPreplanById } from '@/api/plans/plandetail'
  import { downURL } from '@/utils/alert'
  export default {
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        detailShow: false,
        searchQuery: { // 查询数据
          preplanName: '',
          preStatus: 3
        },
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        detailForm: {
          preplanName: '',
          versionNum: '',
          userName: '',
          type: '',
          fileNameList: [],
          preDesc: '',
          parentPreplanName: '',
          scene: '',
          childList: []
        },
        downUrl: downURL + '/dr/downPreplanFile.do?fileName='
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '待提交',
          2: '待审批',
          3: '通过',
          4: '驳回',
          5: '发布',
          0: '历史'
        }
        return statusMap[status]
      },
      typesFilter(status) {
        const typesMap = {
          0: '总体预案',
          1: '专项预案'
        }
        return typesMap[status]
      },
      fileFilter(file) {
        const str_before = file.split('[')[0]
        const str_after = file.split(']')[1]
        return str_before + str_after
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
        findPreplan(this.searchQuery).then(response => {
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
      detail(val) {
        findPreplanById({ id: val.id, flag: 3 }).then(response => {
          if (response) {
            this.detailForm = Object.assign({}, response.obj)
          }
        })
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
            font-size:15px;
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
  .title{
    font-size: 15px;
    text-align: center;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .child-title{
    margin-top: 15px;
    font-size: 15px;
    text-align: center;
    margin-bottom: 5px;
    font-weight: bold;
  }
</style>
