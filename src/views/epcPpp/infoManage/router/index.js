import Layout from '@/layout'
import shell from '@/utils/shell'

export default {
  path: '/buildStage/info-epcPpp',
  name: 'InfoEpcPpp',
  redirect: '/model/constructionDay',
  component: shell('InfoEpcPpp'),
  alwaysShow: true,
  meta: { title: '信息化管理', icon: 'el-icon-s-platform' },
  children: [
    {
      path: 'constructionDay',
      name: 'ConstructionDayEpcPpp',
      component: () => import('../constructionDay'),
      meta: { title: '施工日报' }
    },
    {
      path: 'constructionDayEdit',
      name: 'ConstructionDayEditEpcPpp',
      hidden: true,
      component: () => import('../constructionDay/edit'),
      meta: { title: '编辑', activeMenu: '/buildStage/info-epcPpp/constructionDay' }
    },
    {
      path: 'constructionDayDetail/:id',
      name: 'ConstructionDayDetailEpcPpp',
      hidden: true,
      component: () => import('../constructionDay/detail'),
      meta: { title: '详情', activeMenu: '/buildStage/info-epcPpp/constructionDay' }
    },
    {
      path: 'supervisionDay',
      name: 'SupervisionDayEpcPpp',
      component: () => import('../supervisionDay'),
      meta: { title: '监理日报' }
    },
    {
      path: 'supervisionDayEdit',
      name: 'SupervisionDayEditEpcPpp',
      hidden: true,
      component: () => import('../supervisionDay/edit'),
      meta: { title: '编辑', activeMenu: '/buildStage/info-epcPpp/supervisionDay' }
    },
    {
      path: 'supervisionDayDetail/:id',
      name: 'SupervisionDayDetailEpcPpp',
      hidden: true,
      component: () => import('../supervisionDay/detail'),
      meta: { title: '详情', activeMenu: '/buildStage/info-epcPpp/supervisionDay' }
    },

    {
      path: 'constructionWeek',
      name: 'ConstructionWeekEpcPpp',
      component: () => import('../constructionWeek'),
      meta: { title: '施工周报' }
    },
    {
      path: 'constructionWeekEdit',
      name: 'ConstructionWeekEditEpcPpp',
      hidden: true,
      component: () => import('../constructionWeek/edit'),
      meta: { title: '编辑', activeMenu: '/buildStage/info-epcPpp/constructionWeek' }
    },
    {
      path: 'constructionWeekDetail',
      name: 'ConstructionWeekDetailEpcPpp',
      hidden: true,
      component: () => import('../constructionWeek/detail'),
      meta: { title: '详情', activeMenu: '/buildStage/info-epcPpp/constructionWeek' }
    },
    {
      path: 'supervisionWeek',
      name: 'SupervisionWeekEpcPpp',
      component: () => import('../supervisionWeek'),
      meta: { title: '监理周报' }
    },
    {
      path: 'supervisionWeekEdit',
      name: 'SupervisionWeekEditEpcPpp',
      hidden: true,
      component: () => import('../supervisionWeek/edit'),
      meta: { title: '编辑', activeMenu: '/buildStage/info-epcPpp/supervisionWeek' }
    },
    {
      path: 'supervisionWeekDetail/:id',
      name: 'SupervisionWeekDetailEpcPpp',
      hidden: true,
      component: () => import('../supervisionWeek/detail'),
      meta: { title: '详情', activeMenu: '/buildStage/info-epcPpp/supervisionWeek' }
    },
    {
      path: 'constructionMonth',
      name: 'ConstructionMonthEpcPpp',
      component: () => import('../constructionMonth'),
      meta: { title: '施工单位月报' }
    },
    {
      path: 'constructionMonthAdd',
      name: 'ConstructionMonthAddEpcPpp',
      hidden: true,
      component: () => import('../constructionMonth/edit'),
      meta: { title: '添加', activeMenu: '/buildStage/info-epcPpp/constructionMonth' }
    },
    {
      path: 'constructionMonthEdit/:id',
      name: 'ConstructionMonthEditEpcPpp',
      hidden: true,
      component: () => import('../constructionMonth/edit'),
      meta: { title: '编辑', activeMenu: '/buildStage/info-epcPpp/constructionMonth' }
    },
    {
      path: 'constructionMonthDetail/:id',
      name: 'ConstructionMonthDetailEpcPpp',
      hidden: true,
      component: () => import('../constructionMonth/detail'),
      meta: { title: '月报详情', activeMenu: '/buildStage/info-epcPpp/constructionMonth' }
    },
    {
      path: 'supervisionMonth',
      name: 'SupervisionMonthEpcPpp',
      component: () => import('../supervisionMonth'),
      meta: { title: '监理单位月报' }
    },
    {
      path: 'supervisionMonthAdd',
      name: 'SupervisionMonthAddEpcPpp',
      hidden: true,
      component: () => import('../supervisionMonth/edit'),
      meta: { title: '月报添加', activeMenu: '/buildStage/info-epcPpp/supervisionMonth' }
    },
    {
      path: 'supervisionMonthEdit/:id',
      name: 'SupervisionMonthEditEpcPpp',
      hidden: true,
      component: () => import('../supervisionMonth/edit'),
      meta: { title: '月报编辑', activeMenu: '/buildStage/info-epcPpp/supervisionMonth' }
    },
    {
      path: 'supervisionMonthDetail/:id',
      name: 'SupervisionMonthDetailEpcPpp',
      hidden: true,
      component: () => import('../supervisionMonth/detail'),
      meta: { title: '月报详情', activeMenu: '/buildStage/info-epcPpp/supervisionMonth' }
    }
  ]
}
