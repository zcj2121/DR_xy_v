<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="wrapper-title">
      <img class="title-pic" src="./ico-sz.png" alt="">
      <span class="title-name">XX灾备管理系统</span>
    </div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
      <div class="footer-name" :class="{lgWidth: !sidebar.opened}">Copyright © 2017 版权所有 北京同创永益科技发展有限公司 | 京ICP备 5896664661号</div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

@import "src/styles/mixin.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  .wrapper-title{
    width:180px;
    height:50px;
    color: #fff;
    position: absolute;
    line-height: 50px;
    font-size:18px;
    font-weight: bold;
    text-align: left;
    background: #409eff;
    padding-left: 6px;
    .title-pic{
      width: 24px;
      height: 24px;
      vertical-align: sub;
      /*position: absolute;*/
      /*left: 8px;*/
      /*top: 14px;*/
    }
    .title-name{
      margin-left: 2px;
    }
  }
  .scroll-container.sidebar-container{
    margin-top:49px;
  }
  .footer-name{
    position: fixed;
    bottom: 0px;
    right: 0;
    left: 90px;
    width: 100%;
    overflow: hidden;
    text-align: center;
    display: inline-block;
    color:#555;
    line-height: 30px;
    font-size: 12px;
    border-top:solid 1px #e6e6e6;
    background-color: #fff;
    z-index: 10;
    transition: left 0.3s;
    -moz-transition: left 0.3s;
    -webkit-transition: left 0.3s;
    -o-transition: left 0.3s;
  }
  .footer-name.lgWidth{
    left:36px;
    transition: left 0.3s;
    -moz-transition: left 0.3s;
    -webkit-transition: left 0.3s;
    -o-transition: left 0.3s;
  }
}
</style>

<!--<span v-if="sidebar.opened">XXXX灾备管理系统</span>-->
<!--<img class="title-pic" v-else src="./ico-sz.png" alt="">-->

