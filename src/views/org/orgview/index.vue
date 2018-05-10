<template>
  <div class="app-container" id="menuTable">
    <span class="tabel-title">角色管理列表</span>
    <div class="groupview-box">
      <el-checkbox v-model="horizontal">纵向排列</el-checkbox>
    </div>
    <div class="groupview-box">
      <org-tree
        :data="data"
        :horizontal="horizontal"
        :collapsable="collapsable"
        :label-class-name="labelClassName"
        :render-content="renderContent"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"
      >
      </org-tree>
    </div>
  </div>
</template>

<script>
  import OrgTree from './components/org-tree'
  export default {
    name: 'app',
    components: {
      OrgTree
    },
    data() {
      return {
        data: {
          id: 0,
          label: 'XXX科技有限公司',
          children: [{
            id: 2,
            label: '产品研发部',
            children: [{
              id: 5,
              label: '研发-前端'
            }, {
              id: 6,
              label: '研发-后端'
            }, {
              id: 9,
              label: 'UI设计'
            }, {
              id: 10,
              label: '产品经理'
            }]
          }, {
            id: 3,
            label: '销售部',
            children: [{
              id: 7,
              label: '销售一部'
            }, {
              id: 8,
              label: '销售二部'
            }]
          }, {
            id: 4,
            label: '财务部'
          }, {
            id: 9,
            label: 'HR人事'
          }]
        },
        horizontal: false,
        collapsable: true,
        labelClassName: 'bg-tomato'
      }
    },
    methods: {
      renderContent(h, data) {
        return data.label
      },
      onExpand(data) {
        if ('expand' in data) {
          data.expand = !data.expand

          if (!data.expand && data.children) {
            this.collapse(data.children)
          }
        } else {
          this.$set(data, 'expand', true)
        }
      },
      onNodeClick(e, data) {
        alert(data.label)
      },
      collapse(list) {
        list.forEach(child => {
          if (child.expand) {
            child.expand = false
          }

          child.children && this.collapse(child.children)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
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
<style  rel="stylesheet/scss" lang="scss" scoped>
  .groupview-box{
    text-align: center;
  }
  .bg-white {
    background-color: white;
  }
  .bg-orange {
    background-color: orange;
  }
  .bg-gold {
    background-color: gold;
  }
  .bg-gray {
    background-color: gray;
  }
  .bg-lightpink {
    background-color: lightpink;
  }
  .bg-chocolate {
    background-color: chocolate;
  }
  .bg-tomato {
    background-color: tomato;
  }
</style>

