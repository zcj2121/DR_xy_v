<template>
  <div class="app-container" id="stepTable">
    <div class="filter-container">
      <el-select style="width: 200px;" size="mini" v-model="defSearchQuery.process" placeholder="请选择切换流程">
        <el-option v-for="item in processOptions" :key="item.id" :label="item.process_name"
                   :value="item.id"></el-option>
      </el-select>
      <el-select style="width: 200px;" size="mini" v-model="defSearchQuery.stage" placeholder="请选择切换阶段">
        <el-option v-for="item in stageOptions" :key="item.id" v-if='defSearchQuery.process === item.processidLong' :label="item.nameString"
                   :value="item.id"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="operate('add')">新增
      </el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column label="切换步骤名称" prop="stepNameString" sortable></el-table-column>
      <el-table-column class-name="status-col" label="分类" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.stepTypeInteger | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="灾难恢复计划" prop="recoveryPlanName" sortable></el-table-column>
      <el-table-column label="阶段负责人" prop="userName" sortable width="120"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="operation({ id: scope.row.id }, '确认删除吗', '/rs/dr/drmSwitchingStep/delete')">删除</el-button>
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
    <el-dialog :title="operateTitle" width="600px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose">
      <el-form :model="form" label-position="right" label-width="110px">
        <el-form-item label="切换步骤内容：" prop="name">
          <el-input v-model="form.stepNameString" placeholder="请输入切换步骤内容"></el-input>
        </el-form-item>
        <el-form-item label="切换步骤分类：" prop="enabled">
          <el-select v-model="form.stepTypeInteger" placeholder="请选择切换步骤分类" style="width:100%;">
            <el-option value="1" label="手动"></el-option>
            <el-option value="0" label="自动"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="灾难恢复计划：" prop="enabled" v-if="form.stepTypeInteger === '0'">
          <el-select v-model="form.recoveryPlanId" placeholder="请选择灾难恢复计划" style="width:100%;">
            <el-option v-for="item in recoveryPlanIdOptions" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上一步骤：" prop="enabled">
          <el-select v-model="form.sortIdInteger" placeholder="请选择场上一步骤" style="width:100%;">
            <el-option v-for="item in sortIdIntegerOptions" :key="item.id" :label="item.stepNameString"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人：" prop="enabled">
          <el-select v-model="form.userId" placeholder="请选择负责人" style="width:100%;">
            <el-option v-for="item in userIdOptions" :key="item.id" :label="item.displayName"
                       :value="item.id"></el-option>
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
  import { getallStep, disaster, findAllUser, superStep, insert, update } from '@/api/allocation/step'
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
        searchQuery: { // 查询数据
          stepName: ''
        },
        defSearchQuery: {
          process: '',
          stage: ''
        },
        processOptions: [],
        stageOptions: [],
        recoveryPlanIdOptions: [],
        sortIdIntegerOptions: [],
        userIdOptions: [],
        operateTitle: '',
        formShow: false,
        isEdit: false, // 是否是进行编辑操作
        form: {
          stepNameString: '', // 步骤名
          stepTypeInteger: '1', // 步骤类型
          recoveryPlanId: '', // 灾备恢复id
          sortIdInteger: '', // 上级步骤id
          stageId: '', // 阶段id
          userId: '' // 负责人id
        },
        stepData: [],
        stageData: [],
        defData: []
      }
    },
    watch: {
      // 监听 查询条件
      defSearchQuery: {
        handler(defSearchQuery) {
          this.isShowData(defSearchQuery)
        },
        deep: true
      },
      'defSearchQuery.process': {
        handler(process) {
          for (const i in this.stageOptions) {
            if (this.defSearchQuery.process === this.stageOptions[i].processidLong) {
              this.defSearchQuery.stage = this.stageOptions[i].id
              return
            } else {
              this.defSearchQuery.stage = ''
            }
          }
        },
        deep: true
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '自动',
          1: '手动'
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
        getallStep(this.searchQuery).then(response => {
          if (response) {
            this.stepData = []
            const stageData = []
            const defData = Object.assign([], response.data)
            for (const i in defData) {
              const stageDefData = defData[i].drmSwitchingStageDtos
              for (const j in stageDefData) {
                stageData.push(stageDefData[j])
                const stepDefDate = stageDefData[j].map.drmSwitchingStepDtos
                for (const k in stepDefDate) {
                  this.stepData.push(stepDefDate[k])
                }
              }
            }
            this.processOptions = defData
            this.stageOptions = stageData
            this.defSearchQuery = {
              process: this.processOptions[0].id,
              stage: this.stageOptions[0].id
            }
          }
          this.listLoading = false
        })
      },
      isShowData(defSearchQuery) {
        if (defSearchQuery.process && defSearchQuery.stage) {
          this.data = []
          for (const j in this.stepData) {
            if (defSearchQuery.stage === this.stepData[j].stageId) {
              this.data.push(this.stepData[j])
            }
          }
        } else {
          this.data = []
        }
        this.listData()
        this.pageTotal = this.data.length
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
      search() {
        this.fetchData()
      },
      // 删除、启用等 公共弹框
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      // 删除、启用等 公共弹框
      // 新增、修改 操作
      // 弹出框 打开
      operate(type, val) {
        this.recoveryPlanIdOptions = []
        this.sortIdIntegerOptions = []
        this.userIdOptions = []
        disaster({ url: '/vom/api/query/hadr/recoveryplan/' }).then(response => {
          if (response) {
            this.recoveryPlanIdOptions = Object.assign([], response.data)
          }
        })
        superStep().then(response => {
          if (response) {
            this.sortIdIntegerOptions = Object.assign([], response.data)
          }
        })
        findAllUser().then(response => {
          if (response) {
            this.userIdOptions = Object.assign([], response.userList)
          }
        })
        if (type === 'add') {
          this.operateTitle = '新增切换步骤信息'
          this.form.stageId = this.defSearchQuery.stage
          this.isEdit = false
        } else if (type === 'edit') {
          this.isEdit = true
          if (val) {
            this.form = Object.assign({}, {
              id: val.id,
              stepNameString: val.stepNameString, // 步骤名
              stepTypeInteger: (val.stepTypeInteger).toString(), // 步骤类型
              recoveryPlanId: val.recoveryPlanId, // 灾备恢复id
              sortIdInteger: val.sortIdInteger, // 上级步骤id
              stageId: val.stageId, // 阶段id
              userId: val.userId // 负责人id
            })
          }
          this.operateTitle = '编辑切换步骤信息'
        }
        this.formShow = true
      },
      // 弹出框 关闭
      operateClose() {
        this.formShow = false
        this.form = {
          stepNameString: '', // 步骤名
          stepTypeInteger: '1', // 步骤类型
          recoveryPlanId: '', // 灾备恢复id
          sortIdInteger: '', // 上级步骤id
          stageId: this.defSearchQuery.stage, // 阶段id
          userId: '' // 负责人id
        }
      },
      // 点击保存
      save() {
        if (this.isEdit === true) {
          update(this.form).then(() => {
            this.fetchData()
            this.formShow = false
          })
        } else {
          insert(this.form).then(() => {
            this.fetchData()
            this.formShow = false
          })
        }
      }
      // 新增、修改 操作
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #stepTable {
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
