import Layout from '@/layout/index'
import shell from '@/utils/shell'
export default {
  path: '/buildStage/constructionSite/safety',
  component: shell('EpcPppSafety'),
  redirect: '/safety/list',
  name: 'EpcPppSafety',
  meta: { title: '安全文明管理', icon: 'el-icon-umbrella' },
  children: [
    {
      path: 'list',
      name: 'EpcPppSafetyList',
      component: () => import('@/views/epcPpp/safety/index'),
      meta: { title: '安全问题列表' }
    },
    {
      path: 'add',
      name: 'EpcPppSafetyQuestionAdd',
      hidden: true,
      component: () => import('@/views/epcPpp/safety/add'),
      meta: { title: '添加安全文明问题', activeMenu: '/buildStage/constructionSite/safety/list' }
    },
    {
      path: 'detail/:id',
      name: 'EpcPppSafetyQuestionDetail',
      hidden: true,
      component: () => import('@/views/epcPpp/safety/detail'),
      meta: { title: '安全文明问题详情', activeMenu: '/buildStage/constructionSite/safety/list' }
    },
    {
      path: 'analysis',
      name: 'EpcPppSafetyQuestionAnalysis',
      component: () => import('@/views/epcPpp/safety/analysis'),
      meta: { title: '安全问题分析' }
    }
  ]
}
