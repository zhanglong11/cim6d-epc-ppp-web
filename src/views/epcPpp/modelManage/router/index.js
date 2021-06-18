import Layout from '@/layout'
import shell from '@/utils/shell'

export default {
  path: '/buildStage/constructionSite/model-epcPpp',
  name: 'ModelEpcPpp',
  redirect: '/model-epcPpp/modelManage',
  component: shell('ModelEpcPpp'),
  alwaysShow: true,
  meta: { title: 'BIM模型管理', icon: 'el-icon-files' },
  children: [
    {
      path: 'modelManage',
      name: 'ModelManageEpcPpp',
      component: () => import('../index'),
      meta: { title: 'BIM模型管理' }
    }
  ]
}
