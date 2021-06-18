/*
 * @Description:BIM模型管理
 * @Author:
 * @Date: 2020-02-27
 */
import Layout from '@/layout/index'
import shell from '@/utils/shell'

export default {
  path: '/model',
  name: 'Model',
  redirect: '/model/manage/modelVersion',
  component: Layout,
  meta: { title: 'BIM模型管理', icon: 'el-icon-files' },
  children: [
    // {
    //   path: 'manage',
    //   name: 'Manage',
    //   component: () => import('@/views/model/manage'),
    //   meta: { title: 'BIM模型管理' },
    //   children: [
    //
    //   ]
    // },
    {
      path: 'modelVersion',
      name: 'ModelVersion',
      component: () => import('@/views/model/manage/modelVersion'),
      meta: { title: '模型版本' }
    },
    {
      path: 'modelVersionDetail/:id',
      name: 'ModelVersionDetail',
      hidden: true,
      component: () => import('@/views/model/manage/modelVersion/Detail'),
      meta: { title: '模型版本更新详情', activeMenu: '/model/modelVersion' }
    },
    {
      path: 'modelVersionAdd',
      name: 'ModelVersionAdd',
      hidden: true,
      component: () => import('@/views/model/manage/modelVersion/AddModel'),
      meta: { title: '新增模型版本变更', activeMenu: '/model/modelVersion' }
    },
    {
      path: 'progress',
      name: 'ModelProgress',
      component: () => import('@/views/model/manage/progress'),
      meta: { title: '进度关联' }
    },
    {
      path: 'qualityProblem',
      name: 'ModelQualityProblem',
      component: () => import('@/views/model/manage/qualityProblem'),
      meta: { title: '质量问题关联' }
    },
    {
      path: 'qualityAcceptance',
      name: 'ModelQualityAcceptance',
      component: () => import('@/views/model/manage/qualityAcceptance'),
      meta: { title: '质量验收关联' }
    },
    {
      path: 'securityCheck',
      name: 'ModelSecurityCheck',
      component: () => import('@/views/model/manage/securityCheck'),
      meta: { title: '安全检查关联' }
    },
    {
      path: 'safetyCulture',
      name: 'ModelSafetyCulture',
      component: () => import('@/views/model/manage/safetyCulture'),
      meta: { title: '安全文明检查关联' }
    },
    {
      path: 'inventory',
      name: 'ModelInventory',
      component: () => import('@/views/model/manage/inventory'),
      meta: { title: '清单关联' }
    },
    // {
    //   path: 'audit',
    //   meta: { title: '审核' },
    //   alwaysShow: true,
    //   component: shell('ModelAudit'),
    //   children: [
    //     {
    //       path: '',
    //       component: () => import('@/views/model/audit'),
    //       meta: { title: '模型版本审核' }
    //     },
    //     {
    //       path: 'modelVersionDetail/:id',
    //       name: 'ModelVersionAudit',
    //       hidden: true,
    //       component: () => import('@/views/model/manage/modelVersion/Detail'),
    //       meta: { title: '模型版本更新审核', activeMenu: '/model/audit' }
    //     }
    //   ]
    // }
    {
      path: 'measureCorrelation',
      name: 'ModelMeasureCorrelation',
      component: () => import('@/views/model/manage/measureCorrelation'),
      meta: { title: '实测实量关联' }
    }
  ]
}
