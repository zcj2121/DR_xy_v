<template>
  <div class="app-container" id="orgviewTable">
    <span class="tabel-title">组织架构概览</span>
    <div class="groupview-box">
      <div class="jOrgChart">
        <org-node :model='model' v-for='model in data.data' :key="model.key"></org-node>
      </div>
    </div>
  </div>
</template>

<script>
  import orgNode from './components/OrgTreeNode'
  export default {
    name: 'orgTree',
    components: {
      orgNode
    },
    data() {
      return {
        data: {
          data: [
            {
              id: 1,
              name: '指挥组',
              pid: 0,
              leader: '张某某',
              Fleader: '李某某',
              member: [
                { name: '刘某某' },
                { name: '刘某某' },
                { name: '刘某某' },
                { name: '刘某某' }
              ],
              number: 6,
              children: [
                {
                  id: 2,
                  name: '协调组',
                  pid: 1,
                  leader: '张某某',
                  Fleader: '李某某',
                  member: [
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' }
                  ],
                  number: 6,
                  children: []
                },
                {
                  id: 3,
                  name: '通讯网络组',
                  pid: 1,
                  leader: '张某某',
                  Fleader: '李某某',
                  member: [
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' }
                  ],
                  number: 6,
                  children: []
                },
                {
                  id: 4,
                  name: '系统组',
                  pid: 1,
                  leader: '张某某',
                  Fleader: '李某某',
                  member: [
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' }
                  ],
                  number: 6,
                  children: []
                },
                {
                  id: 5,
                  name: '存储组',
                  pid: 1,
                  leader: '张某某',
                  Fleader: '李某某',
                  member: [
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' }
                  ],
                  number: 6,
                  children: []
                },
                {
                  id: 6,
                  name: '应用组',
                  pid: 1,
                  leader: '张某某',
                  Fleader: '李某某',
                  member: [
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' }
                  ],
                  number: 6,
                  children: []
                },
                {
                  id: 7,
                  name: '后勤组',
                  pid: 1,
                  leader: '张某某',
                  Fleader: '李某某',
                  member: [
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' },
                    { name: '刘某某' }
                  ],
                  number: 6,
                  children: []
                }
              ]
            }
          ]
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #orgviewTable{
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
<style>
  /* node cell */
  .jOrgChart{
    margin-bottom:30px;
    padding-bottom: 20px;
    overflow-x: auto;
  }
  .jOrgChart table{
    margin: auto;
  }
  .jOrgChart td {
    text-align: center;
    vertical-align: top;
    padding: 0;
  }
  /* The node */
  .jOrgChart .node {
    /*background-color: #304156;*/
    border:2px solid #304156;
    border-image: -webkit-linear-gradient(#304156, #aaa,#304156) 40 40;
    border-image: -moz-linear-gradient(#304156, #aaa,#304156) 40 40;
    border-image: linear-gradient(#304156, #aaa,#304156) 40 40;
    display: inline-block;
    min-width: 180px;
    min-height: 120px;
    line-height: 40px;
    z-index: 10;
    margin: 0 8px;
    border-radius: 4px;
  }
  .jOrgChart .left {
    border-right: 1px solid #304156;
  }
  .jOrgChart .right {
    border-left: 1px solid #304156;
  }
  .jOrgChart .top {
    border-top: 2px solid #304156;
  }
  .jOrgChart .down {
    background-color: #304156;
    margin: 0px auto;
  }
  .jOrgChart .line {
    height: 20px;
    width: 2px;
  }
  .ort-item-title{
    /*background-color: #304156;*/
    background: -webkit-linear-gradient(#304156, #aaa); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#304156, #aaa); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#304156, #aaa); /* Firefox 3.6 - 15 */
    background: linear-gradient(#304156, #aaa); /* 标准的语法 */
    color:#fff;
    position: relative;
  }
  .org-item-class{
    line-height: 30px;
    font-size:14px;
    text-align: left;
    padding-left:20px;
    overflow: hidden;
  }
  .org-item-class span{
    display: inline-block;
    width: 60px;
  }
  .opened{
    position: absolute;
    right: 6px;
    top: 10px;
  }
  .ort-item-footer{
    background: -webkit-linear-gradient(#aaa, #304156); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#aaa, #304156); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#aaa, #304156); /* Firefox 3.6 - 15 */
    background: linear-gradient(#aaa, #304156); /* 标准的语法 */
    color:#fff;
    height:20px;
    line-height: 22px;
    font-size: 12px;
  }
</style>



