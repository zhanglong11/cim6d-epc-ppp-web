import Layout from '@/layout'
export default {
  path: '/drawingLibrary',
  name: 'DrawingLibrary',
  component: Layout,
  meta: { title: '图纸库', icon: 'el-icon-magic-stick' },
  children: [
    {
      path: 'drawingList',
      name: 'DrawingLibraryList',
      meta: { title: '图纸库' },
      component: () => import('@/views/measureQuantity/DrawingLibrary/draw')
    },
    {
      path: 'buildList',
      name: 'DrawingLibraryBuildLinkList',
      meta: { title: '建筑结构关联' },
      component: () => import('@/views/measureQuantity/DrawingLibrary/build')
    }
  ]
}
