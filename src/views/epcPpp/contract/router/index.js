/* 合同路由 */
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
export const contractRouter = [
  {
    path: '/buildStage/contract-epcPpp',
    component: shell('EpcPppContract'),
    redirect: '/notice/notice-list',
    name: 'EpcPppContract',
    alwaysShow: false,
    meta: { title: '合同管理', icon: 'el-icon-document' },
    children: [
      {
        path: 'contract-list',
        name: 'EpcPppContractList',
        component: () => import('../index'),
        meta: { title: '合同管理', activeMenu: '/buildStage/contract-epcPpp/contract-list' }
      },
      {
        path: 'add',
        name: 'ContractAdd',
        component: () => import('../edit'),
        meta: { title: '新建', activeMenu: '/buildStage/contract-epcPpp/contract-list' },
        hidden: true
      },
      {
        path: 'detail/:id',
        name: 'detail',
        component: () => import('../detail'),
        meta: { title: '详情', activeMenu: '/buildStage/contract-epcPpp/contract-list' },
        hidden: true
      },
      {
        path: 'edit',
        name: 'ContractEdit',
        component: () => import('../edit'),
        meta: { title: '编辑', activeMenu: '/buildStage/contract-epcPpp/contract-list' },
        hidden: true
      }
    ]
  }
]
