import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

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
  { path: '/login', name: 'login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/author',
    component: Layout,
    redirect: '/author/list',
    name: 'Author',
    meta: { title: '作者專區', icon: ['fas', 'user'] },
    hidden: false,
    children: [
      {
        path: 'list',
        name: 'AuthorList',
        component: () => import('@/views/author/list'),
        meta: { title: '作者列表' },
        hidden: false
      },
      {
        path: 'add',
        name: 'AuthorAdd',
        component: () => import('@/views/author/add'),
        meta: { title: '新增作者' },
        hidden: true
      },
      {
        path: 'edit/:id',
        name: 'AuthorEdit',
        component: () => import('@/views/author/edit'),
        meta: { title: '編輯作者' },
        hidden: true
      }
    ]
  },

  {
    path: '/topic',
    component: Layout,
    redirect: '/topic/category/list',
    name: 'Topic',
    meta: { title: '專題', icon: ['fab', 'linode'] },
    hidden: false,
    children: [
      {
        path: 'category/list',
        name: 'TopicCategoryList',
        component: () => import('@/views/topic/topicCategoryList'),
        meta: { title: '專題分類列表' },
        hidden: false
      },
      {
        path: 'list',
        name: 'TopicList',
        component: () => import('@/views/topic/topicList'),
        meta: { title: '專題列表' },
        hidden: false
      },
      {
        path: 'add',
        name: 'TopicAdd',
        component: () => import('@/views/topic/topicAdd'),
        meta: { title: '新增專題' },
        hidden: true
      },
      {
        path: 'edit/:id',
        name: 'TopicEdit',
        component: () => import('@/views/topic/topicEdit'),
        meta: { title: '編輯專題' },
        hidden: true
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/role/list',
    name: 'Permission',
    meta: { title: '權限管理', icon: ['fas', 'cog'] },
    hidden: false,
    children: [
      {
        path: 'role/list',
        name: 'PermissionRoleList',
        component: () => import('@/views/permission/roleList'),
        meta: { title: '權限群組列表' },
        hidden: false
      },
      {
        path: 'role/add',
        name: 'PermissionRoleAdd',
        component: () => import('@/views/permission/roleAdd'),
        meta: { title: '新增權限群組' },
        hidden: true
      },
      {
        path: 'role/edit/:id',
        name: 'PermissionRoleEdit',
        component: () => import('@/views/permission/roleEdit'),
        meta: { title: '編輯權限群組' },
        hidden: true
      },
      {
        path: 'user/list',
        name: 'PermissionUserList',
        component: () => import('@/views/permission/userList'),
        meta: { title: '使用者列表' },
        hidden: false
      },
      {
        path: 'user/add',
        name: 'PermissionUserAdd',
        component: () => import('@/views/permission/userAdd'),
        meta: { title: '新增使用者' },
        hidden: true
      },
      {
        path: 'user/edit/:id',
        name: 'PermissionUserEdit',
        component: () => import('@/views/permission/userEdit'),
        meta: { title: '編輯使用者' },
        hidden: true
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', // 後端支援可開
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

