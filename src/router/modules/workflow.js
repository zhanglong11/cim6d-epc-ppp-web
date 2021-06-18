import Layout from '@/layout/index'
export default {
  name: 'WorkFlow',
  path: '/workflow',
  meta: { title: '工作流', icon: 'el-icon-data-line' },
  component: Layout,
  redirect: '/workflow/todo',
  children: [
    {
      path: 'todo',
      name: 'WorkflowTodo',
      meta: { title: '我的待办' },
      component: () => import('@/views/workflow/todo')
    },
    {
      path: 'done',
      name: 'WorkflowDone',
      meta: { title: '我的已办' },
      component: () => import('@/views/workflow/done')
    },
    {
      path: 'mine',
      name: 'WorkflowMine',
      meta: { title: '我发起的' },
      component: () => import('@/views/workflow/mine')
    },
    /*{
      path: 'process',
      name: 'WorkflowProcess',
      meta: { title: '流程管理' },
      component: () => import('@/views/workflow/process')
    },*/
    /*{
      path: 'definition',
      name: 'WorkflowDefinition',
      meta: { title: '已部署的模型' },
      component: () => import('@/views/workflow/definition')
    },*/
    {
      path: 'model',
      name: 'WorkflowModel',
      meta: { title: '模型管理' },
      component: () => import('@/views/workflow/model')
    },
    {
      path: 'model/:id',
      name: 'WorkflowModelEdit',
      meta: { title: '模型管理', hiddenLayout: false, activeMenu: '/workflow/model' },
      hidden: true,
      component: () => import('@/views/workflow/model/$id')
    },
    {
      path: 'form',
      name: 'WorkflowForm',
      meta: { title: '表单列表' },
      component: () => import('@/views/workflow/form')
    },
    {
      path: 'form/new',
      name: 'WorkflowFormAdd',
      meta: { title: '新建表单' },
      component: () => import('@/views/workflow/form/$id'),
      hidden: true
    },
    {
      path: 'form/:id',
      name: 'WorkflowFormEdit',
      meta: { title: '详情', hiddenLayout: true },
      component: () => import('@/views/workflow/form/$id'),
      hidden: true
    },
    {
      path: 'arg',
      name: 'WorkflowArg',
      meta: { title: '参数管理' },
      component: () => import('@/views/workflow/arg')
    }
  ]
}
