import Vue from 'vue'
import Router from 'vue-router'
// import contract from './modules/contract' // 合同管理
// import drawingLibrary from './modules/drawingLibrary' // 图纸库
// import schedule from './modules/schedule' // 进度管理
// import science from './modules/science' // 技术管理
// import labor from '@/views/labour/router' // 劳务管理
// import { noticeRouter } from '@/views/notice/router' // 公告路由
// import { equipmentMonitoringRouter } from '@/views/equipment-monitoring/router' // 设备监控路由
// import { environmentalMonitoringRouter } from '@/views/iot/router' // 环境监控
import { epcPppRouter } from '@/views/epcPpp/epcPppRouter' // EpcPpp路由管理
// import { healthyRouter } from '@/views/healthy/router' // 健康管理
// import supplies from '@/router/modules/supplies' // 物资与设备管理
/**
   任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
   开发人员：李建敏
   日期：2020-3月-17日
   任务类型：2、复制修改代码 （1行）
   **/
// import workflow from './modules/workflow'
// import model from './modules/model' // BIM模型管理
Vue.use(Router)

// 处理开发路由，不进行权限处理
let developmentRoute = [
  // 开发完毕上线要删除，走权限控制
]
let developmentRouteNames = []
const formatDevelopmentRoute = array => {
  array.map(item => {
    if (!item.name) {
      return
    }
    developmentRouteNames.push(item.name)
    if (item.children) {
      formatDevelopmentRoute(item.children)
    }
  })
}
formatDevelopmentRoute(developmentRoute)
Vue.prototype.$DevelopmentRoute = process.env.NODE_ENV === 'development' ? developmentRouteNames : []

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const constantRoutes = [
  {
    path: '/share',
    // hidden: true,
    component: () => import('@/views/share'),
    hidden: true
  },
  {
    path: '/login',
    // hidden: true,
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/to-admin', // 其他系统token中转页面
    // hidden: true,
    name: 'ToAdmin',
    component: () => import('@/views/to-admin'),
    hidden: true
  },
  {
    path: '/',
    hidden: true,
    redirect: '/buildStage/center',
    component: Layout
  },
  // contract,
  ...epcPppRouter,
  // drawingLibrary,
  // supplies,
  // schedule,
  // science,
  // workflow,
  // ...equipmentMonitoringRouter,
  // ...environmentalMonitoringRouter,
  // ...healthyRouter,
  // model,
  // labor,
  // ...noticeRouter,
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
  {
    path: '*',
    redirect: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({
      y: 0
    }),
    //mode: 'history',
    routes: constantRoutes
  })

const router = createRouter()
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
