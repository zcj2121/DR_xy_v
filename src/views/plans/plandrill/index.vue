<template>
  <div class="app-container" id="plandrillTable">
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
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detail(scope.row)">演练视图</el-button>
            <el-button size="mini" type="primary" @click="operation({ id: scope.row.id }, '确认删除吗', '/rs/dr/preplanManager/deletePreplan')" v-if="scope.row.isDrill === 2">删除</el-button>
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
    <el-dialog  class="detail-dialog" title="查看演练视图" width="80%" :visible.sync="detailShow" :modal-append-to-body="false" @close="closeDialogDetail">
      <div class="title">预案演练验证</div>
      <div class="view-box-detail">
        <el-row class="panel-group" :gutter="20" v-if="detailForm.length > 0">
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col" v-for="(item, index) in detailForm" :key="index">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper" :class="item.state === 1 ? 'icon-ok' : 'icon-no'">
                {{item.state === 1 ? '已完成' : '待完成'}}
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span :title="item.executionName">{{item.executionName}}</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span :title="item.userName">{{item.userName}}</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span :title="item.telPhone">{{item.telPhone}}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="log-box" v-if="thisNoStart.userName&&detailForm.length>0">
          <div class="log-box-title">演练日志</div>
          <div class="msg-box">
            <div><span>消息通知：</span><span><span style="font-weight: bold;">{{thisNoStart.userName}}</span>，您好，请您尽快登陆灾备系统完成【配置的预案流程内容】，登录地址：<a @click="goLoginAudit">http://vbs.login.com</a></span></div>
          </div>
        </div>
        <div class="no-detail-show" v-if="detailForm.length === 0">暂无数据</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogDetail('allform')">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findPreplan, findAllExecutionByPreplanId } from '@/api/plans/plandrill'
  import { alertBox } from '@/utils/request'
  export default {
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        detailShow: false,
        searchQuery: { // 查询数据
          preplanName: '',
          isDrill: 1
        },
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        detailForm: [],
        thisId: '',
        thisNoStart: {
          userName: ''
        }
      }
    },
    filters: {
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
      // 删除等 公共弹框
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      detail(val) {
        this.thisId = val.id
        findAllExecutionByPreplanId({ id: val.id }).then(response => {
          if (response) {
            this.detailForm = Object.assign([], response.list)
            for (const i in response.list) {
              if (response.list[i].state !== 1) {
                this.thisNoStart = response.list[i]
                return
              }
            }
          }
        })
        this.detailShow = true
      },
      closeDialogDetail() {
        this.thisNoStart = {
          userName: ''
        }
        this.detailShow = false
      },
      goLoginAudit() {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login', query: { auditId: this.thisId }})
        })
        this.$router.push({ path: '/login', query: { auditId: this.thisId }})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #plandrillTable{
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
          background: #fbfbfb;
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
  .view-box-detail{
    .panel-group {
      margin-top: 18px;
      .card-panel-col{
        margin-bottom: 32px;
      }
      .card-panel {
        padding:14px;
        height: 101px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
        border-color: rgba(0, 0, 0, .05);
        .card-panel-icon-wrapper {
          writing-mode:lr-tb;
          color: #fff;
        }
        .icon-ok {
          background: #40c9c6;
        }
        .icon-no {
          background: #E6A23C;
        }
        .card-panel-icon-wrapper {
          width: 33px;
          padding: 8px;
          border-radius: 2px;
          line-height: 19px;
          font-size: 16px;
        }
        .card-panel-description {
          position: absolute;
          left:44px;
          top: 12px;
          right: 14px;
          font-weight: bold;
          padding-left: 14px;
          font-size: 14px;
          line-height: 26px;
          .card-row-over{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .log-box{
    .log-box-title{
      margin-bottom: 5px;
      font-size:14px;
      font-weight: bold;
    }
    .msg-box{
      background: #fff;
      -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);
      background-color: white;
      width: 100%;
      padding:5px 10px;
      div{
        line-height: 25px;
        a{
          color:#09c;
        }
        a:hover{
          color:#c90;
        }
      }
    }
  }
  .no-detail-show{
    text-align: center;
    line-height: 150px;
    font-size: 16px;
    color: #aaa;
  }
</style>
