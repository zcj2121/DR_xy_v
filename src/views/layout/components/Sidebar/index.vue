<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // return this.$router.options.routes
      return [
        {
          path: 'seetable',
          name: 'seetable',
          meta: { title: '灾备资源查看', icon: 'database' },
          children: [
            {
              path: 'vbs',
              name: 'vbsTable',
              meta: { title: 'VBS资源', icon: 'cube' }
            },
            {
              path: 'colony',
              name: 'colony',
              meta: { title: '集群资源', icon: 'cubes' }
            }
          ]
        },
        {
          path: 'recoverytable',
          name: 'recoverytable',
          meta: { title: '灾备恢复管理', icon: 'calendar' },
          children: [
            {
              path: 'now',
              name: 'now',
              meta: { title: '恢复管理', icon: 'calendar-minus-o' }
            },
            {
              path: 'history',
              name: 'history',
              meta: { title: '恢复历史', icon: 'calendar-times-o' }
            }
          ]
        },
        {
          path: 'plans',
          name: 'plans',
          meta: { title: '文档管理', icon: 'file-text' },
          children: [
            {
              path: 'plan',
              name: 'plan',
              meta: { title: '文档管理', icon: 'file' }
            },
            {
              path: 'plandetail',
              name: 'plandetail',
              meta: { title: '文档查看', icon: 'file-image-o' }
            }
          ]
        },
        {
          path: 'org',
          name: 'org',
          meta: { title: '组织架构', icon: 'flag' },
          children: [
            {
              path: 'orgtable',
              name: 'orgtable',
              meta: { title: '组织管理', icon: 'flag-o' }
            },
            {
              path: 'orgview',
              name: 'orgview',
              meta: { title: '组织架构视图', icon: 'sitemap' }
            }
          ]
        },
        {
          path: 'system',
          name: 'system',
          meta: { title: '系统管理', icon: 'cog' },
          children: [
            {
              path: 'menu',
              name: 'menu',
              meta: { title: '菜单管理', icon: 'list' }
            },
            {
              path: 'role',
              name: 'role',
              meta: { title: '角色管理', icon: 'user-secret' }
            },
            {
              path: 'jurisdiction',
              name: 'jurisdiction',
              meta: { title: '权限管理', icon: 'key' }
            },
            {
              path: 'user',
              name: 'user',
              meta: { title: '用户管理', icon: 'users' }
            }
          ]
        }
      ]
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>


