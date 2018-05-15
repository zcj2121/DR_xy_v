<template>
  <div class="bigscreen">
    <div class="header">
      <div class="title-box">
        <div class="title">
          <div class="names">名称名称</div>
          <div class="times">2018-05-18 14:21:00</div>
        </div>
      </div>
    </div>
    <div class="progress">
      <div class="progress-title">
      </div>
      <div class="title">执行进度：</div>
      <el-progress :text-inside="true" :stroke-width="14" :percentage="80" color="rgba(14, 170, 182, 0.7)"></el-progress>
    </div>
    <div class="content">

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    confirmSave() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .bigscreen{
    .progress{
      .el-progress{
        .el-progress-bar__innerText{
          margin-top: -4px;
          height: 14px;
          font-size:12px;
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .bigscreen{
    background: #1f4164;
    width: 100%;
    height: 100%;
    .header{
      height: 35px;
      background: -webkit-linear-gradient(#001220, #112a40);
      background: -o-linear-gradient(#001220, #112a40);
      background: -moz-linear-gradient(#001220, #112a40);
      background: linear-gradient(#001220, #112a40);
      position: relative;
      .title-box{
        width:250px;
        height:0;
        border-top: 15px solid #112a40;
        border-right: 50px solid transparent;
        border-left:50px solid transparent;
        position: absolute;
        left:50%;
        margin-left: -100px;
        bottom:-15px;
        .title{
          position: absolute;
          bottom: 5px;
          color: #fff;
          font-weight: bold;
          text-align: center;
          width: 100%;
          .names{
            font-size:18px;
          }
          .times{
            margin-top:3px;
            font-size:14px;
          }
        }
      }
    }
    .progress{
      height:90px;
      background: #112a40;
      margin: 15px;
      /*background: -webkit-linear-gradient(#112a40, #001220, #112a40);*/
      /*background: -o-linear-gradient(#112a40, #001220, #112a40);*/
      /*background: -moz-linear-gradient(#112a40, #001220, #112a40);*/
      /*background: linear-gradient(#112a40, #001220, #112a40);*/
      position: relative;
      border-radius: 2px;
      padding:10px 15px;
      .progress-title{
        width:250px;
        height:0;
        border-top: 15px solid #1f4164;
        border-right: 50px solid transparent;
        border-left:50px solid transparent;
        position: absolute;
        left:50%;
        margin-left: -100px;
        top: 0px;
      }
      .el-progress{
        height:70px;
        line-height: 80px;
        .el-progress-bar__innerText{
          margin-top: -4px;
          height: 14px;
        }
      }
      .title{
        position: absolute;
        color:#fff;
      }
    }
  }
</style>
