<template>
  <div class="confirm">
    <div class="confirm-title">{{detailForm.preplanName}}</div>
    <div class="is-scrolling-none">
      <table class="el-table__body">
        <tr>
          <td class="text-bold" style="width:150px;">版本号</td>
          <td colspan="2">{{detailForm.versionNum}}</td>
          <td class="text-bold" style="width:150px;">负责人</td>
          <td colspan="2">{{detailForm.userName}}</td>
        </tr>
        <tr>
          <td class="text-bold">预案类型</td>
          <td colspan="5">{{detailForm.type === 1 ? '专项预案' : '总体预案'}}</td>
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
        <tr>
          <td class="text-bold">预案验证执行操作</td>
          <td colspan="5">{{detailForm.executionName}}</td>
        </tr>
      </table>
      <div style="text-align: center;margin-top:20px;">
        <el-button type="primary" @click="confirmSave">完 成</el-button>
        <el-button  @click="back" v-if="backShow">返 回</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPreplanExecution, finishPreplanTask } from '@/api/plans/plandrill'
import { downURL } from '@/utils/alert'
export default {
  data() {
    return {
      detailForm: {},
      backShow: false,
      downUrl: downURL + '/dr/downPreplanFile.do?fileName='
    }
  },
  computed: {
    ...mapGetters([
      'executionId'
    ])
  },
  filters: {
    typesFilter(status) {
      const typesMap = {
        0: '总体预案',
        1: '专项预案'
      }
      return typesMap[status]
    },
    fileFilter(file) {
      const str_before = file.split('[')[0]
      const str_after = file.split(']')[1]
      return str_before + str_after
    }
  },
  created() {
    this.thisDetail()
  },
  methods: {
    confirmSave() {
      finishPreplanTask({ id: this.executionId }).then(response => {
        if (response) {
          if (response.code === 200 || response.code === '200') {
            this.$router.push({ path: '/plans/plandrill' })
            this.$store.commit('SET_EXECUTIONID', '')
            this.backShow = false
          } else {
            this.backShow = true
          }
        }
      })
    },
    thisDetail() {
      getPreplanExecution({ id: this.executionId }).then(response => {
        if (response) {
          this.detailForm = Object.assign({}, response.obj)
        }
      })
    },
    back() {
      this.$router.push({ path: '/plans/plandrill' })
      this.$store.commit('SET_EXECUTIONID', '')
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
