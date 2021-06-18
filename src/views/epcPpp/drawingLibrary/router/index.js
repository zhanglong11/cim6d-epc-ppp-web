import Layout from '@/layout'

export default {
  path: '/drawing',
  name: 'Drawing',
  redirect: '/drawing/drawingLibrary',
  component: Layout,
  alwaysShow: true,
  meta: { title: '图纸库', icon: 'el-icon-files' },
  children: [
    {
      path: 'drawingLibrary',
      name: 'DrawingLibrary',
      component: () => import('@/views/epcPpp/drawingLibrary'),
      meta: { title: '图纸管理' }
    }
  ]
}
