<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="wrapper-title">
      <img class="title-pic" src="./ico-sz.png" alt="" v-if="!sidebar.opened">
      <span class="title-name" v-else><img src="./ico-sz-other.png" alt=""></span>
    </div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
      <div class="footer-name" :class="{lgWidth: !sidebar.opened}">Copyright © <span>{{(new Date).getFullYear()}}</span> Veritas Technologies LLC. All rights reserved</div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'

export default {
  name: 'layout',
  data() {
    return {
      footerYear: null
    }
  },
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
    background: #ccc;
    /*border-right: 1px solid rgb(48, 65, 86);*/
    .title-pic{
      width: 24px;
      height: 24px;
      vertical-align: sub;
      margin-left: 6px;
      /*position: absolute;*/
      /*left: 8px;*/
      /*top: 14px;*/
    }
    .title-name{
      display: inline-block;
      width: 100%;
      /*margin-left: 2px;*/
      text-align: center;
      img{
        margin-top: 8px;
        width: 66%;
      }
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

