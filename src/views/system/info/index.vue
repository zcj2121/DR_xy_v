<template>
  <div class="app-container" id="infoTable">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>邮箱配置</span>
      </div>
      <div>
        <el-form :model="form" label-position="right" label-width="105px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱服务器：" prop="name" style="width:94%;">
                <el-input v-model="form.emailServer" placeholder="请输入邮箱服务器"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发件人邮箱：" prop="enabled" style="width:94%;">
                <el-input v-model="form.email" placeholder="请输入发件人邮箱"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱用户名：" prop="name" style="width:94%;">
                <el-input v-model="form.emailName" placeholder="请输入邮箱用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱密码：" prop="enabled" style="width:94%;">
                <el-input v-model="form.password" type="password" placeholder="请输入邮箱密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>短息配置</span>
      </div>
      <div>
        <el-form :model="form" label-position="right" label-width="105px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="网关ID：" prop="name" style="width:94%;">
                <el-input v-model="form.gatewayId" placeholder="请输入网关ID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="串口名称：" prop="enabled" style="width:94%;">
                <el-input v-model="form.postName" placeholder="请输入串口名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="波特率：" prop="name" style="width:94%;">
                <el-input v-model="form.baudRate" placeholder="请输入波特率"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备型号：" prop="enabled" style="width:94%;">
                <el-input v-model="form.version" placeholder="请输入设备型号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="生产厂商：" prop="name" style="width:94%;">
                <el-input v-model="form.firm" placeholder="请输入生产厂商"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="PING码：" prop="enabled" style="width:94%;">
                <el-input v-model="form.ping" placeholder="请输入PING码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <div class="info-box">
      <el-button type="primary" size="medium" class="btn-left-item" :loading="loading" @click="operate">测试验证</el-button>
      <div class="btn-right-item" v-if="statuShow">
        <div>验证状态：</div>
        <i class="fa fa-check is-ok" v-if="true"></i>
        <i class="fa fa-times is-no" v-else></i>
      </div>
    </div>
  </div>
</template>

<script>
  import { getList } from '@/api/seetable'
  export default {
    data() {
      return {
        loading: false,
        statuShow: false,
        form: {
          emailServer: '',
          email: '',
          emailName: '',
          password: '',
          gatewayId: '',
          postName: '',
          baudRate: '',
          version: '',
          firm: '',
          ping: ''
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        getList(this.listQuery).then(response => {
        })
        this.form = {
          emailServer: 'smtp.163.com',
          email: 'abc123@163.com',
          emailName: 'abc123@163.com',
          password: '123456',
          gatewayId: '118.118.118.118',
          postName: '测试123',
          baudRate: '2.8HZ',
          version: '2.05A',
          firm: '测试厂商',
          ping: '123123123'
        }
      },
      operate() {
        const _this = this
        _this.statuShow = false
        _this.loading = true
        setTimeout(function() {
          _this.loading = false
          _this.statuShow = true
        }, 2000)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #infoTable{
    .el-card{
      margin: 20px 20px 20px;
    }
  }
</style>
<style  rel="stylesheet/scss" lang="scss" scoped>
  #infoTable{
    .info-box{
      padding:0px 20px;
      overflow: hidden;
      .btn-left-item{
        float: left;
        margin-left:0px;
      }
      .btn-right-item{
        margin-left:30px;
        font-size:14px;
        float: left;
        line-height: 36px;
        height: 36px;
        div{
          float: left;
        }
        i{
          font-size: 20px;
          float: left;
          height: 36px;
          line-height: 36px;
          margin-left:5px;
        }
        i.is-no{
          color:#F56C6C;
        }
        i.is-ok{
          color:#67C23A;
        }
      }
    }
  }
</style>
