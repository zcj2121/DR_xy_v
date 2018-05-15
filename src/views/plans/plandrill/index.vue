<template>
  <div class="app-container" id="plandrillTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal" placeholder="请输入预案名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table :data="userData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit>
      <el-table-column label="名称" prop="name" min-width="100" sortable></el-table-column>
      <el-table-column label="版本" prop="version" width="80" sortable></el-table-column>
      <el-table-column label="预案类型" prop="type" width="110"sortable></el-table-column>
      <el-table-column label="负责人" prop="leader" width="100" sortable></el-table-column>
      <el-table-column label="描述" prop="remark" min-width="120" sortable></el-table-column>
      <el-table-column label="操作" width="85">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="detail">演练视图</el-button>
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
    <el-dialog  class="detail-dialog" title="查看演练视图" width="80%" :visible.sync="detailShow" :modal-append-to-body="false" @close="closeDialogDetail">
      <div class="title">预案演练验证</div>
      <div class="view-box-detail">
        <el-row class="panel-group" :gutter="20">
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-ok">
                已完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-ok">
                已完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="6" class="card-panel-col">
            <div class='card-panel'>
              <div class="card-panel-icon-wrapper icon-no">
                待完成
              </div>
              <div class="card-panel-description">
                <div class="card-row-over">
                  <span>预案操作：</span>
                  <span title="演练流程XXXXXX">演练流程XXXXXX</span>
                </div>
                <div class="card-row-over">
                  <span>负&nbsp;责&nbsp;人：</span>
                  <span title="李四">李四</span>
                </div>
                <div class="card-row-over">
                  <span>联系电话：</span>
                  <span title="157111111">157111111</span>
                </div>
              </div>
            </div>
          </el-col>

        </el-row>
        <div class="log-box">
          <div class="log-box-title">演练日志</div>
          <div class="msg-box">
            <div><span>消息通知：</span><span>李XX，您好，请您尽快登陆灾备系统完成【配置的预案流程内容】，登录地址：<a @click="goLoginAudit">http://XXXXXX.com/login</a></span></div>
            <div><span>消息通知：</span><span>李XX，您好，请您尽快登陆灾备系统完成【配置的预案流程内容】，登录地址：<a href="">http://XXXXXX.com/login</a></span></div>
            <div><span>消息通知：</span><span>李XX，您好，请您尽快登陆灾备系统完成【配置的预案流程内容】，登录地址：<a href="">http://XXXXXX.com/login</a></span></div>
            <div><span>消息通知：</span><span>李XX，您好，请您尽快登陆灾备系统完成【配置的预案流程内容】，登录地址：<a href="">http://XXXXXX.com/login</a></span></div>
            <div><span>消息通知：</span><span>李XX，您好，请您尽快登陆灾备系统完成【配置的预案流程内容】，登录地址：<a href="">http://XXXXXX.com/login</a></span></div>
            <div><span>消息通知：</span><span>李XX，您好，请您尽快登陆灾备系统完成【配置的预案流程内容】，登录地址：<a href="">http://XXXXXX.com/login</a></span></div>
          </div>
        </div>
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
      },
      goLoginAudit() {
        this.$router.push({ path: '/loginaudit' })
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
</style>
