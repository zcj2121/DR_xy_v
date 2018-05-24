<template>
  <div class="app-container" id="planTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="searchQuery.preplanName" placeholder="请输入预案名称">
      </el-input>
      <el-select style="width: 200px;" size="mini" v-model="searchQuery.preStatus" placeholder="请选择状态">
        <el-option key="" label="全部状态" value=""></el-option>
        <el-option key="1" label="待提交" value="1"></el-option>
        <el-option key="2" label="待审批" value="2"></el-option>
        <el-option key="3" label="通过" value="3"></el-option>
        <el-option key="4" label="驳回" value="4"></el-option>
        <el-option key="5" label="发布" value="5"></el-option>
        <el-option key="0" label="历史" value="0"></el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="operate('add')">新增</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit>
      <el-table-column label="名称" :show-overflow-tooltip="true" prop="preplanName" min-width="100" sortable></el-table-column>
      <el-table-column label="版本" prop="versionNum" width="80" sortable></el-table-column>
      <el-table-column class-name="status-col" label="预案类型" width="110">
        <template slot-scope="scope">
          {{scope.row.type === 1 ? '专项预案' : '总体预案'}}
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="userName" width="100" sortable></el-table-column>
      <el-table-column label="描述" :show-overflow-tooltip="true" prop="preDesc" min-width="120" sortable></el-table-column>
      <el-table-column class-name="status-col" label="状态" width="75" align="center">
        <template slot-scope="scope">
          {{scope.row.preStatus | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="272">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="setshow('detail',scope.row)" v-if="scope.row.preStatus!==4">查看</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===1" @click="operate('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===4" @click="operate('back',scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===1" @click="setshow('cfg',scope.row)">配置流程</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===1||scope.row.preStatus===4" @click="operationOther({ id: scope.row.id, preStatus: 2 }, '确认提交审核吗')">提交审核</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===1||scope.row.preStatus===4" @click="operation({ id: scope.row.id }, '确认删除吗', '/rs/dr/preplanManager/deletePreplan')">删除</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===3" @click="operationOther({ id: scope.row.id, preStatus: 5 }, '确认发布吗')">发布</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===3" @click="operationOther({ id: scope.row.id, preStatus: 0 }, '确认标记为历史吗')">标记为历史</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===5" @click="operation({ id: scope.row.id }, '确认演练吗', '/rs/dr/preplanManager/startPreplanDrill')">演练</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.preStatus===5" @click="operationOther({ id: scope.row.id, preStatus: 3 }, '确认撤回吗')">撤回</el-button>
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
    <!--新增、编辑、驳回编辑 弹出框-->
    <el-dialog :title="planTitle" width="800px" :visible.sync="formShow" :modal-append-to-body="false" @close="closeDialog('formAll')">
      <el-form :model="form" ref="formAll" label-position="right" label-width="100px">
        <div class="error-box" v-if="isType === 'back'">
          <div class="pull-left error-box-title">驳回原因：</div>
          <div class="pull-left">{{form.rejectAdvice}}</div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预案名称：" prop="preplanName" :rules="[
                { required: true, message: '请输入预案名称', trigger: 'blur' }
              ]">
              <el-input v-model="form.preplanName" placeholder="请输入预案名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号：" prop="versionNum" :rules="[
                { required: true, message: '请输入版本号', trigger: 'blur' }
              ]">
              <el-input v-model="form.versionNum" placeholder="请输入版本号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人：" prop="userId" :rules="[
                { required: true, message: '请选择负责人', trigger: 'change' }
              ]">
              <el-select v-model="form.userId" placeholder="请选择负责人" style="width:100%;">
                <el-option v-for="(item,index) in useridOptions" :key="index+'*'" :value="item.id"
                           :label="item.displayName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预案类型：" prop="type" :rules="[
                { required: true, message: '请选择预案类型', trigger: 'change' }
              ]">
              <el-select v-model="form.type" placeholder="请选择预案类型" style="width:100%;" @change="typeChange">
                <el-option key="0" label="总体预案" value='0'></el-option>
                <el-option key="1" label="专项预案" value='1'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="12">
          <el-form-item label="预案文件：" prop="enabled">
            <el-upload
              class="upload-demo"
              ref="upload"
              action=""
              :before-upload="beforeUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
              :on-success="uploadSuccess">
              <el-button slot="trigger" size="small" type="primary" @click="addfiles">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            </el-upload>
            <div class="dwon-class" v-if="fileNameShow"><a :href="downUrl + fileNameDown" :download="fileNameShow">{{fileNameShow | fileFilter}}</a></div>
          </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="描述：" prop="remark">
          <el-input type="textarea" v-model="form.preDesc" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属预案：" prop="enabled">
              <el-select v-model="form.preplanPid" placeholder="请选择所属预案" style="width:100%;" :disabled="form.type === '0'">
                <el-option v-for="(item,index) in PreplanCanUseParentOptions" :key="index" :value="item.id"
                           :label="item.preplanName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批流程：" prop="approveTemplateId" :rules="[
                { required: true, message: '请选择审批流程', trigger: 'change' }
              ]">
              <el-select v-model="form.approveTemplateId" placeholder="请选择审批流程" style="width:100%;">
                <el-option v-for="(item,index) in PreplanApproveTemplateOptions" :key="index" :value="item.id"
                           :label="item.approveName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="适用场景：" prop="scene">
          <el-input v-model="form.scene" placeholder="请输入适用场景"></el-input>
        </el-form-item>
      </el-form>
      <div class="child-title pull-left" v-if="isType === 'back'"><el-button size="mini" type="primary" @click="addSet">创建预案验证执行操作</el-button></div>
      <div class="is-scrolling-none" v-if="isType === 'back'">
        <table class="el-table__body">
          <tr>
            <td class="text-bold" style="width:100px;">编号</td>
            <td class="text-bold">预案验证执行操作</td>
            <td class="text-bold" style="width:155px;">负责人</td>
            <td class="text-bold" style="width:65px;">操作</td>
          </tr>
          <tr v-for="(item, index) in executionList" :key="index">
            <td>{{index+1}}</td>
            <td>
              <el-input v-model="item.executionName" placeholder="请输入预案操作内容"></el-input>
            </td>
            <td>
              <el-select v-model="item.userId" placeholder="请选择负责人" style="width:100%;">
                <el-option v-for="(userOption, child) in useridOptions" :key="userOption.id+'+'+index" :value="userOption.id"
                           :label="userOption.displayName"></el-option>
              </el-select>
            </td>
            <td><el-button size="mini" type="primary" @click="delSet(index)">删除</el-button></td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('formAll')">取 消</el-button>
        <el-button type="primary" @click="save('formAll')">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看、配置预案流程 弹出框-->
    <el-dialog  class="detail-dialog" :title="setTitle" width="80%" :visible.sync="setShow" :modal-append-to-body="false" @close="closeDialogSet">
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
          <tr style="background: #f7f7f7;" v-if="isType === 'detail'">
            <td class="text-bold"></td>
            <td class="text-bold" colspan="4">预案验证执行操作</td>
            <td class="text-bold" style="width:100px;">负责人</td>
          </tr>
          <tr v-if="isType === 'detail'" v-for="(item,index) in detailForm.executionList" :key="index">
            <td>{{index+1}}</td>
            <td colspan="4">{{item.executionName}}</td>
            <td style="width:100px;">{{item.userName}}</td>
          </tr>
        </table>
      </div>
      <div v-if="isType === 'detail'" v-for="(item,index) in detailForm.childList" :key="index">
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
              <td>{{childindex+1}}</td>
              <td colspan="4">{{child.executionName}}</td>
              <td style="width:100px;">{{child.userName}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="isType === 'cfg'" class="child-title" style="text-align: left"><el-button size="mini" type="primary" @click="addSet">创建预案验证执行操作</el-button></div>
      <div v-if="isType === 'cfg'" class="is-scrolling-none">
        <table class="el-table__body">
          <tr>
            <td class="text-bold" style="width:100px;">编号</td>
            <td class="text-bold">预案验证执行操作</td>
            <td class="text-bold" style="width:155px;">负责人</td>
            <td class="text-bold" style="width:65px;">操作</td>
          </tr>
          <tr v-for="(item, index) in executionList" :key="index">
            <td>{{index+1}}</td>
            <td>
              <el-input v-model="item.executionName" placeholder="请输入预案操作内容"></el-input>
            </td>
            <td>
              <el-select v-model="item.userId" placeholder="请选择负责人" style="width:100%;">
                <el-option v-for="(userOption, child) in useridOptions" :key="userOption.id+'-'+child" :value="userOption.id"
                           :label="userOption.displayName"></el-option>
              </el-select>
            </td>
            <td><el-button size="mini" type="primary" @click="delSet(index)">删除</el-button></td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogSet('allform')">关 闭</el-button>
        <el-button type="primary" @click="saveSet('allform')" v-if="isType === 'cfg'">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findAllUserInRoleEnable, findPreplanApproveTemplate, findPreplanCanUseParent, savePreplan, updatePreplan, findPreplan, findPreplanById, savePreplanExecution, uploadPreplanFile, changePreplanStatus, downPreplanFile } from '@/api/plans/plan'
  import { alertBox, downURL } from '@/utils/request'
  export default {
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        planTitle: '',
        setTitle: '',
        formShow: false,
        detailShow: false,
        setShow: false,
        setBackShow: false,
        fileList: [],
        isType: 'add', // 是否是进行编辑操作
        form: {
          preplanName: '',
          versionNum: '',
          userId: '',
          type: '0',
          fileNameList: [],
          preDesc: '',
          preplanPid: '',
          approveTemplateId: '',
          scene: '',
          rejectAdvice: ''
        },
        thispreplanId: '',
        executionList: [{
          preplanId: '',
          userId: '',
          executionName: ''
        }],
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
        pageTotal: 0,
        pageSizes: [10, 15, 20],
        queryPage: {
          index: 1,
          size: 10
        },
        searchQuery: { // 查询数据
          preplanName: '',
          preStatus: ''
        },
        useridOptions: [],
        PreplanCanUseParentOptions: [],
        PreplanApproveTemplateOptions: [],
        fileNameShow: '',
        fileNameDown: '',
        downUrl: downURL() + '/dr/downPreplanFile.do?fileName='
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
        if (file.indexOf('[') !== -1 && file.indexOf(']') !== -1) {
          const str_before = file.split('[')[0]
          const str_after = file.split(']')[1]
          return str_before + str_after
        } else {
          return file
        }
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
      // 列表数据 分页 搜索
      // 删除等 公共弹框
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      // 删除等 公共弹框
      operate(type, val) {
        this.useridOptions = []
        this.PreplanCanUseParentOptions = []
        this.PreplanApproveTemplateOptions = []
        findAllUserInRoleEnable().then(response => {
          if (response) {
            this.useridOptions = Object.assign([], response.list)
          }
        })
        findPreplanCanUseParent().then(response => {
          if (response) {
            this.PreplanCanUseParentOptions = Object.assign([], response.list)
          }
        })
        findPreplanApproveTemplate().then(response => {
          if (response) {
            this.PreplanApproveTemplateOptions = Object.assign([], response.list)
          }
        })
        if (type === 'add') {
          this.planTitle = '新增预案计划'
          this.isType = 'add'
        } else if (type === 'edit' || type === 'back') {
          findPreplanById({ id: val.id, flag: 3 }).then(response => {
            if (response) {
              this.form = Object.assign({}, {
                id: val.id,
                preplanName: response.obj.preplanName,
                versionNum: response.obj.versionNum,
                userId: response.obj.userId,
                type: (response.obj.type).toString(),
                fileNameList: [],
                preDesc: response.obj.preDesc,
                preplanPid: response.obj.preplanPid,
                approveTemplateId: response.obj.approveTemplateId,
                rejectAdvice: response.obj.rejectAdvice,
                scene: response.obj.scene
              })
              if (response.obj.executionList === null || response.obj.executionList === [] || response.obj.executionList.length === 0) {
                this.executionList = [{
                  preplanId: this.thispreplanId,
                  userId: '',
                  executionName: ''
                }]
              } else {
                this.executionList = Object.assign([], response.obj.executionList)
              }
              // this.fileList.push({ name: response.obj.fileNameList[0], url: '' })
              this.fileNameShow = response.obj.fileNameList[0]
              this.fileNameDown = response.obj.fileNameList[0]
            }
          })
          this.planTitle = '编辑预案计划'
          if (type === 'edit') {
            this.isType = 'edit'
          } else if (type === 'back') {
            if (!this.executionList[0].preplanId) {
              this.executionList[0].preplanId = val.id
            }
            this.thispreplanId = val.id
            this.isType = 'back'
          }
        }
        this.formShow = true
      },
      save(formName) {
        if (this.isType === 'add') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.form.type = parseInt(this.form.type)
              savePreplan(this.form).then(() => {
                this.fetchData()
                this.formShow = false
              })
            } else {
              return false
            }
          })
        } else if (this.isType === 'edit') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.form.type = parseInt(this.form.type)
              if (this.form.type === 0) {
                this.form.preplanPid = 0
              }
              updatePreplan(this.form).then(() => {
                this.fetchData()
                this.formShow = false
              })
            } else {
              return false
            }
          })
        } else if (this.isType === 'back') {
          if (this.executionList.length < 1) {
            this.$message.error('请配置预案验证执行操作和负责人')
            return
          } else {
            for (const i in this.executionList) {
              if (!this.executionList[i].executionName) {
                this.$message.error('请输入预案验证执行操作')
                return
              }
              if (!this.executionList[i].userId) {
                this.$message.error('请选择负责人')
                return
              }
            }
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              savePreplanExecution(this.executionList).then(() => {
                this.fetchData()
                this.formShow = false
              })
            } else {
              return false
            }
          })
        }
      },
      closeDialog(formName) {
        this.$refs[formName].resetFields()
        this.form = {
          preplanName: '',
          versionNum: '',
          userId: '',
          type: '0',
          fileNameList: [],
          preDesc: '',
          preplanPid: '',
          approveTemplateId: '',
          scene: ''
        }
        this.executionList = [{
          preplanId: this.thispreplanId,
          userId: '',
          executionName: ''
        }]
        this.fileList = []
        this.fileNameShow = ''
        this.fileNameDown = ''
        this.formShow = false
      },
      beforeUpload(file) {
        const fd = new FormData()
        fd.append('file', file)
        uploadPreplanFile(fd).then(response => {
          if (response) {
            // this.fileList.push({ name: response.data[1], url: '' })
            this.fileNameShow = response.data[1]
            this.fileNameDown = response.data[0]
            this.form.fileNameList.push(response.data[0])
          }
        })
        return true
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      uploadSuccess(response, file, fileList) {
        // this.this.fileList = fileList
      },
      addfiles() {
        this.fileList = []
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
        downPreplanFile({ fileName: file.name }).then(response => {
        })
      },
      setshow(type, val) {
        if (type === 'detail') {
          this.isType = 'detail'
          this.setTitle = '查看预案计划详情'
        } else if (type === 'cfg') {
          this.isType = 'cfg'
          this.setTitle = '配置预案流程'
        }
        this.useridOptions = []
        findAllUserInRoleEnable().then(response => {
          if (response) {
            this.useridOptions = Object.assign([], response.list)
          }
        })
        this.thispreplanId = val.id
        findPreplanById({ id: val.id, flag: 3 }).then(response => {
          if (response) {
            this.detailForm = Object.assign({}, response.obj)
            if (response.obj.executionList === null || response.obj.executionList === [] || response.obj.executionList.length === 0) {
              this.executionList = [{
                preplanId: this.thispreplanId,
                userId: '',
                executionName: ''
              }]
            } else {
              this.executionList = Object.assign([], response.obj.executionList)
            }
          }
        })
        this.setShow = true
      },
      closeDialogSet() {
        this.executionList = [{
          preplanId: this.thispreplanId,
          userId: '',
          executionName: ''
        }]
        this.setShow = false
      },
      saveSet() {
        if (this.isType === 'cfg') {
          if (this.executionList.length < 1) {
            this.$message.error('请配置预案验证执行操作和负责人')
            return
          } else {
            for (const i in this.executionList) {
              if (!this.executionList[i].executionName) {
                this.$message.error('请输入预案验证执行操作')
                return
              }
              if (!this.executionList[i].userId) {
                this.$message.error('请选择负责人')
                return
              }
            }
          }
          savePreplanExecution(this.executionList).then(() => {
            this.fetchData()
            this.setShow = false
          })
        }
      },
      addSet() {
        this.executionList.push({
          preplanId: this.thispreplanId,
          userId: '',
          executionName: ''
        })
      },
      delSet(index) {
        this.executionList.splice(index, 1)
      },
      operationOther(val, msg) {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changePreplanStatus(val).then(() => {
            this.fetchData()
            this.setShow = false
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // })
        })
      },
      typeChange() {
        if (this.form.type === '0') {
          this.form.preplanPid = ''
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #planTable{
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
