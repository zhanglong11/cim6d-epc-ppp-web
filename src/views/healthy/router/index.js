/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-30
 * @Last Modified by: gengweigang
 * @Desc 健康管理路由
 */

/* 工作台 */
import Layout from '@/layout'
/**
 *
 * hidden: true                   如果设置为true，则项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不始终设置Show，则当项具有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则breadcrumb中不会重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             图标显示在侧栏中,支持/src/icons/svg格式和element-ui icon两种形式
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */
export const healthyRouter = [
  {
    path: '/healthy',
    component: Layout,
    redirect: '/healthy/list',
    name: 'Healthy',
    meta: { title: '健康管理', icon: 'el-icon-odometer' },
    children: [
      {
        path: 'list',
        name: 'HealthyList',
        component: () => import('@/views/healthy/list'),
        meta: { title: '劳务公司列表' }
      },
      {
        path: 'listDetail',
        name: 'HealthyListDetail',
        hidden: true,
        component: () => import('@/views/healthy/listDetail'),
        meta: { title: '劳务公司列表详情', activeMenu: '/healthy/list' }
      },
      {
        path: 'labour-force-list',
        name: 'HealthyLabourForceList',
        component: () => import('@/views/healthy/labour-force-list'),
        meta: { title: '劳务人员列表' }
      },
      {
        path: 'labour-force-details',
        name: 'HealthyLabourForceDetails',
        hidden: true,
        component: () => import('@/views/healthy/labour-force-details'),
        meta: { title: '人员健康信息详情', activeMenu: '/healthy/labour-force-list' }
      },
      {
        path: 'edit-healthy-record',
        name: 'EditHealthyRecord',
        hidden: true,
        component: () => import('@/views/healthy/edit-healthy-record'),
        meta: { title: '编辑健康监测记录', activeMenu: '/healthy/labour-force-list' }
      },
      {
        path: 'healthy-vehicle-statistics',
        name: 'HealthyVehicleStatistics',
        component: () => import('@/views/healthy/vehicle/vehicle-statistics'),
        meta: { title: '各公司备案车辆统计表' }
      },
      {
        path: 'healthy-vehicle-list',
        name: 'HealthyVehicleList',
        hidden: true,
        component: () => import('@/views/healthy/vehicle/vehicle-list'),
        meta: { title: '公司车辆列表', activeMenu: '/healthy/healthy-vehicle-statistics' }
      },
      {
        path: 'add-healthy-vehicle',
        name: 'AddHealthyVehicle',
        hidden: true,
        component: () => import('@/views/healthy/vehicle/add-vehicle'),
        meta: { title: '新增车辆信息', activeMenu: '/healthy/healthy-vehicle-statistics' }
      },
      {
        path: 'edit-healthy-vehicle/:id',
        name: 'EditHealthyVehicle',
        hidden: true,
        component: () => import('@/views/healthy/vehicle/add-vehicle'),
        meta: { title: '编辑车辆信息', activeMenu: '/healthy/healthy-vehicle-statistics' }
      },
      {
        path: 'healthy-vehicle-details',
        name: 'HealthyVehicleDetails',
        hidden: true,
        component: () => import('@/views/healthy/vehicle/vehicle-details'),
        meta: { title: '车辆信息详情', activeMenu: '/healthy/healthy-vehicle-statistics' }
      },
      {
        path: 'edit-vehicle-record',
        name: 'EditHealthyVehicleRecord',
        hidden: true,
        component: () => import('@/views/healthy/vehicle/edit-vehicle-record'),
        meta: { title: '编辑车辆消毒记录', activeMenu: '/healthy/healthy-vehicle-statistics' }
      },
      {
        path: 'disinfection-record-list',
        name: 'HealthyDisinfectionRecordList',
        hidden: true,
        component: () => import('@/views/healthy/disinfection-record/disinfection-record-list'),
        meta: { title: '统一消毒记录', activeMenu: '/healthy/healthy-vehicle-statistics' }
      },
      {
        path: 'add-disinfection-record',
        name: 'HealthyAddDisinfectionRecord',
        hidden: true,
        component: () => import('@/views/healthy/disinfection-record/add-disinfection-record'),
        meta: { title: '新增消毒记录', activeMenu: '/healthy/healthy-vehicle-statistics' }
      },
      {
        path: 'disinfection-record-details',
        name: 'HealthyDisinfectionRecordDetails',
        hidden: true,
        component: () => import('@/views/healthy/disinfection-record/disinfection-record-details'),
        meta: { title: '公司车辆消毒记录', activeMenu: '/healthy/healthy-vehicle-statistics' }
      },
      {
        path: 'edit-disinfection-vehicle-record',
        name: 'EditHealthyDisinfectionRecord',
        hidden: true,
        component: () => import('@/views/healthy/disinfection-record/edit-disinfection-vehicle-record'),
        meta: { title: '编辑消毒记录', activeMenu: '/healthy/healthy-vehicle-statistics' }
      }
    ]
  }
]
