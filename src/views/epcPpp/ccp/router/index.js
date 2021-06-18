/* 党建管理 */
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
    path: '/buildStage/ccp',
    component: shell('EpcPppCcp'),
    redirect: '/ccp/home',
    name: 'EpcPppCcp',
    meta: { title: '党建管理', icon: 'el-icon-s-flag' },
    children: [
      {
        path: 'home',
        name: 'EpcPppCcpHome',
        component: () => import('../home'),
        meta: { title: '党建首页' }
      },
      {
        path: 'members',
        name: 'EpcPppCcpMembers',
        component: () => import('../members'),
        meta: { title: '党员管理' }
      },
      {
        path: 'activity',
        name: 'EpcPppCcpActivity',
        component: () => import('../activiti'),
        meta: { title: '党建活动' }
      },
      {
        path: 'news',
        name: 'EpcPppCcpNews',
        component: () => import('../news'),
        meta: { title: '党建要闻' }
      },
      {
        path: 'news/add',
        name: 'EpcPppCcpNewsAdd',
        component: () => import('../news/edit'),
        meta: { title: '新建党建要闻', activeMenu: '/buildStage/ccp/news' },
        hidden: true
      },
      {
        path: 'news/:id',
        name: 'EpcPppCcpNewsEdit',
        component: () => import('../news/edit'),
        meta: { title: '编辑党建要闻', activeMenu: '/buildStage/ccp/news' },
        hidden: true
      },
      {
        path: 'news/detail/:id',
        name: 'EpcPppCcpNewsDetail',
        component: () => import('../news/detail'),
        meta: { title: '党建要闻详情', activeMenu: '/buildStage/ccp/news' },
        hidden: true
      },
      {
        path: 'data',
        name: 'EpcPppCcpData',
        component: () => import('../data'),
        meta: { title: '党建资料' }
      }
    ]
  }
]
