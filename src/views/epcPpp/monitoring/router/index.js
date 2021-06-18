// 设备监控路由
import Layout from '@/layout'
import shell from '@/utils/shell'
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
export default [
  {
    path: '/buildStage/constructionSite/equipment-monitoring',
    component: shell('EquipmentMonitoring'),
    redirect: '/equipment-monitoring/list',
    name: 'EquipmentMonitoring',
    meta: { title: '设备监控', icon: 'el-icon-video-camera' },
    children: [
      {
        path: 'list',
        name: 'EquipmentMonitoringList',
        component: () => import('../list'),
        meta: { title: '监控设备列表' }
      },
      {
        path: 'details',
        name: 'EquipmentMonitoringDetails',
        hidden: true,
        component: () => import('../details'),
        meta: { title: '监控记录详情', activeMenu: '/buildStage/constructionSite/equipment-monitoring/list' }
      },
      {
        path: 'add',
        name: 'EquipmentMonitoringAdd',
        hidden: true,
        component: () => import('../add'),
        meta: { title: '新增监控设备', activeMenu: '/buildStage/constructionSite/equipment-monitoring/list' }
      },
      {
        path: 'edit',
        name: 'EquipmentMonitoringEdit',
        hidden: true,
        component: () => import('../add'),
        meta: { title: '修改监控设备', activeMenu: '/buildStage/constructionSite/equipment-monitoring/list' }
      },
      {
        path: 'video-list',
        name: 'EquipmentMonitoringVideoList',
        component: () => import('../video-list'),
        meta: { title: '监控视频查询' }
      },
      {
        path: 'real-time-list',
        name: 'EquipmentMonitoringRealTimeList',
        component: () => import('../real-time-list'),
        meta: { title: '实时监控' }
      }
    ]
  }
]
