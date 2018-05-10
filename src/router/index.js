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
      }
    ]
  },
  {
    path: '/recoverytable',
    component: Layout,
    redirect: '/recoverytable/now',
    name: 'recoverytable',
    meta: { title: '灾备恢复管理', icon: 'calendar' },
    children: [
      {
        path: 'now',
        name: 'now',
        component: () => import('@/views/recoverytable/now/index'),
        meta: { title: '恢复管理', icon: 'calendar-minus-o' }
      },
      {
        path: 'now',
        name: 'nows',
        component: () => import('@/views/recoverytable/now/detail/index'),
        meta: { title: '恢复管理', icon: 'calendar-minus-o' },
        hidden: true,
        children: [
          {
            path: 'detail',
            name: 'recoverytabledetail',
            meta: { title: '查看', icon: 'calendar-times-o' },
            hidden: true
          }
        ]
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/recoverytable/history/index'),
        meta: { title: '恢复历史', icon: 'calendar-times-o' }
      },
      {
        path: 'history',
        name: 'historys',
        component: () => import('@/views/recoverytable/history/detail/index'),
        meta: { title: '恢复历史', icon: 'calendar-times-o' },
        hidden: true,
        children: [
          {
            path: 'detail',
            name: 'historydetail',
            meta: { title: '查看', icon: 'calendar-times-o' },
            hidden: true
          }
        ]
      }
    ]
  },
  {
    path: '/plans',
    component: Layout,
    redirect: '/plans/plan',
    name: 'plans',
    meta: { title: '文档管理', icon: 'file-text' },
    children: [
      {
        path: 'plan',
        name: 'plan',
        component: () => import('@/views/plans/plan/index'),
        meta: { title: '文档管理', icon: 'file' }
      },
      {
        path: 'plandetail',
        name: 'plandetail',
        component: () => import('@/views/plans/plandetail/index'),
        meta: { title: '文档查看', icon: 'file-image-o' }
      }
    ]
  },
  {
    path: '/org',
    component: Layout,
    redirect: '/org/orgtable',
    name: 'org',
    meta: { title: '组织架构', icon: 'flag' },
    children: [
      {
        path: 'orgtable',
        name: 'orgtable',
        component: () => import('@/views/org/orgtable/index'),
        meta: { title: '组织管理', icon: 'flag-o' }
      },
      {
        path: 'orgview',
        name: 'orgview',
        component: () => import('@/views/org/orgview/index'),
        meta: { title: '组织架构视图', icon: 'sitemap' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/menu',
    name: 'system',
    meta: { title: '系统管理', icon: 'cog' },
    children: [
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/system/menu/index'),
        meta: { title: '菜单管理', icon: 'list' }
      },
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
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

