import Layout from '@/layout/index'
import shell from '@/utils/shell'
/**
 *
 * hidden: true                   如果设置为true，则项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不始终设置Show，则当项具有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则breadcrumb中不会重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             图标显示在侧栏中,支持/src/icons/svg格式和element-ui icon两种形式
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */
export default {
  path: '/buildStage/investment',
  component: shell('InvestmentEpcPpp'),
  name: 'InvestmentEpcPpp',
  meta: { title: '投资管理', icon: 'el-icon-odometer' },
  children: [
    {
      path: 'investmentMonthly',
      name: 'InvestmentMonthlyEpcPpp',
      component: () => import('../monthly/index'),
      meta: { title: '投资月报' }
    },
    {
      path: 'investmentMonthlyAdd',
      name: 'investmentMonthlyAddEpcPpp',
      hidden: true,
      component: () => import('../monthly/add'),
      meta: { title: '新建', activeMenu: '/buildStage/investment/investmentMonthly' }
    },
    {
      path: 'investmentMonthlyEdit',
      name: 'investmentMonthlyEditEpcPpp',
      hidden: true,
      component: () => import('../monthly/add'),
      meta: { title: '编辑', activeMenu: '/buildStage/investment/investmentMonthly' }
    },
    {
      path: 'investmentMonthlyDetail/:id',
      name: 'investmentMonthlyDetailEpcPpp',
      hidden: true,
      component: () => import('../monthly/Detail'),
      meta: { title: '详情', activeMenu: '/buildStage/investment/investmentMonthly' }
    },
    {
      path: 'investmentConfirmation',
      name: 'InvestmentConfirmationEpcPpp',
      component: () => import('../confirmation/index'),
      meta: { title: '投资确认' }
    },
    {
      path: 'investmentBuildConfirmation/add',
      name: 'InvestmentBuildConfirmationAdd',
      component: () => import('../confirmation/build/edit'),
      hidden: true,
      meta: { title: '新建建设费用确认单', activeMenu: '/buildStage/investment/investmentConfirmation' }
    },
    {
      path: 'investmentBuildConfirmation/:id/edit',
      name: 'InvestmentBuildConfirmationEdit',
      component: () => import('../confirmation/build/edit'),
      hidden: true,
      meta: { title: '编辑建设费用确认单', activeMenu: '/buildStage/investment/investmentConfirmation' }
    },
    {
      path: 'investmentBuildConfirmation/:id/',
      name: 'InvestmentBuildConfirmationDetail',
      component: () => import('../confirmation/build/detail'),
      hidden: true,
      meta: { title: '查看建设费用确认单', activeMenu: '/buildStage/investment/investmentConfirmation' }
    },
    {
      path: 'investmentTotalConfirmation/add',
      name: 'InvestmentTotalConfirmationAdd',
      component: () => import('../confirmation/total/edit'),
      hidden: true,
      meta: { title: '新建总投资确认单', activeMenu: '/buildStage/investment/investmentConfirmation' }
    },
    {
      path: 'investmentTotalConfirmation/:id/edit',
      name: 'InvestmentTotalConfirmationEdit',
      component: () => import('../confirmation/total/edit'),
      hidden: true,
      meta: { title: '编辑总投资确认单', activeMenu: '/buildStage/investment/investmentConfirmation' }
    },
    {
      path: 'investmentTotalConfirmation/:id',
      name: 'InvestmentTotalConfirmationDetail',
      component: () => import('../confirmation/total/detail'),
      hidden: true,
      meta: { title: '查看总投资确认单', activeMenu: '/buildStage/investment/investmentConfirmation' }
    },
    /* {
      path: 'investmentConfirmationAdd',
      name: 'investmentConfirmationAddEpcPpp',
      hidden: true,
      component: () => import('../confirmation/add'),
      meta: { title: '新建', activeMenu: '/buildStage/investment/InvestmentConfirmation' }
    },
    {
      path: 'investmentConfirmationEdit',
      name: 'investmentConfirmationEditEpcPpp',
      hidden: true,
      component: () => import('../confirmation/add'),
      meta: { title: '编辑', activeMenu: '/buildStage/investment/InvestmentConfirmation' }
    },
    {
      path: 'investmentConfirmationDetail/:id',
      name: 'investmentConfirmationDetailEpcPpp',
      hidden: true,
      component: () => import('../confirmation/detail'),
      meta: { title: '详情', activeMenu: '/buildStage/investment/InvestmentConfirmation' }
    },*/
    {
      path: 'processEpcPpp',
      name: 'ProcessEpcPpp',
      component: () => import('../../decision/process'),
      meta: { title: '投资测算' }
    },
    {
      path: 'processEpcPpp/add',
      name: 'ProcessAddEpcPpp',
      component: () => import('../../decision/initProject/edit'),
      hidden: true,
      meta: { title: '新建过程决策', activeMenu: '/buildStage/investment/processEpcPpp' }
    },
    {
      path: 'processEpcPpp/:id/edit',
      name: 'ProcessEditEpcPpp',
      component: () => import('../../decision/initProject/edit'),
      hidden: true,
      meta: { title: '编辑过程决策', activeMenu: '/buildStage/investment/processEpcPpp/process' }
    },
    {
      path: 'processEpcPpp/:id',
      name: 'ProcessDetailEpcPpp',
      component: () => import('../../decision/initProject'),
      hidden: true,
      meta: { title: '过程决策详情', activeMenu: '/buildStage/investment/processEpcPpp/process' }
    },
    {
      path: 'investmentReckon',
      name: 'InvestmentReckonEpcPpp',
      component: () => import('../reckon'),
      meta: { title: '投资估算' }
    },
    {
      path: 'investmentReckonAdd',
      name: 'InvestmentReckonAddEpcPpp',
      hidden: true,
      component: () => import('../reckon/add'),
      meta: { title: '新建投资估算', activeMenu: '/buildStage/investment/investmentReckon/investmentReckon' }
    },
    {
      path: 'investmentReckonEdit/:id',
      name: 'InvestmentReckonEditEpcPpp',
      hidden: true,
      component: () => import('../reckon/add'),
      meta: { title: '编辑投资估算', activeMenu: '/buildStage/investment/investmentReckon/investmentReckon' }
    },
    {
      path: 'investmentReckonDetail/:id',
      name: 'InvestmentReckonDetailEpcPpp',
      hidden: true,
      component: () => import('../reckon/detail'),
      meta: { title: '投资估算详情', activeMenu: '/buildStage/investment/investmentReckon/investmentReckon' }
    },
    {
      path: 'investmentEstimate',
      name: 'InvestmentEstimateEpcPpp',
      component: () => import('../estimate'),
      meta: { title: '投资概算' }
    },
    {
      path: 'investmentEstimateAdd',
      name: 'InvestmentEstimateAddEpcPpp',
      hidden: true,
      component: () => import('../estimate/add'),
      meta: { title: '新建投资概算', activeMenu: '/buildStage/investment/investmentEstimate/investmentEstimate' }
    },
    {
      path: 'investmentEstimateEdit/:id',
      name: 'InvestmentEstimateEditEpcPpp',
      hidden: true,
      component: () => import('../estimate/add'),
      meta: { title: '编辑投资概算', activeMenu: '/buildStage/investment/investmentEstimate/investmentEstimate' }
    },
    {
      path: 'investmentEstimateDetail/:id',
      name: 'InvestmentEstimateDetailEpcPpp',
      hidden: true,
      component: () => import('../estimate/detail'),
      meta: { title: '投资概算详情', activeMenu: '/buildStage/investment/investmentEstimate/investmentEstimate' }
    },
    {
      path: 'investmentBudget',
      name: 'InvestmentBudgetEpcPpp',
      component: () => import('../budget'),
      meta: { title: '施工图预算' }
    },
    {
      path: 'investmentBudgetAdd',
      name: 'InvestmentBudgetAddEpcPpp',
      hidden: true,
      component: () => import('../budget/add'),
      meta: { title: '新建施工图预算', activeMenu: '/buildStage/investment/investmentBudget/investmentBudget' }
    },
    {
      path: 'investmentBudgetEdit/:id',
      name: 'InvestmentBudgetEditEpcPpp',
      hidden: true,
      component: () => import('../budget/add'),
      meta: { title: '编辑施工图预算', activeMenu: '/buildStage/investment/investmentBudget/investmentBudget' }
    },
    {
      path: 'investmentBudgetDetail/:id',
      name: 'InvestmentBudgetDetailEpcPpp',
      hidden: true,
      component: () => import('../budget/detail'),
      meta: { title: '施工图预算详情', activeMenu: '/buildStage/investment/investmentBudget/investmentBudget' }
    }
    // {
    //   path: 'investmentConfirmationAddInterest',
    //   name: 'investmentConfirmationAddInterestEpcPpp',
    //   hidden: true,
    //   component: () => import('../confirmation/addInterest'),
    //   meta: { title: '新建利息确认单', activeMenu: '/buildStage/investment' }
    // },
    //
    // {
    //   path: 'investmentConfirmationAddInvest',
    //   name: 'investmentConfirmationAddInvestEpcPpp',
    //   hidden: true,
    //   component: () => import('../confirmation/addInvest'),
    //   meta: { title: '新建建设投资确认单', activeMenu: '/buildStage/investment' }
    // }
  ]
}
