/*
 * @Description:合同管理
 * @Author:
 * @Date: 2020-01-09 11:46:02
 */
import Layout from '@/layout/index'

export default {
  path: '/contract',
  redirect: '/contract/contractManage',
  name: 'Contract',
  component: Layout,
  meta: { title: '合同管理', icon: 'el-icon-document' },
  children: [
    // {
    //   path: 'manage',
    //   name: 'Manage',
    //   component: () => import('@/views/contract/manage'),
    //   meta: { title: '合同管理' },
    //   children: []
    // },
    {
      path: 'contractManage',
      name: 'ContractManage',
      component: () => import('@/views/contract/contractManage'),
      meta: { title: '合同管理' }
    },
    {
      path: 'addContract',
      name: 'ContractAdd',
      hidden: true,
      component: () => import('@/views/contract/contractManage/ContractAdd'),
      meta: { title: '新建合同', activeMenu: '/contract/contractManage' }
    },
    {
      path: 'editContract',
      name: 'ContractEdit',
      hidden: true,
      component: () => import('@/views/contract/contractManage/ContractAdd'),
      meta: { title: '编辑合同', activeMenu: '/contract/contractManage' }
    },
    {
      path: 'detail/:id',
      name: 'ContractDetail',
      hidden: true,
      component: () => import('@/views/contract/contractManage/Detail'),
      meta: { title: '合同详情', activeMenu: '/contract/contractManage' }
    },
    {
      path: 'contractListDisintegration/:id',
      name: 'ContractListDisintegration',
      hidden: true,
      component: () => import('@/views/contract/contractManage/ContractListDisintegration'),
      meta: { title: '合同清单分解', activeMenu: '/contract/contractManage' }
    },
    /**
     任务名称：TASK#2746/合同管理->清单关联
     开发人员：崔洛宜
     日期：2020-03-27
     任务类型：遗漏页面
     **/
    {
      path: 'relateOrderList/:id',
      name: 'RelateOrderList',
      hidden: true,
      component: () => import('@/views/contract/contractManage/RelateOrderList'),
      meta: { title: '专业分包清单关联', activeMenu: '/contract/contractManage' }
    },
    {
      path: 'relateOrderListBuy/:id',
      name: 'RelateOrderListBuy',
      hidden: true,
      component: () => import('@/views/contract/contractManage/RelateOrderListB'),
      meta: { title: '采购清单关联', activeMenu: '/contract/contractManage' }
    },
    {
      path: 'relateOrderListBorrow/:id',
      name: 'RelateOrderListBorrow',
      hidden: true,
      component: () => import('@/views/contract/contractManage/RelateOrderListB'),
      meta: { title: '租赁清单关联', activeMenu: '/contract/contractManage' }
    },
    {
      path: 'contractMeasurementPayment',
      name: 'ContractMeasurementPayment',
      component: () => import('@/views/contract/contractMeasurementPayment'),
      meta: { title: '合同计量与支付', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'prepayment',
      name: 'Prepayment',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Prepayment'),
      meta: { title: '新建预付款', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'editPrepayment',
      name: 'PrepaymentEdit',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Prepayment'),
      meta: { title: '编辑预付款', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'projectProcess',
      name: 'ProjectProcess',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/ProjectProcess'),
      meta: { title: '新建工程进度款(清单)', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'editProjectProcess',
      name: 'ProjectProcessEdit',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/ProjectProcess'),
      meta: { title: '编辑工程进度款(清单)', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'projectProcessTotal',
      name: 'ProjectProcessTotal',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Prepayment'),
      meta: { title: '新建工程进度款(总价)', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'editProjectProcessTotal',
      name: 'EditProjectProcessTotal',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Prepayment'),
      meta: { title: '编辑工程进度款(总价)', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'finalPayment',
      name: 'FinalPayment',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Prepayment'),
      meta: { title: '新建最终付款', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'editFinalPayment',
      name: 'FinalPaymentEdit',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Prepayment'),
      meta: { title: '编辑最终付款', activeMenu: '/contract/contractMeasurementPayment' }
    },

    {
      path: 'refundDeposit',
      name: 'RefundDeposit',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Prepayment'),
      meta: { title: '新建退款保证金', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'editRefundDeposit',
      name: 'RefundDepositEdit',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Prepayment'),
      meta: { title: '编辑退款保证金', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'addFinancePay',
      name: 'FinancePayAdd',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/FinancePayAdd'),
      meta: { title: '财务支付填报', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'contractMeasurementPaymentDetail',
      name: 'ContractMeasurementPaymentDetail',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/BaseDetail'),
      meta: { title: '预付款详情', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'projectProcessDetail',
      name: 'ProjectProcessDetail',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Detail'),
      meta: { title: '工程进度款详情', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'paymentDetail',
      name: 'PaymentDetail',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/Detail'),
      meta: { title: '计量支付详情', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'finalPaymentDetail',
      name: 'FinalPaymentDetail',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/BaseDetail'),
      meta: { title: '最终付款详情', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'refundDepositDetail',
      name: 'RefundDepositDetail',
      hidden: true,
      component: () => import('@/views/contract/contractMeasurementPayment/BaseDetail'),
      meta: { title: '退还保证金详情', activeMenu: '/contract/contractMeasurementPayment' }
    },
    {
      path: 'contractChange',
      name: 'ContractChange',
      component: () => import('@/views/contract/contractChange'),
      meta: { title: '合同变更', activeMenu: '/contract/contractChange' }
    },
    {
      path: 'addContractChange',
      name: 'ContractChangeAdd',
      hidden: true,
      component: () => import('@/views/contract/contractChange/ContractChangeAdd'),
      meta: { title: '新建合同变更', activeMenu: '/contract/contractChange' }
    },
    {
      path: 'changeContractDetail/:id',
      name: 'ChangeContractDetail',
      hidden: true,
      component: () => import('@/views/contract/contractChange/Detail'),
      meta: { title: '合同变更详情', activeMenu: '/contract/contractChange' }
    },
    {
      path: 'sceneVisa',
      name: 'SceneVisa',
      component: () => import('@/views/contract/sceneVisa'),
      meta: { title: '现场签证', activeMenu: '/contract/sceneVisa' }
    },
    {
      path: 'addSceneVisa',
      name: 'SceneVisaAdd',
      component: () => import('@/views/contract/sceneVisa/SceneVisaAdd'),
      hidden: true,
      meta: { title: '新增现场签证', activeMenu: '/contract/sceneVisa' }
    },
    {
      path: 'sceneVisaDetail/:id',
      name: 'SceneVisaDetail',
      hidden: true,
      component: () => import('@/views/contract/sceneVisa/Detail'),
      meta: { title: '现场签证详情', activeMenu: '/contract/sceneVisa' }
    }
    /* {
      path: 'check',
      name: 'Check',
      component: () => import('@/views/contract/check'),
      meta: { title: '合同审核' },
      children: [
        // {
        //   path: 'contractCheck',
        //   name: 'ContractCheck',
        //   component: () => import('@/views/contract/check/contractCheck'),
        //   meta: { title: '合同审核' }
        // },
        // {
        //   path: 'detail/:id',
        //   name: 'CheckDetail',
        //   hidden: true,
        //   component: () => import('@/views/contract/manage/contractManage/Detail'),
        //   meta: { title: '合同审核', activeMenu: '/contract/check/contractCheck' }
        // },
        /!*{
          path: 'contractMeasurementPaymentCheck',
          name: 'ContractMeasurementPaymentCheck',
          component: () => import('@/views/contract/check/contractMeasurementPaymentCheck'),
          meta: { title: '合同计量与支付审核' }
        },
        {
          path: 'contractMeasurementPaymentCheckDetail',
          name: 'ContractMeasurementPaymentCheckDetail',
          hidden: true,
          component: () => import('@/views/contract/manage/contractMeasurementPayment/BaseDetail'),
          meta: { title: '预付款审核', activeMenu: '/contract/check/contractMeasurementPaymentCheck' }
        },
        {
          path: 'projectProcessCheckDetail/:id',
          name: 'ProjectProcessCheckDetail',
          hidden: true,
          component: () => import('@/views/contract/manage/contractMeasurementPayment/Detail'),
          meta: { title: '工程进度款审核', activeMenu: '/contract/check/contractMeasurementPaymentCheck' }
        },*!/
        {
          path: 'finalPaymentCheckDetail',
          name: 'FinalPaymentCheckDetail',
          hidden: true,
          component: () => import('@/views/contract/manage/contractMeasurementPayment/BaseDetail'),
          meta: { title: '最终付款审核', activeMenu: '/contract/check/contractMeasurementPaymentCheck' }
        },
        {
          path: 'refundDepositCheckDetail',
          name: 'RefundDepositCheckDetail',
          hidden: true,
          component: () => import('@/views/contract/manage/contractMeasurementPayment/BaseDetail'),
          meta: { title: '退还保证金审核', activeMenu: '/contract/check/contractMeasurementPaymentCheck' }
        }
        // {
        //   path: 'contractChangeCheck',
        //   name: 'ContractChangeCheck',
        //   component: () => import('@/views/contract/check/contractChangeCheck'),
        //   meta: { title: '合同变更审核' }
        // },
        // {
        //   path: 'changeContractCheckDetail/:id',
        //   name: 'ChangeContractCheckDetail',
        //   hidden: true,
        //   component: () => import('@/views/contract/manage/contractChange/Detail'),
        //   meta: { title: '合同变更审核', activeMenu: '/contract/check/contractChangeCheck' }
        // },
        // {
        //   path: 'sceneVisaCheck',
        //   name: 'SceneVisaCheck',
        //   component: () => import('@/views/contract/check/sceneVisaCheck'),
        //   meta: { title: '现场签证审核' }
        // },
        // {
        //   path: 'sceneVisaCheckDetail/:id',
        //   name: 'SceneVisaCheckDetail',
        //   hidden: true,
        //   component: () => import('@/views/contract/manage/sceneVisa/Detail'),
        //   meta: { title: '现场签证审核', activeMenu: '/contract/check/sceneVisaCheck' }
        // }
      ]
    }*/
  ]
}
