<template>
	<span class="tree-expand">
		<span class="tree-label" v-show="DATA.isEdit">
			<el-input class="edit" size="mini" autofocus
                v-model="DATA.groupName"
                :ref="'treeInput'+DATA.id"
                @click.stop.native="nodeEditFocus"
                @blur.stop="nodeEditPass(STORE,DATA,NODE)"
                @keyup.enter.stop.native="nodeEditPass(STORE,DATA,NODE)"></el-input>
		</span>
		<span v-show="!DATA.isEdit"
          :class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
			<span>{{DATA.groupName}} <span style="color:#09c;" v-if="DATA">共{{DATA.personCount}}人</span> </span>
		</span>
		<span class="tree-btn" v-show="!DATA.isEdit">
			<i class="el-icon-plus" title="添加" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
			<i class="el-icon-edit" title="修改" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
			<i class="el-icon-delete" title="删除" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
		</span>
	</span>

</template>

<script>
  export default {
    data() {
      return {
      }
    },
    name: 'treeExpand',
    props: ['NODE', 'DATA', 'STORE', 'maxexpandId'],
    methods: {
      nodeAdd(s, d, n) { // 新增
        this.$emit('nodeAdd', s, d, n)
      },
      nodeEdit(s, d, n) { // 编辑
        this.$emit('nodeEdit', s, d, n)
      },
      nodeDel(s, d, n) { // 删除
        this.$emit('nodeDel', s, d, n)
      },
      nodeEditPass(s, d, n) { // 编辑完成
      },
      nodeEditFocus() {
        // 阻止点击节点的事件冒泡
      },
      close() {
      },
      save() {
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
    margin-left: 10px;
    position: absolute;
    right: 10px;
    background: #eee;
    padding:0 2px 0 5px;
  }

  .tree-expand .tree-btn i {
    color: #8492a6;
    font-size: 0.9em;
    margin-right: 3px;
    font-weight: bold;
  }
  .tree-expand .tree-btn i:first-child {
    color:#409EFF;
  }
  .tree-expand .tree-btn i:nth-child(2) {
    color:#E6A23C;
  }
  .tree-expand .tree-btn i:last-child {
    color:#F56C6C;
  }

</style>
