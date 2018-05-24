<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <div class="right-menu">
      <el-tooltip class="item" effect="dark" content="通知待办" placement="bottom">
        <span class="screenfull" @click="goNottask">
          <el-badge :value="badge" class="item">
            <i class="fa fa-bell"></i>
          </el-badge>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
        <span class="screenfull" @click="screenfullChange">
        <i class="fa fa-arrows-alt"></i>
      </span>
      </el-tooltip>
      <el-dropdown class="avatar-container" placement="bottom-end" trigger="click">
        <div class="avatar-wrapper">
          欢迎您，<span>{{name}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <!--<router-link class="inlineBlock" to="/">-->
          <!--<el-dropdown-item>-->
          <!--首 页-->
          <!--</el-dropdown-item>-->
          <!--</router-link>-->
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退 出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'

  export default {
    data() {
      return {
        screenfullShow: false,
        badge: 0
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'name',
        'executionId'
      ])
    },
    created() {
      this.toCon()
    },
    methods: {
      toCon() {
        if (this.executionId) {
          this.$router.push({ path: '/confirm' })
        }
      },
      screenfullChange() {
        const isPullscreen = fullscreen()
        if (isPullscreen === true) {
          exitFullscreen()
        } else if (isPullscreen === false) {
          requestFullScreen()
        }

        // 是否全屏
        function fullscreen() {
          return document.fullscreen ||
            document.webkitIsFullScreen ||
            document.mozFullScreen ||
            false
        }

        // 进入全屏
        function requestFullScreen() {
          var de = document.documentElement
          if (de.requestFullscreen) {
            de.requestFullscreen()
          } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen()
          } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen()
          }
        }

        // 退出全屏
        function exitFullscreen() {
          var de = document
          if (de.exitFullscreen) {
            de.exitFullscreen()
          } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen()
          } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen()
          }
        }
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      goNottask() {
        this.$router.push({ path: '/change/nottask' })
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-badge__content.is-fixed{
    top: 14px;
    right: 10px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .right-menu {
      float: right;
      height: 100%;
      .screenfull {
        color: #606266;
        cursor: pointer;
        margin: 0 8px;
        /*border: 1px solid #ccc;*/
        /*padding: 2px 4px;*/
        /*border-radius: 2px;*/
        .el-badge__content{
          top: 14px;
          right: 10px;
        }
      }
      .screenfull:hover {
        color: rgb(64, 158, 255);
        border-color: rgb(64, 158, 255);
      }
      .avatar-container {
        height: 50px;
        display: inline-block;
        /*position: absolute;*/
        /*right: 0px;*/
        padding-right: 35px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 0px;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 20px;
            font-size: 12px;

          }
        }
      }
    }
  }

  .el-dropdown-menu {
    .el-dropdown-menu__item {
      width: 100px;
      text-align: center;
      margin-top: 0px;
      border-top: none;
    }
  }
</style>

