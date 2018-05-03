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
        name: 'vbsTable',
        component: () => import('@/views/seetable/vbs/index'),
        meta: { title: 'VBS资源', icon: 'cube' }
      },
      {
        path: 'all',
        name: 'vbsTableAll',
        component: () => import('@/views/seetable/all/index'),
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
        name: 'recoverytablenow',
        component: () => import('@/views/recoverytable/now/index'),
        meta: { title: '恢复管理', icon: 'calendar-minus-o' }
      },
      {
        path: 'now',
        name: 'recoverytablenows',
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
        name: 'recoverytablehistory',
        component: () => import('@/views/recoverytable/history/index'),
        meta: { title: '恢复历史', icon: 'calendar-times-o' }
      },
      {
        path: 'history',
        name: 'recoverytablehistorys',
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
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

