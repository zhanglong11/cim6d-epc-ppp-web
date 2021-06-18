import Layout from '@/layout/index'
import shell from '@/utils/shell'

export default [
  {
    path: '/buildStage/constructionSite/schedule',
    name: 'EpcPppSchedule',
    redirect: '/schedule/main/plan',
    component: shell('EpcPppSchedule'),
    meta: { title: '进度管理', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'view',
        name: 'EpcPppScheduleView',
        component: () => import('./view'),
        meta: { title: '进度查看' },
        children: []
      },
      {
        path: 'view/add',
        name: 'EpcPppScheduleAdd',
        component: () => import('./view/Add'),
        meta: { title: '新增进度文件' },
        hidden: true
      },
      {
        path: 'view/edit/:id',
        name: 'EpcPppScheduleEdit',
        component: () => import('./view/Add'),
        meta: { title: '更新进度文件' },
        hidden: true
      },
      {
        path: 'bimRelated',
        name: 'EpcPppScheduleBimRelated',
        component: () => import('./bimRelated'),
        meta: { title: '进度关联BIM模型' }
      },
      {
        path: 'analyze',
        name: 'EpcPppScheduleAnalyze',
        component: () => import('./analyze/index'),
        meta: { title: '进度分析' }
      }
    ]
  }
]
