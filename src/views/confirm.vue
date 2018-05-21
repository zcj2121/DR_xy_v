<template>
  <div class="confirm">
    <div class="confirm-title">预案名称一</div>
    <div class="is-scrolling-none">
      <table class="el-table__body">
        <tr>
          <td class="text-bold" style="width:100px;">版本号</td>
          <td colspan="2">1.0</td>
          <td class="text-bold" style="width:100px;">负责人</td>
          <td colspan="2">张三</td>
        </tr>
        <tr>
          <td class="text-bold">预案类型</td>
          <td colspan="5">预案类型</td>
        </tr>
        <tr>
          <td class="text-bold">预案文件</td>
          <td colspan="5">预案类型</td>
        </tr>
        <tr>
          <td class="text-bold">描述</td>
          <td colspan="5">预案类型</td>
        </tr>
        <tr>
          <td class="text-bold">所属预案</td>
          <td colspan="5">预案类型</td>
        </tr>
        <tr>
          <td class="text-bold">适用场景</td>
          <td colspan="5">预案类型</td>
        </tr>
        <tr>
          <td class="text-bold">预案验证执行操作</td>
          <td colspan="5">预案描述XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX预案描述XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX预案描述XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX预案描述XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</td>
        </tr>
      </table>
      <div style="text-align: center;margin-top:20px;">
        <el-button type="primary" @click="confirmSave">完 成</el-button>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      thisId: ''
    }
  },
  computed: {
  },
  created() {
    this.nowUrl()
  },
  methods: {
    confirmSave() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    nowUrl() {
      const url = window.location.href
      const thisid = url.split('auditId=')[1]
      this.thisId = thisid
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .confirm{
    padding:30px;
    .confirm-title{
      margin-bottom:10px;
      text-align: center;
      font-size: 15px;
      font-weight: bold;
      color:#606266;
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
  }
</style>
