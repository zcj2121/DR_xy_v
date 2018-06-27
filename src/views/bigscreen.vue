<template>
  <div class="bigscreen">
    <div class="header">
      <span class="pull-left time-start">开始时间：<span style="color:#66FF33">{{bigScreenData.startTime | dateFilter}}</span></span>
      <span class="pull-right time-end">执行时间：<span style="color:#fecd54">{{bigRunDate}}</span></span>
      <div class="title-box">
        <div class="title">
          <div class="names">{{bigScreenData.processTitle}}</div>
          <div class="times">{{newDate | dateFilter}}</div>
        </div>
      </div>
    </div>
    <div class="progress">
      <div class="progress-title">
      </div>
      <div class="title">流程执行进度：</div>
      <div class="title" style="right: 15px;">
        <span class="time-name">切换状态：</span>
        <span class="progress-state" :class="{'isrunning': bigScreenData.state === 1}">{{bigScreenData.state | stateFilter}}</span>
      </div>
      <el-progress :class="{'no-start': bigScreenData.processSpeed <5}" :text-inside="true" :stroke-width="14" :percentage="bigScreenData.processSpeed | speedFilter" color="rgba(14, 170, 182, 0.7)"></el-progress>
    </div>
    <!--<div class="timebox">-->
      <!--<div class="time-title">-->
        <!--<span class="time-name">切换状态：</span>-->
        <!--<span style="    color: #67C23A;">完成</span>-->
      <!--</div>-->
      <!--<div class="time-title">-->
        <!--<span class="time-name">执行时间：</span>-->
        <!--<span style="color:#66FF33">14:21:00</span>-->
      <!--</div>-->
      <!--<div class="time-title">-->
        <!--<span class="time-name">剩余时间：</span>-->
        <!--<span style="color:#fecd54">14:21:00</span>-->
      <!--</div>-->
    <!--</div>-->
    <div class="stagebox">
      <div class='content-prc'>
        <div class="tit-box">
          <span class="stage-name">切换流程阶段</span>
          <small class="pull-right">
            <span class='statespan-finish'><span class="panel-btn scene-finish"></span>&nbsp;已完成</span>
            <span class='statespan-running'><span class="panel-btn scene-running"></span>&nbsp;执行中</span>
            <span class='statespan-nostart'><span class="panel-btn scene-nostart"></span>&nbsp;未开始</span>
            <span class='statespan-stop'><span class="panel-btn scene-stop"></span>&nbsp;终止</span>
          </small>
        </div>
        <div class="prc-box">
          <div class="r_box" :style="{width:100/bigScreenData.drmSwitchingStageInstanceDtos.length+'%'}" :class="item.state | stageFilter" v-for="(item, index) in bigScreenData.drmSwitchingStageInstanceDtos" :key="index+'-'+item.id">
            <div class="r_item">
              <p>{{item.stageName}}</p>
              <el-progress :class="{'no-start': item.stageSpeed <5}" :text-inside="true" :stroke-width="14" :percentage="item.stageSpeed | speedFilter" color="rgba(14, 170, 182, 0.7)"></el-progress>
              <div class="r_item_index">{{item.state | stageNameFilter}}</div>
            </div>
            <div class="r_box-sanjiao" v-if="item.state === 1"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class='step-name-box'>
        <span class="title">切换流程步骤</span>
        <small class="pull-right">
          <span class='statespan-finish'><span class="panel-btn scene-finish"></span>&nbsp;已完成</span>
          <span class='statespan-running'><span class="panel-btn scene-running"></span>&nbsp;执行中</span>
          <span class='statespan-skip'><span class="panel-btn scene-skip"></span>&nbsp;跳过</span>
          <span class='statespan-nostart'><span class="panel-btn scene-nostart"></span>&nbsp;未开始</span>
          <span class='statespan-stop'><span class="panel-btn scene-stop"></span>&nbsp;终止</span>
          <span class='statespan-error'><span class="panel-btn scene-error"></span>&nbsp;异常</span>
          <span class='statespan-suspend'><span class="panel-btn scene-suspend"></span>&nbsp;暂停</span>
        </small>
      </div>
      <div class='content-process'>
        <el-row :gutter="5">
          <el-col :span="4" v-for="(child, index) in bigContent" :key="index+'--'+child.id">
            <div class="step-box">
              <div class="step-title" :class="child.state | stepFilter">
                <span>{{child.stepName}}</span>
              </div>
              <i class="fa fa-angle-double-right" v-if="index+1 !== bigContent.length"></i>
              <div class="info-box">
                <i class="fa fa-angle-down info-icon"></i>
                <div class="info-item">
                  <div class="item-list">
                    <div>开始时间：</div>
                    <div :title="child.startTime | dateFilter">{{child.startTime | dateFilter}}</div>
                  </div>
                  <div class="item-list">
                    <div>完成时间：</div>
                    <div :title="child.endTime | dateFilter">{{child.endTime | dateFilter}}</div>
                  </div>
                  <div class="item-list">
                    <div>操作情况：</div>
                    <div>{{child.state | stepNameFilter}}</div>
                  </div>
                  <div class="item-list">
                    <div>负责人：</div>
                    <div>{{child.userName}}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>

      </div>
    </div>
  </div>
</template>

<script>
  import { bigScreen } from '@/api/change/execute'
  import { formatDate, MillisecondToDate } from '@/utils/index'
  export default {
    data() {
      return {
        bigScreenData: {},
        bigContent: [],
        newDate: null,
        bigRunDate: null,
        isNow: []
      }
    },
    filters: {
      stateFilter(state) {
        const stateMap = {
          0: '未开始',
          1: '执行中',
          7: '暂停',
          8: '执行完成',
          9: '进入历史',
          10: '终止'
        }
        return stateMap[state]
      },
      stageFilter(stage) {
        const stageMap = {
          2: 'end',
          5: 'stop',
          1: 'active',
          0: ''
        }
        return stageMap[stage]
      },
      stageNameFilter(stage) {
        const stageMap = {
          2: '已完成',
          5: '终止',
          1: '执行中',
          0: '未执行'
        }
        return stageMap[stage]
      },
      stepFilter(step) {
        const stepMap = {
          2: 'is-finish-box',
          4: 'is-skip-box',
          1: 'is-running-box',
          3: 'is-suspend-box',
          5: 'is-stop-box',
          13: 'is-error-box',
          0: 'is-nostart-box'
        }
        return stepMap[step]
      },
      stepNameFilter(step) {
        const stepMap = {
          2: '已完成',
          4: '已跳过',
          1: '执行中',
          3: '已暂停',
          5: '已终止',
          13: '异常',
          0: '未开始'
        }
        return stepMap[step]
      },
      dateFilter(time) {
        if (time) {
          const date = new Date(time)
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        } else {
          return ''
        }
      },
      speedFilter(speed) {
        if (speed) {
          return Number(parseInt(speed))
        }
      }
    },
    watch: {
      isNow: {
        handler(isNow) {
          this.timeRun()
        },
        deep: true
      }
    },
    created() {
      this.fetchData()
      setInterval(() => {
        this.newDate = new Date()
      }, 1000)
      setInterval(() => {
        this.fetchData()
      }, 3000)
    },
    methods: {
      fetchData() {
        bigScreen({
          id: this.$route.query.id
        }).then(response => {
          if (response) {
            this.bigScreenData = response.data
            const contentData = response.data.drmSwitchingStageInstanceDtos
            this.isNow = [response.data.executionTime, response.data.endTime]
            for (let i = 0; i < contentData.length; i++) {
              if (contentData[i].state === 1) {
                this.bigContent = contentData[i].lists
                return
              } else {
                this.bigContent = contentData[contentData.length - 1].lists
              }
            }
          }
        })
      },
      timeRun() {
        const date = this.isNow[0]
        // this.bigRunDate = MillisecondToDate(Math.round(date * 60))
        const endtime = this.isNow[1]
        this.bigRunDate = ''
        if (endtime) {
          this.bigRunDate = MillisecondToDate(Math.round(date * 60))
        } else {
          this.bigRunDate = MillisecondToDate(Math.round(date * 60))
          let thisDate = Math.round(date * 60)
          setTimeout(() => {
            thisDate += 1
            this.bigRunDate = MillisecondToDate(thisDate)
            setTimeout(() => {
              thisDate += 1
              this.bigRunDate = MillisecondToDate(thisDate)
            }, 1000)
          }, 1000)
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .bigscreen {
    .progress {
      .el-progress {
        .el-progress-bar__innerText {
          margin-top: 0px;
          height: 14px;
          font-size: 12px;
        }
      }
      .no-start{
        .el-progress-bar__innerText{
          color:#000;
        }
      }
    }
    .stagebox {
      .el-progress {
        .el-progress-bar__innerText {
          margin-top: 0px;
          height: 14px;
          font-size: 12px;
        }
      }
      .no-start{
        .el-progress-bar__innerText{
          color:#000;
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .bigscreen {
    background: #1f4164;
    width: 100%;
    height: 100%;
    .header {
      height: 40px;
      background: -webkit-linear-gradient(#001220, #112a40);
      background: -o-linear-gradient(#001220, #112a40);
      background: -moz-linear-gradient(#001220, #112a40);
      background: linear-gradient(#001220, #112a40);
      position: relative;
      border-bottom: 2px solid #222;
      .time-start{
        color: #fff;
        margin-left: 15px;
        padding-left: 8px;
        border-left: 8px solid #24a6d8;
        margin-top: 11px;
      }
      .time-end{
        color: #fff;
        margin-right: 15px;
        padding-left: 8px;
        border-left: 8px solid #24a6d8;
        margin-top: 11px;
      }
      .title-box {
        width: 250px;
        height: 0;
        border-top: 15px solid #112a40;
        border-right: 50px solid transparent;
        border-left: 50px solid transparent;
        position: absolute;
        left: 50%;
        margin-left: -100px;
        bottom: -15px;
        .title {
          position: absolute;
          bottom: 7px;
          color: #fff;
          font-weight: bold;
          text-align: center;
          width: 100%;
          .names {
            font-size: 18px;
            position: absolute;
            width: 300px;
            bottom: 18px;
            text-align: center;
            left: -75px;
          }
          .times {
            margin-top: 3px;
            font-size: 14px;
          }
        }
      }
    }
    .progress {
      height: 80px;
      margin: 10px;
      margin-top:13px;
      background: -webkit-linear-gradient(#112a40, #001220, #112a40);
      background: -o-linear-gradient(#112a40, #001220, #112a40);
      background: -moz-linear-gradient(#112a40, #001220, #112a40);
      background: linear-gradient(#112a40, #001220, #112a40);
      position: relative;
      border-radius: 2px;
      padding: 10px 15px;
      border: 2px solid #222;
      .progress-state{
        color:rgb(254, 205, 84);
      }
      .isrunning{
        color:#409EFF;
      }
      .progress-title {
        width: 250px;
        height: 0;
        border-top: 15px solid #1f4164;
        border-right: 50px solid transparent;
        border-left: 50px solid transparent;
        position: absolute;
        left: 50%;
        margin-left: -100px;
        top: -2px;
      }
      .el-progress {
        height: 70px;
        line-height: 80px;
      }
      .title {
        position: absolute;
        color: #fff;
        top: 12px;
        padding-left: 8px;
        border-left: 8px solid #24a6d8;
      }
    }
    .timebox {
      color: #fff;
      height: 50px;
      /*background: #112a40;*/
      margin: 10px;
      background: -webkit-linear-gradient(#112a40, #001220, #112a40);
      background: -o-linear-gradient(#112a40, #001220, #112a40);
      background: -moz-linear-gradient(#112a40, #001220, #112a40);
      background: linear-gradient(#112a40, #001220, #112a40);
      position: relative;
      border-radius: 2px;
      padding: 10px 15px;
      border: 2px solid #222;
      .time-title {
        float: left;
        width: 33.333%;
        line-height: 28px;
        .time-name {
          padding-left: 8px;
          border-left: 8px solid #24a6d8;
        }
      }
      .time-title:nth-child(2) {
        text-align: center;
      }
      .time-title:last-child {
        text-align: right;
      }
    }
    .stagebox{
      color: #fff;
      height: 122px;
      margin: 10px;
      background: -webkit-linear-gradient(#112a40, #001220, #112a40);
      background: -o-linear-gradient(#112a40, #001220, #112a40);
      background: -moz-linear-gradient(#112a40, #001220, #112a40);
      background: linear-gradient(#112a40, #001220, #112a40);
      position: relative;
      border-radius: 2px;
      padding: 10px 15px;
      border: 2px solid #222;
      .stage-name{
        padding-left: 8px;
        border-left: 8px solid #24a6d8;
      }
      .panel-btn{
        display: inline-block;
        width: 25px;
        height: 13px;
        border: 1px solid #4978ac;
        vertical-align: top;
        border-radius: 2px;
      }
      .statespan-finish{
        color: #67C23A;
        .panel-btn{
          background: #000;
        }
      }
      .statespan-running{
        margin-left:5px;
        color:#409EFF;
        .panel-btn{
          background: #103166;
          border:1px solid #4978ac;
        }
      }
      .statespan-nostart{
        margin-left:5px;
        color: #909399;
        .panel-btn{
          display: inline-block;
          width: 25px;
          height: 13px;
          border: 1px dashed #909399;
          vertical-align: top;
          border-radius: 2px;
          background: #112a40;
        }
      }
      .statespan-stop{
        margin-left:5px;
        color: #E6A23C;
        .panel-btn{
          display: inline-block;
          width: 25px;
          height: 13px;
          border: 1px dashed #E6A23C;
          vertical-align: top;
          border-radius: 2px;
          background: #112a40;
        }
      }
      .content-prc .prc-box {
        min-height: 86px;
        overflow: hidden;
      }
      .r_box{
        float: left;
        width: 16.6666666%;
        text-align: center;
        position: relative;
        .r_item_index{
          position: absolute;
          right: 12px;
          top: 12px;
          font-size: 17px;
          color: #909399;
        }
      }
      .r_box p{
        font-size:14px;
        line-height: 25px;
        text-align:left ;
        padding:0px;
        margin:0px;
      }
      .r_item{
        position: relative;
        margin: 14px 4px;
        border: 1px dashed #909399;
        padding: 10px;
        background: #112a40;
      }
      .r_box:first-child .r_item{
        margin-left:0px;
      }
      .r_box:last-child .r_item{
        margin-right:0px;
      }
      .r_box.end .r_item{
        border:1px solid #4978ac;
        background: #000;
        .r_item_index{
          position: absolute;
          right: 12px;
          top: 12px;
          font-size: 17px;
          color: #67C23A;
        }
      }
      .r_box.stop .r_item{
        border:1px dashed #E6A23C;
        background: #000;
        .r_item_index{
          position: absolute;
          right: 12px;
          top: 12px;
          font-size: 17px;
          color: #E6A23C;
        }
      }
      .r_box.active .r_item{
        margin-top:0px;
        background: #103350;
        border:3px solid #4978ac;
        .r_item_index{
          position: absolute;
          right: 12px;
          top: 12px;
          font-size: 17px;
          color: #409EFF;
        }
      }
      .r_finish .r_num{
        color:#efefef;
      }
      .r_item_index{
        position: absolute;
        right: 12px;
        top: 12px;
        font-size: 17px;
        color: #09c;
      }
      .r_isfinish{
        color:#67C23A;
      }
      .r_running{
        color:#409EFF;
      }
      .r_stop{
        color:#E6A23C;
      }
      .r_nostart{
        color:#909399;
      }
      .r_box-sanjiao{
        width: 18px;
        height: 18px;
        position: absolute;
        bottom: -15px;
        margin: auto;
        left: 0;
        right: 0;
        border-top: solid 10px #24a6d8;
        border-left: solid 10px rgba(0,0,0,0);
        border-right: solid 10px rgba(0,0,0,0);
        border-bottom: solid 10px rgba(0,0,0,0);
      }
    }
    .content{
      margin: 10px;
      margin-top:13px;
      background: -webkit-linear-gradient(#112a40, #001220, #112a40);
      background: -o-linear-gradient(#112a40, #001220, #112a40);
      background: -moz-linear-gradient(#112a40, #001220, #112a40);
      background: linear-gradient(#112a40, #001220, #112a40);
      position: relative;
      border-radius: 2px;
      padding: 10px 15px;
      border: 2px solid #222;
      position: absolute;
      right: 0px;
      left: 0px;
      bottom: 0px;
      top:262px;
      color:#fff;
      overflow: hidden;
      .title{
        padding-left: 8px;
        border-left: 8px solid #24a6d8;
      }
      .panel-btn{
        display: inline-block;
        width: 25px;
        height: 13px;
        border: 1px solid #4978ac;
        vertical-align: top;
        border-radius: 2px;
      }
      .statespan-finish{
        color: #67C23A;
        .panel-btn{
          background: #000;
        }
      }
      .statespan-running{
        margin-left:5px;
        color:#409EFF;
        .panel-btn{
          background: #103166;
          border:1px solid #4978ac;
        }
      }
      .statespan-nostart{
        margin-left:5px;
        color: #909399;
        .panel-btn{
          display: inline-block;
          width: 25px;
          height: 13px;
          border: 1px dashed #909399;
          vertical-align: top;
          border-radius: 2px;
          background: #112a40;
        }
      }
      /*跳过*/
      .statespan-skip{
        margin-left:5px;
        color: #33FFFF;
        .panel-btn{
          display: inline-block;
          width: 25px;
          height: 13px;
          border: 1px solid #33FFFF;
          vertical-align: top;
          border-radius: 2px;
          background: #112a40;
        }
      }
      /*终止*/
      .statespan-stop{
        margin-left:5px;
        color: #E6A23C;
        .panel-btn{
          display: inline-block;
          width: 25px;
          height: 13px;
          border: 1px dashed #E6A23C;
          vertical-align: top;
          border-radius: 2px;
          background: #112a40;
        }
      }
      /*异常*/
      .statespan-error{
        margin-left:5px;
        color: #FF0066;
        .panel-btn{
          display: inline-block;
          width: 25px;
          height: 13px;
          border: 1px dashed #FF0066;
          vertical-align: top;
          border-radius: 2px;
          background: #112a40;
        }
      }
      /*暂停*/
      .statespan-suspend{
        margin-left:5px;
        color: #F56C6C;
        .panel-btn{
          display: inline-block;
          width: 25px;
          height: 13px;
          border: 1px dashed #F56C6C;
          vertical-align: top;
          border-radius: 2px;
          background: #112a40;
        }
      }
      .content-process{
        position: absolute;
        right: 15px;
        left: 15px;
        top: 50px;
        overflow-y: auto;
        overflow-x: hidden;
        height: 90%;
        .step-box{
          margin: 0px 24px 220px 0px;
          position: relative;
          .step-title{
            border-radius: 2px;
            font-size: 12px;
            line-height: 20px;
            padding: 10px;
            text-align: center;
          }
          i{
            position: absolute;
            top: 12px;
            right: -20px;
            color:#24a6d8;
          }

          /*完成*/
          .is-finish-box{
            background: #000;
            border:1px solid #4978ac;
            color:#67C23A;
          }
          /*执行中*/
          .is-running-box{
            background: #103166;
            border: 1px solid #4978ac;
            color:#4978ac;
          }
          /*跳过*/
          .is-skip-box{
            border: 1px solid #33FFFF;
            color:#33FFFF;
          }
          /*暂停*/
          .is-suspend-box{
            border: 1px dashed #F56C6C;
            color:#F56C6C;
          }
          /*终止*/
          .is-stop-box{
            border: 1px dashed #E6A23C;
            color:#E6A23C;
          }
          /*异常*/
          .is-error-box{
            border: 1px dashed #FF0066;
            color:#FF0066;
          }
          /*未执行*/
          .is-nostart-box{
            border: 1px dashed #909399;
            background: #112a40;
            color:#909399;
          }

          .info-box{
            position: absolute;
            overflow: hidden;
            width: 100%;
            height: 200px;
            .info-icon{
              position: absolute;
              color: #24a6d8;
              top: 2px;
              text-align: center;
              margin: auto;
              left: 0;
              right: 0px;
            }
            .info-item{
              position: absolute;
              top: 22px;
              border:1px solid #99CCFF;
              background: -webkit-linear-gradient(#112a40, #001220, #112a40);
              background: -o-linear-gradient(#112a40, #001220, #112a40);
              background: -moz-linear-gradient(#112a40, #001220, #112a40);
              background: linear-gradient(#112a40, #001220, #112a40);
              padding:2px 5px;
              font-size:10px;
              overflow: hidden;
              width: 100%;
              overflow-y: auto;
              height: 174px;
              .item-list{
                border-bottom:1px dashed #99CCFF;
                margin-top: 6px;
                padding-bottom: 3px;
                line-height: 16px;
                div{
                  min-height: 16px;
                }
              }
              .item-list:last-child{
                border-bottom:none;
              }
              .item-list div:last-child{
                margin-left: 15px;
                text-align: right;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .is-detail{
                overflow: inherit !important;
                text-overflow: inherit !important;
                text-align: left !important;
                white-space: inherit !important;
              }
            }

          }
        }
      }
    }
  }
</style>
