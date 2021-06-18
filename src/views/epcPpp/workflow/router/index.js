// 工作流路由
import Layout from '@/layout/index'
import shell from '@/utils/shell'
export const workflowRouter = [
  {
    name: 'WorkFlow',
    path: '/buildStage/workflow',
    meta: { title: '工作流', icon: 'el-icon-data-line' },
    component: shell('WorkFlow'),
    redirect: '/workflow/model',
    children: [
      {
        path: 'model',
        name: 'WorkflowModel',
        meta: { title: '工作流', icon: 'el-icon-data-line' },
        component: () => import('../model')
      },
      {
        path: 'model/:id',
        name: 'WorkflowModelEdit',
        meta: { title: '模型管理', hiddenLayout: false, activeMenu: '/buildStage/workflow/model' },
        hidden: true,
        component: () => import('../model/$id')
      }
    ]
  }
]
