/**
  任务名称：task#2849 【智慧工地2.0-前端】公告管理》列表、新建、编辑、详情切图及功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/

/* 公告路由 */
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
export const noticeRouter = [
  {
    path: '/buildStage/noticeEpcPpp',
    component: shell('NoticeEpcPpp'),
    redirect: '/noticeEpcPpp/notice-list',
    name: 'NoticeEpcPpp',
    meta: { title: '通知公告', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'notice-list',
        name: 'NoticeListEpcPpp',
        component: () => import('../notice-list'),
        meta: { title: '通知公告' }
      },
      {
        path: 'add-notice',
        name: 'AddNoticeEpcPpp',
        hidden: true,
        component: () => import('../add-notice'),
        meta: { title: '新建公告', activeMenu: '/buildStage/noticeEpcPpp/notice-list' }
      },
      {
        path: 'edit-notice',
        name: 'EditNoticeEpcPpp',
        hidden: true,
        component: () => import('../add-notice'),
        meta: { title: '编辑公告', activeMenu: '/buildStage/noticeEpcPpp/notice-list' }
      }
    ]
  }
]
