import Layout from '@/layout/index'
import shell from '@/utils/shell'

export default {
  path: '/schedule',
  name: 'Schedule',
  redirect: '/schedule/main/plan',
  component: Layout,
  meta: { title: '进度管理', icon: 'el-icon-s-data' },
  children: [
    {
      path: 'view',
      name: 'ScheduleView',
      component: () => import('@/views/schedule/view'),
      meta: { title: '进度查看' },
      children: []
    },
    {
      path: 'view/add',
      name: 'ScheduleAdd',
      component: () => import('@/views/schedule/view/Add'),
      meta: { title: '新增进度文件' },
      hidden: true
    },
    {
      path: 'bimRelated',
      name: 'ScheduleBimRelated',
      component: () => import('@/views/schedule/bimRelated'),
      meta: { title: '进度关联BIM模型' }
    },
    {
      path: 'analyze',
      name: 'ScheduleAnalyze',
      component: () => import('@/views/schedule/analyze/index'),
      meta: { title: '进度分析' }
    },
    {
      path: 'plan',
      name: 'SchedulePlan',
      component: () => import('@/views/schedule/detail'),
      meta: { title: '施工进度计划', type: 'view', showChangeLogButton: true, showAffectManage: false }
    },
    {
      path: 'plan/:id',
      name: 'SchedulePlanEdit',
      component: () => import('@/views/schedule/detail'),
      hidden: true,
      meta: {
        title: '施工进度计划详情',
        type: 'view',
        showChangeLogButton: true,
        showAffectManage: true,
        showAudit: true
      }
    },
    {
      path: 'planChange',
      name: 'SchedulePlanChange',
      component: () => import('@/views/schedule/planChange'),
      meta: { title: '施工进度计划变更' }
    },
    {
      path: 'changeLog',
      name: 'SchedulePlanChangeLog',
      component: () => import('@/views/schedule/planChange'),
      meta: { title: '变更记录', activeMenu: '/schedule/planChange' },
      hidden: true
    },
    {
      path: 'changeLog/new',
      name: 'SchedulePlanChangeLogAdd',
      component: () => import('@/views/schedule/detail'),
      meta: {
        title: '新建变更记录',
        type: 'edit',
        showAffectManage: true,
        showChangeReason: true,
        activeMenu: '/schedule/planChange'
      },
      hidden: true
    },
    {
      path: 'changeLog/:id/edit',
      name: 'SchedulePlanChangeLogEdit',
      component: () => import('@/views/schedule/detail'),
      meta: {
        title: '变更记录编辑',
        type: 'edit',
        showAffectManage: true,
        showAuditStatus: true,
        showAudit: false,
        showChangeReason: true,
        activeMenu: '/schedule/planChange'
      },
      hidden: true
    },
    {
      path: 'changeLog/:id/detail',
      name: 'SchedulePlanChangeLogDetail',
      component: () => import('@/views/schedule/detail'),
      meta: {
        title: '变更记录详情',
        type: 'view',
        showAffectManage: true,
        showAuditStatus: true,
        showAudit: true,
        activeMenu: '/schedule/planChange'
      },
      hidden: true
    },
    {
      path: 'actual',
      name: 'SchedulePlanActual',
      component: () => import('@/views/schedule/detail'),
      meta: { title: '施工实际进度', type: 'view', showProgressControl: true, showFooterBtn: false }
    },
    {
      path: 'writeLog',
      name: 'SchedulePlanWriteLog',
      component: () => import('@/views/schedule/writeLog'),
      meta: { title: '查看填报记录', activeMenu: '/schedule/actual' },
      hidden: true
    },
    {
      path: 'writeLog/new',
      name: 'SchedulePlanWriteLogAdd',
      component: () => import('@/views/schedule/writeLog/$id'),
      meta: { title: '新建填报记录', showAffectManage: true, activeMenu: '/schedule/actual' },
      hidden: true
    },
    {
      path: 'affect',
      name: 'SchedulePlanAffect',
      component: shell('ScheduleAffect'),
      children: [
        {
          path: '',
          name: 'SchedulePlanAffectDetail',
          component: () => import('@/views/schedule/affect'),
          meta: { title: '施工影响管理' }
        },
        {
          path: ':id',
          name: 'SchedulePlanAffectEdit',
          hidden: true,
          meta: { title: '施工影响详情' },
          component: () => import('@/views/schedule/affect/$id.vue')
        }
      ]
    },
    {
      path: 'audit',
      name: 'SchedulePlanAudit',
      meta: { title: '审核' },
      alwaysShow: true,
      hidden: true,
      component: shell('ScheduleAudit'),
      children: [
        {
          path: '',
          name: 'SchedulePlanAuditDetail',
          component: () => import('@/views/schedule/audit'),
          meta: { title: '施工进度计划审核' }
        },
        {
          path: ':id',
          name: 'SchedulePlanAuditEdit',
          component: () => import('@/views/schedule/detail'),
          meta: { title: '施工进度计划审核', type: 'view', showAudit: true, allowAudit: true },
          hidden: true
        }
      ]
    }
  ]
}
