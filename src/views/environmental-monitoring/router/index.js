/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-28
 * @Last Modified by: gengweigang
 * @Desc 环境监控路由
 */

/* 工作台 */
import Layout from '@/layout'
import iot from '@/views/iot/router'
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
export const environmentalMonitoringRouter = [
  {
    path: '/environmental-monitoring',
    component: Layout,
    redirect: '/environmental-monitoring/list',
    name: 'EnvironmentalMonitoring',
    meta: { title: '环境监控', icon: 'el-icon-video-camera-solid' },
    children: [
      ...iot
      /*{
        path: 'list',
        name: 'EnvironmentalMonitoringList',
        component: () => import('@/views/environmental-monitoring/list'),
        meta: { title: '传感器列表' }
      },
      {
        path: 'details-a',
        name: 'EnvironmentalMonitoringDetailsA',
        hidden: true,
        component: () => import('@/views/environmental-monitoring/details-a'),
        meta: { title: '传感器数据详情-A' }
      },
      {
        path: 'details-b',
        name: 'EnvironmentalMonitoringDetailsB',
        hidden: true,
        component: () => import('@/views/environmental-monitoring/details-b'),
        meta: { title: '传感器数据详情-B' }
      },
      {
        path: 'add',
        name: 'EnvironmentalMonitoringAdd',
        component: () => import('@/views/environmental-monitoring/add'),
        meta: { title: '新增设备' }
      },
      {
        path: 'edit',
        name: 'EnvironmentalMonitoringEdit',
        hidden: true,
        component: () => import('@/views/environmental-monitoring/add'),
        meta: { title: '修改设备' }
      },
      {
        path: 'equipment-list',
        name: 'EnvironmentalMonitoringEquipmentList',
        component: () => import('@/views/environmental-monitoring/equipment-list'),
        meta: { title: '环境监测设备列表' }
      }*/
    ]
  }
]
