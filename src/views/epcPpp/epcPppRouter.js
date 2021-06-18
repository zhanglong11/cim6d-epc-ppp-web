// EpcPpp路由管理

import { contractRouter } from './contract/router' // 合同管理
import { homeRouter } from './home/router' // 党建管理
import modelManage from './modelManage/router' // 模型管理
import documentManage from './documentManage/router' // 模型管理
import invesment from './investment/router' // 投资管理
import quality from './quality/router' //潜江质量管理
import safety from './safety/router' //潜江安全管理
import schedule from './schedule/router' //进度管理
import ccp from './ccp/router' // 党建管理
import infoManage from './infoManage/router' // 信息化管理
import { workflowRouter } from './workflow/router' // 工作流
import { noticeRouter } from './notice/router' // 公告路由
import monitor from './monitoring/router' // 设备监控
// import decision from './decision/router' // 决策管理
import InitProject from './decision/initProject'
import shell from '@/utils/shell'
import { maintenanceRouter } from './maintenance/router' // 运营维护
import Layout from '@/layout'
import Development from './maintenance/development'

import { initProject, processProject } from './decision/router'

export const epcPppRouter = [
  {
    path: '/decisionEpcPpp',
    name: 'DecisionEpcPpp',
    component: Layout,
    meta: { title: '决策阶段', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'planningDesign',
        name: 'PlanningDesign',
        component: Development,
        meta: { title: '规划设计', icon: 'el-icon-data-board' }
      },
      ...initProject, // 立项投资决策
      {
        path: 'schemeDesign',
        name: 'SchemeDesign',
        component: Development,
        meta: { title: '方案设计', icon: 'el-icon-data-analysis' }
      },
      {
        path: 'feasibilityStudy',
        name: 'FeasibilityStudy',
        component: Development,
        meta: { title: '可行性研究', icon: 'el-icon-brush' }
      },
      {
        path: 'postEvaluation',
        name: 'DecisionEpcPppPostEvaluation',
        component: Development,
        meta: { title: '后评价', icon: 'el-icon-chat-line-square' }
      }
    ]
  },
  {
    path: '/buildStage',
    name: 'BuildStage',
    component: Layout,
    meta: { title: '建设阶段', icon: 'el-icon-office-building' },
    children: [
      ...homeRouter,
      ...noticeRouter,
      {
        path: 'constructionAndApproval',
        name: 'ConstructionAndApproval',
        component: Development,
        meta: { title: '报建报批', icon: 'el-icon-coordinate' }
      },
      {
        path: 'constructionSite',
        name: 'ConstructionSite',
        component: shell('ConstructionSite'),
        meta: { title: '施工现场管理', icon: 'el-icon-data-analysis' },
        children: [quality, safety, ...schedule, modelManage, ...monitor]
      },
      ...contractRouter,
      invesment,
      {
        path: 'constructionPeriod',
        name: 'ConstructionPeriod',
        component: Development,
        meta: { title: '工期', icon: 'el-icon-time' }
      },
      {
        path: 'constructionDesign',
        name: 'ConstructionDesign',
        component: shell('ConstructionDesign'),
        meta: { title: '设计管理', icon: 'el-icon-magic-stick' },
        children: [
          {
            path: 'initialDesign',
            component: Development,
            name: 'InitialDesign',
            meta: { title: '初步设计' }
          },
          {
            path: 'constructionDrawingDesign',
            component: Development,
            name: 'ConstructionDrawingDesign',
            meta: { title: '施工图设计' }
          },
          {
            path: 'designChanges',
            component: Development,
            name: 'DesignChanges',
            meta: { title: '设计变更' }
          }
        ]
      },
      {
        path: 'engineeringTechnology',
        component: Development,
        name: 'EngineeringTechnology',
        meta: { title: '工程技术管理', icon: 'el-icon-notebook-1' }
      },
      {
        path: 'completionAcceptance',
        component: Development,
        name: 'CompletionAcceptance',
        meta: { title: '竣工验收', icon: 'el-icon-document-checked' }
      },
      {
        path: 'postEvaluation',
        component: Development,
        name: 'BuildStagePostEvaluation',
        meta: { title: '后评价', icon: 'el-icon-chat-line-square' }
      },
      documentManage,
      ...ccp,
      infoManage,
      ...workflowRouter
      // ...maintenanceRouter
    ]
  },
  {
    path: '/operationsStage',
    name: 'OperationsStage',
    component: Layout,
    meta: { title: '运维阶段', icon: 'el-icon-data-line' },
    children: [
      {
        path: 'operationAndMaintenancePlan',
        name: 'OperationAndMaintenancePlan',
        component: Development,
        meta: { title: '运维方案/手册', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'maintenance',
        name: 'Maintenance',
        component: Development,
        meta: { title: '保养维护', icon: 'el-icon-first-aid-kit' }
      },
      {
        path: 'operationAndMaintenanceCost',
        name: 'OperationAndMaintenanceCost',
        component: Development,
        meta: { title: '运维成本', icon: 'el-icon-data-analysis' }
      },
      {
        path: 'operationAndMaintenancePerformance',
        name: 'OperationAndMaintenancePerformance',
        component: Development,
        meta: { title: '运维绩效', icon: 'el-icon-wind-power' }
      },
      {
        path: 'investmentEstimation',
        name: 'InvestmentEstimation',
        component: Development,
        meta: { title: '投资测算', icon: 'el-icon-cpu' }
      },
      {
        path: 'postEvaluation',
        name: 'OperationsStagePostEvaluation',
        component: Development,
        meta: { title: '后评价', icon: 'el-icon-chat-line-square' }
      }
    ]
  }
]
