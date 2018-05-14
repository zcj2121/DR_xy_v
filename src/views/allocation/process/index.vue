<template>
  <div class="app-container" id="processTable">
    <div class="filter-container">
      <el-input style="width: 200px;" size="mini" class="filter-item" v-model="pageTotal" placeholder="请输入切换流程名称">
      </el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="operate('add')">新增
      </el-button>
    </div>
    <el-table :data="userData.items" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column label="切换流程名称" prop="name" min-width="100" sortable></el-table-column>
      <el-table-column label="描述" prop="remark" min-width="120" sortable></el-table-column>
      <el-table-column label="负责人" prop="leader" width="100" sortable></el-table-column>
      <el-table-column label="状态" prop="statu" width="75" sortable></el-table-column>
      <el-table-column label="操作" width="226">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" v-if="scope.row.statu!=='驳回'" @click="detail(scope.row)">查看</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.statu==='驳回'" @click="detailBack(scope.row)">查看驳回建议</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.statu==='待提交'||scope.row.statu==='驳回'"
                       @click="operate('edit',scope.row)">编辑
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.statu==='待提交'||scope.row.statu==='驳回'"
                       @click="operation(scope.row.id, '确认提交吗', '123')">提交
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.statu==='通过'"
                       @click="run(scope.row)">申请执行
            </el-button>
            <el-button size="mini" type="primary" v-if="scope.row.statu==='待提交'||scope.row.statu==='驳回'"
                       @click="operation(scope.row.id, '确认删除吗', '123')">删除
            </el-button>
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
    <el-dialog :title="operateTitle" width="600px" :visible.sync="formShow" :modal-append-to-body="false"
               @close="operateClose">
      <el-form :model="form" label-position="right" label-width="100px">
        <el-form-item label="流程名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入流程名称"></el-input>
          <div class="name-repeat" v-if="nameRepeat">名称重复</div>
        </el-form-item>
        <el-form-item label="流程描述：" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入流程描述"></el-input>
        </el-form-item>
        <el-form-item label="流程负责人：" prop="enabled">
          <el-select v-model="form.leader" placeholder="请选择流程负责人" style="width:100%;">
            <el-option value="" label=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批流程：" prop="enabled">
          <el-select v-model="form.process" placeholder="请选择审批流程" style="width:100%;">
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
    <el-dialog title="查看切换流程" id="dialogMitop" width="90%" :visible.sync="detailShow" :modal-append-to-body="false"
               @close="closeDialog">
      <table class="el-table__body">
        <tr>
          <td class="text-bold" style="width:150px;">切换流程名称</td>
          <td colspan="2">1.0</td>
          <td class="text-bold" style="width:150px;">负责人</td>
          <td colspan="2">张三</td>
        </tr>
        <tr>
          <td class="text-bold">切换流程描述</td>
          <td colspan="5">预案类型</td>
        </tr>
      </table>
      <div id="elStepBox">
        <div class="el-steps el-steps--vertical">
          <div class="el-step is-vertical" style="flex-basis: 190px;">
            <div class="el-step__head is-finish">
              <div class="el-step__line" style="margin-right: 0px;"><i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
              </div>
              <div class="el-step__icon is-text">
                <div class="el-step__icon-inner">1</div>
              </div>
            </div>
            <div class="el-step__main">
              <div class="el-step__title is-finish">
                <span>阶段 1</span>
              </div>
              <div class="icon-toright"><i class="fa fa-play"></i></div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="el-step is-vertical"  style="flex-basis: 190px;">
            <div class="el-step__head is-process">
              <div class="el-step__line" style="margin-right: 0px;"><i class="el-step__line-inner" style="transition-delay: -150ms; border-width: 0px; height: 0%;"></i>
              </div>
              <div class="el-step__icon is-text">
                <div class="el-step__icon-inner">2</div>
              </div>
            </div>
            <div class="el-step__main">
              <div class="el-step__title is-process">
                <span>阶段 2</span>
              </div>
              <div class="icon-toright"><i class="fa fa-play"></i></div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step__description is-process"></div>
            </div>
          </div>
          <div class="el-step is-vertical"  style="flex-basis: 190px;">
            <div class="el-step__head is-wait">
              <div class="el-step__line"><i class="el-step__line-inner"></i></div>
              <div class="el-step__icon is-text">
                <div class="el-step__icon-inner">3</div>
              </div>
            </div>
            <div class="el-step__main">
              <div class="el-step__title is-wait">
                <span>阶段 3</span>
              </div>
              <div class="icon-toright"><i class="fa fa-play"></i></div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step__description is-wait"></div>
            </div>
          </div>
          <div class="el-step is-vertical"  style="flex-basis: 190px;">
            <div class="el-step__head is-wait">
              <div class="el-step__line"><i class="el-step__line-inner"></i></div>
              <div class="el-step__icon is-text">
                <div class="el-step__icon-inner">3</div>
              </div>
            </div>
            <div class="el-step__main">
              <div class="el-step__title is-wait">
                <span>阶段 3</span>
              </div>
              <div class="icon-toright"><i class="fa fa-play"></i></div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step-con">
                <div class="el-step-con-item" title="切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1">
                  <div class="el-step-con-item-title">切换步骤sadfasdfasdfasdfasdfasdfasdfasdfsadfasdfasd内容1</div>
                  <div class="el-step-con-item-btm"><span>手动</span><span style="margin-left:20px;">王五</span></div>
                </div>
              </div>
              <div class="el-step__description is-wait"></div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <!--查看驳回信息 弹出框-->
    <el-dialog title="查看驳回信息" width="450px" :visible.sync="detailBackShow" :modal-append-to-body="false"
               @close="detailBackClose">
      <div style="color:red;    overflow: hidden;    text-indent: 2em;">驳回原因驳回驳回原因驳回，驳回原因驳回原因驳回，驳回原因驳回原因驳回，驳回原因驳回原因驳回，驳回原因驳回原因驳回，驳回原因驳回原因驳回，驳回原因，驳回原因</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailBackClose('allform')">关 闭</el-button>
      </div>
    </el-dialog>
    <!--申请执行 弹出框-->
    <el-dialog title="申请执行" width="400px" :visible.sync="runShow" :modal-append-to-body="false"
               @close="runClose">
      <el-form label-position="right" label-width="85px">
        <el-form-item label="审批流程：">
          <el-select placeholder="请选择场景负责人" v-model="auditName" style="width:100%;">
            <el-option value="1" label="申请执行审批流程一"></el-option>
            <el-option value="2" label="申请执行审批流程一"></el-option>
            <el-option value="3" label="申请执行审批流程一"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="runClose('allform')">取 消</el-button>
        <el-button type="primary" @click="runSave('allform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList } from '@/api/seetable'
  import { alertBox } from '@/utils/alert'

  export default {
    data() {
      return {
        data: null,
        list: null,
        listLoading: true,
        operateTitle: '',
        formShow: false,
        nameRepeat: false,
        detailBackShow: false,
        runShow: false,
        auditName: '1',
        form: {
          name: '',
          leader: '',
          type: '0',
          remark: '',
          process: ''
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
      operation(id, msg, url) {
        alertBox(this, msg, url, id)
      },
      detail(val) {
        this.detailShow = true
      },
      closeDialog() {

      },
      operate(type, val) {
        if (type === 'add') {
          this.operateTitle = '新增流程信息'
        } else if (type === 'edit') {
          this.operateTitle = '编辑流程信息'
        }
        this.formShow = true
      },
      operateClose() {
      },
      save() {
      },
      detailBack() {
        this.detailBackShow = true
      },
      detailBackClose() {
        this.detailBackShow = false
      },
      run() {
        this.runShow = true
      },
      runClose() {
        this.runShow = false
      },
      runSave() {
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #processTable {
    .el-dialog__body {
      padding: 10px 20px;
      .el-table__body-wrapper {
        height: 250px;
        overflow-y: auto;
      }
    }
    #dialogMitop {
      .el-dialog {
        margin-top: 6vh !important;
      }
      .el-dialog__body{
        height:550px;
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

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    color: #606266;
    tr {
      td {
        border: 1px solid #ebeef5;
        padding: 10px 12px;
        line-height: 25px;
      }
      th {
        border: 1px solid #ebeef5;
      }
    }
  }

  .text-bold {
    font-weight: bold;
  }
  #elStepBox{
    margin-top:35px;
    overflow-x: auto;
    .el-step__head{
      padding-top: 10px;
      .el-step__line {
        width: 2px;
        top: 34px;
        bottom: -11px;
        left: 11px;
      }
    }
    .el-step__main{
      display: inherit;
      .el-step__title {
        line-height: 24px;
        width: 150px;
        border: 1px solid;
        padding: 10px;
        border-radius: 2px;
        float: left;
        display: inline;
        height: 46px;
      }
      .icon-toright{
        float: left;
        margin-left: 10px;
        line-height: 50px;
        color: #aaa;
      }
      .el-step-con{
        float: left;
        margin-left: 10px;
        height: 158px;
        overflow-y: auto;
        .el-step-con-item{
          width: 150px;
          overflow: hidden;
          border:1px solid #ccc;
          padding: 0px 6px;
          border-radius: 2px;
          margin-bottom: 10px;
          height:46px;
          .el-step-con-item-title{
            font-size:14px;
            font-weight: bold;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 26px;
          }
          .el-step-con-item-btm{
            font-size:12px;
            font-weight: bold;
            text-align: center;
            line-height: 14px;
          }
        }
      }
    }

  }
</style>
