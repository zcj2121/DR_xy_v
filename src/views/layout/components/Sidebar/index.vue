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
      'sidebar',
      'editMenu'
    ]),
    routes() {
      console.log(this.editMenu)
      // return this.$router.options.routes
      return this.editMenu
      // return [
      //   {
      //     path: 'plans',
      //     name: 'plans',
      //     meta: { title: '预案管理', icon: 'file-text' },
      //     children: [
      //       {
      //         path: 'plan',
      //         name: 'plan',
      //         meta: { title: '预案计划', icon: '' }
      //       },
      //       {
      //         path: 'plandetail',
      //         name: 'plandetail',
      //         meta: { title: '预案查看', icon: '' }
      //       },
      //       {
      //         path: 'planaudit',
      //         name: 'planaudit',
      //         meta: { title: '预案审批', icon: '' }
      //       },
      //       {
      //         path: 'plandrill',
      //         name: 'plandrill',
      //         meta: { title: '预案演练', icon: '' }
      //       }
      //     ]
      //   },
      //   {
      //     path: 'seetable',
      //     name: 'seetable',
      //     meta: { title: '灾备资源查看', icon: 'cube' },
      //     children: [
      //       {
      //         path: 'vbs',
      //         name: 'vbs',
      //         meta: { title: 'VBS资源', icon: '' }
      //       },
      //       {
      //         path: 'colony',
      //         name: 'colony',
      //         meta: { title: '集群资源', icon: '' }
      //       },
      //       {
      //         path: 'recovery',
      //         name: 'recovery',
      //         meta: { title: '恢复计划管理', icon: '' }
      //       }
      //     ]
      //   },
      //   {
      //     path: 'allocation',
      //     name: 'allocation',
      //     meta: { title: '灾备配置管理', icon: 'gears' },
      //     children: [
      //       {
      //         path: 'process',
      //         name: 'process',
      //         meta: { title: '切换流程管理', icon: '' }
      //       },
      //       {
      //         path: 'stage',
      //         name: 'stage',
      //         meta: { title: '切换阶段管理', icon: '' }
      //       },
      //       {
      //         path: 'step',
      //         name: 'step',
      //         meta: { title: '切换步骤管理', icon: '' }
      //       },
      //       {
      //         path: 'audit',
      //         name: 'audit',
      //         meta: { title: '切换流程审核', icon: '' }
      //       }
      //     ]
      //   },
      //   {
      //     path: 'change',
      //     name: 'change',
      //     meta: { title: '灾备切换管理', icon: 'exchange' },
      //     children: [
      //       {
      //         path: 'orgview',
      //         name: 'orgview',
      //         meta: { title: '指挥组织架构', icon: '' }
      //       },
      //       {
      //         path: 'changeaudit',
      //         name: 'changeaudit',
      //         meta: { title: '执行切换审核', icon: '' }
      //       },
      //       {
      //         path: 'execute',
      //         name: 'execute',
      //         meta: { title: '切换流程执行', icon: '' }
      //       },
      //       {
      //         path: 'nottask',
      //         name: 'nottask',
      //         meta: { title: '切换待办任务', icon: '' }
      //       },
      //       {
      //         path: 'history',
      //         name: 'history',
      //         meta: { title: '切换流程执行历史', icon: '' }
      //       }
      //     ]
      //   },
      //   {
      //     path: 'system',
      //     name: 'system',
      //     meta: { title: '系统管理', icon: 'cog' },
      //     children: [
      //       {
      //         path: 'role',
      //         name: 'role',
      //         meta: { title: '角色管理', icon: '' }
      //       },
      //       {
      //         path: 'jurisdiction',
      //         name: 'jurisdiction',
      //         meta: { title: '权限管理', icon: '' }
      //       },
      //       {
      //         path: 'user',
      //         name: 'user',
      //         meta: { title: '用户管理', icon: '' }
      //       },
      //       {
      //         path: 'orgtable',
      //         name: 'orgtable',
      //         meta: { title: '组织架构管理', icon: '' }
      //       },
      //       {
      //         path: 'info',
      //         name: 'info',
      //         meta: { title: '消息接口配置', icon: '' }
      //       },
      //       {
      //         path: 'auditall',
      //         name: 'auditall',
      //         meta: { title: '审批流程配置', icon: '' }
      //       }
      //     ]
      //   }
      // ]
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>


