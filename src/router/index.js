import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/seetable',
    hidden: true
  },
  {
    path: '/plans',
    component: Layout,
    redirect: '/plans/plan',
    name: 'plans',
    meta: { title: '预案管理', icon: 'file-text' },
    children: [
      {
        path: 'plan',
        name: 'plan',
        component: () => import('@/views/plans/plan/index'),
        meta: { title: '预案计划', icon: 'file' }
      },
      {
        path: 'plandetail',
        name: 'plandetail',
        component: () => import('@/views/plans/plandetail/index'),
        meta: { title: '预案查看', icon: 'file-image-o' }
      },
      {
        path: 'planaudit',
        name: 'planaudit',
        component: () => import('@/views/plans/planaudit/index'),
        meta: { title: '预案审批', icon: 'file-image-o' }
      },
      {
        path: 'plandrill',
        name: 'plandrill',
        component: () => import('@/views/plans/plandrill/index'),
        meta: { title: '预案演练', icon: 'file-image-o' }
      }
    ]
  },
  {
    path: '/seetable',
    component: Layout,
    redirect: '/seetable/vbs',
    name: 'seetable',
    meta: { title: '灾备资源查看', icon: 'database' },
    children: [
      {
        path: 'vbs',
        name: 'vbs',
        component: () => import('@/views/seetable/vbs/index'),
        meta: { title: 'VBS资源', icon: 'cube' }
      },
      {
        path: 'colony',
        name: 'colony',
        component: () => import('@/views/seetable/colony/index'),
        meta: { title: '集群资源', icon: 'cubes' }
      },
      {
        path: 'recovery',
        name: 'recovery',
        component: () => import('@/views/seetable/recovery/index'),
        meta: { title: '恢复计划管理', icon: 'calendar' }
      }
    ]
  },
  {
    path: '/allocation',
    component: Layout,
    redirect: '/allocation/process',
    name: 'allocation',
    meta: { title: '灾备配置管理', icon: 'cog' },
    children: [
      {
        path: 'process',
        name: 'process',
        component: () => import('@/views/allocation/process/index'),
        meta: { title: '切换流程管理', icon: 'list' }
      },
      {
        path: 'stage',
        name: 'stage',
        component: () => import('@/views/allocation/stage/index'),
        meta: { title: '切换阶段管理', icon: 'list' }
      },
      {
        path: 'step',
        name: 'step',
        component: () => import('@/views/allocation/step/index'),
        meta: { title: '切换步骤管理', icon: 'list' }
      },
      {
        path: 'audit',
        name: 'audit',
        component: () => import('@/views/allocation/audit/index'),
        meta: { title: '切换流程审核', icon: 'list' }
      }
    ]
  },
  {
    path: '/change',
    component: Layout,
    redirect: '/change/orgview',
    name: 'change',
    meta: { title: '灾备切换管理', icon: 'flag' },
    children: [
      {
        path: 'orgview',
        name: 'orgview',
        component: () => import('@/views/change/orgview/index'),
        meta: { title: '指挥组织架构', icon: 'sitemap' }
      },
      {
        path: 'changeaudit',
        name: 'changeaudit',
        component: () => import('@/views/change/changeaudit/index'),
        meta: { title: '执行切换审核', icon: 'sitemap' }
      },
      {
        path: 'execute',
        name: 'execute',
        component: () => import('@/views/change/execute/index'),
        meta: { title: '切换流程执行', icon: 'sitemap' }
      },
      {
        path: 'nottask',
        name: 'nottask',
        component: () => import('@/views/change/nottask/index'),
        meta: { title: '切换待办任务', icon: 'sitemap' }
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/change/history/index'),
        meta: { title: '切换流程执行历史', icon: 'sitemap' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/role',
    name: 'system',
    meta: { title: '系统管理', icon: 'cog' },
    children: [
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理', icon: 'user-secret' }
      },
      {
        path: 'jurisdiction',
        name: 'jurisdiction',
        component: () => import('@/views/system/jurisdiction/index'),
        meta: { title: '权限管理', icon: 'key' }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user/index'),
        meta: { title: '用户管理', icon: 'users' }
      },
      {
        path: 'orgtable',
        name: 'orgtable',
        component: () => import('@/views/system/orgtable/index'),
        meta: { title: '组织架构管理', icon: 'flag-o' }
      },
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/system/info/index'),
        meta: { title: '消息接口配置', icon: 'flag-o' }
      },
      {
        path: 'auditall',
        name: 'auditall',
        component: () => import('@/views/system/auditall/index'),
        meta: { title: '审批流程配置', icon: 'flag-o' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

