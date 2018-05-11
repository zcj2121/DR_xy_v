<template>
	<span class="tree-expand">
		<span class="tree-label" v-show="DATA.isEdit">
			<el-input class="edit" size="mini" autofocus
                v-model="DATA.name"
                :ref="'treeInput'+DATA.id"
                @click.stop.native="nodeEditFocus"
                @blur.stop="nodeEditPass(STORE,DATA,NODE)"
                @keyup.enter.stop.native="nodeEditPass(STORE,DATA,NODE)"></el-input>
		</span>
		<span v-show="!DATA.isEdit"
          :class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
			<span>{{DATA.name}}</span>
		</span>
		<span class="tree-btn" v-show="!DATA.isEdit">
			<i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
			<i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
			<i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
		</span>
    <!--弹出框-->
    <el-dialog :title="modelTitle" width="500px" :visible.sync="dialogShow"
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
	</span>

</template>

<script>
  import { findParentAndAboveNode } from '@/api/orgtable'
  export default {
    data() {
      return {
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
        }
      }
    },
    name: 'treeExpand',
    props: ['NODE', 'DATA', 'STORE', 'maxexpandId'],
    methods: {
      nodeAdd(s, d, n) { // 新增
        this.dialogShow = true
        this.modelTitle = '新增组织'
        this.groupAll()
      },
      nodeEdit(s, d, n) { // 编辑
        this.dialogShow = true
        this.modelTitle = '编辑组织'
        this.groupAll()
      },
      groupAll() {
        findParentAndAboveNode(this.dataQuery).then(response => {
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
      nodeDel(s, d, n) { // 删除
        this.$confirm('是否删除此节点？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
          return false
        })
      },
      nodeEditPass(s, d, n) { // 编辑完成
      },
      nodeEditFocus() {
        // 阻止点击节点的事件冒泡
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

<style>
  .tree-expand {
    overflow: hidden;
  }

  .tree-expand .tree-label.tree-new {
    font-weight: 600;
  }

  .tree-expand .tree-label {
    font-size: 0.9em;
  }

  .tree-expand .tree-label .edit {
    width: 80%;
  }

  .tree-expand .tree-btn {
    display: none;
    float: right;
    margin-right: 20px;
  }

  .tree-expand .tree-btn i {
    color: #8492a6;
    font-size: 0.9em;
    margin-right: 3px;
  }
</style>
