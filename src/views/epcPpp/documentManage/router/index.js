import Layout from '@/layout'
import shell from '@/utils/shell'

export default {
  path: '/buildStage/document-epcPpp',
  name: 'DocumentEpcPpp',
  redirect: '/model/modelManage',
  component: shell('DocumentEpcPpp'),
  meta: { title: '资料管理', icon: 'el-icon-document-copy' },
  children: [
    {
      path: 'documentManage',
      name: 'DocumentManageEpcPpp',
      component: () => import('../index'),
      meta: { title: '资料管理' }
    },
    {
      path: 'documentManageDetail',
      name: 'DocumentManageDetailEpcPpp',
      hidden: true,
      component: () => import('../detail'),
      meta: { title: '详情', activeMenu: '/buildStage/document-epcPpp/documentManage' }
    }
  ]
}
