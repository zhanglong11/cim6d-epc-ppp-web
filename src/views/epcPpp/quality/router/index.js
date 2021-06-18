import Layout from '@/layout/index'
import shell from '@/utils/shell'
export default {
  path: '/buildStage/constructionSite/quality',
  component: shell('EpcPppQuality'),
  redirect: '/quality/list',
  name: 'EpcPppQuality',
  meta: { title: '质量管理', icon: 'el-icon-magic-stick' },
  children: [
    {
      path: 'list',
      name: 'EpcPppQualityList',
      component: () => import('@/views/epcPpp/quality/index'),
      meta: { title: '质量管理' }
    },
    {
      path: 'add',
      name: 'EpcPppQualityQuestionAdd',
      hidden: true,
      component: () => import('@/views/epcPpp/quality/add'),
      meta: { title: '添加质量问题', activeMenu: '/buildStage/constructionSite/quality/list' }
    },
    {
      path: 'detail/:id',
      name: 'EpcPppQualityQuestionDetail',
      hidden: true,
      component: () => import('@/views/epcPpp/quality/detail'),
      meta: { title: '质量问题详情', activeMenu: '/buildStage/constructionSite/quality/list' }
    },
    {
      path: 'analysis',
      name: 'EpcPppQualityQuestionAnalysis',
      component: () => import('@/views/epcPpp/quality/analysis'),
      meta: { title: '质量问题分析', activeMenu: '/buildStage/constructionSite/quality/list' }
    }
  ]
}
