export default {
  path: '/science',
  redirect: '/science/drawReview',
  name: 'Science',
  component: Layout,
  meta: { title: '技术管理', icon: 'el-icon-takeaway-box' },
  children: [
    /*{
      path: 'scienceManage',
      name: 'ScienceManage',
      component: () => import('@/views/science/scienceManage'),
      meta: { title: '技术管理' },
      children: [
        {
          path: 'drawReview',
          name: 'DrawReview',
          component: () => import('@/views/science/scienceManage/drawReview'),
          meta: { title: '图纸会审' }
        },
        {
          hidden: true,
          path: 'addDrawReview',
          name: 'DrawReviewAdd',
          component: () => import('@/views/science/scienceManage/drawReview/addDrawReview.vue'),
          meta: { title: '新增图纸会审', activeMenu: '/science/scienceManage/drawReview' }
        },
        {
          hidden: true,
          path: 'editDrawReview/:id',
          name: 'DrawReviewEdit',
          component: () => import('@/views/science/scienceManage/drawReview/addDrawReview.vue'),
          meta: { title: '编辑图纸会审', activeMenu: '/science/scienceManage/drawReview' }
        },
        {
          hidden: true,
          path: 'drawReviewDetail/:id',
          name: 'DrawReviewDetail',
          component: () => import('@/views/science/scienceManage/drawReview/drawReviewDetail.vue'),
          meta: { title: '图纸会审详情', activeMenu: '/science/scienceManage/drawReview' }
        },
        {
          path: 'scienceProject',
          name: 'ScienceProject',
          component: () => import('@/views/science/scienceManage/scienceProject'),
          meta: { title: '技术方案' }
        },
        {
          hidden: true,
          path: 'addScienceProject',
          name: 'ScienceProjectAdd',
          component: () => import('@/views/science/scienceManage/scienceProject/addScienceProject.vue'),
          meta: { title: '新增技术方案', activeMenu: '/science/scienceManage/scienceProject' }
        },
        {
          hidden: true,
          path: 'editScienceProject/:id',
          name: 'ScienceProjectEdit',
          component: () => import('@/views/science/scienceManage/scienceProject/addScienceProject.vue'),
          meta: { title: '编辑技术方案', activeMenu: '/science/scienceManage/scienceProject' }
        },
        {
          hidden: true,
          path: 'scienceProjectDetail/:id',
          name: 'ScienceProjectDetail',
          component: () => import('@/views/science/scienceManage/scienceProject/scienceProjectDetail.vue'),
          meta: { title: '技术方案详情', activeMenu: '/science/scienceManage/scienceProject' }
        },
        {
          path: 'scienceExchange',
          name: 'ScienceExchange',
          component: () => import('@/views/science/scienceManage/scienceExchange'),
          meta: { title: '技术交底' }
        },
        {
          hidden: true,
          path: 'addScienceExchange',
          name: 'ScienceExchangeAdd',
          component: () => import('@/views/science/scienceManage/scienceExchange/addScienceExchange.vue'),
          meta: { title: '新增技术交底', activeMenu: '/science/scienceManage/scienceExchange' }
        },
        {
          hidden: true,
          path: 'editScienceExchange/:id',
          name: 'ScienceExchangeEdit',
          component: () => import('@/views/science/scienceManage/scienceExchange/addScienceExchange.vue'),
          meta: { title: '编辑技术交底', activeMenu: '/science/scienceManage/scienceExchange' }
        },
        {
          hidden: true,
          path: 'scienceExchangeDetail/:id',
          name: 'ScienceExchangeDetail',
          component: () => import('@/views/science/scienceManage/scienceExchange/scienceExchangeDetail.vue'),
          meta: { title: '技术交底详情', activeMenu: '/science/scienceManage/scienceExchange' }
        },
        {
          path: 'measurePurchase',
          name: 'MeasurePurchase',
          component: () => import('@/views/science/scienceManage/measurePurchase'),
          meta: { title: '计量器具采购计划' }
        },
        {
          hidden: true,
          path: 'addMeasurePurchase',
          name: 'MeasurePurchaseAdd',
          component: () => import('@/views/science/scienceManage/measurePurchase/addMeasurePurchase.vue'),
          meta: { title: '新增计量器具采购计划', activeMenu: '/science/scienceManage/measurePurchase' }
        },
        {
          hidden: true,
          path: 'editMeasurePurchase/:id',
          name: 'MeasurePurchaseEdit',
          component: () => import('@/views/science/scienceManage/measurePurchase/addMeasurePurchase.vue'),
          meta: { title: '编辑计量器具采购计划', activeMenu: '/science/scienceManage/measurePurchase' }
        },
        {
          hidden: true,
          path: 'measurePurchaseDetail/:id',
          name: 'MeasurePurchaseDetail',
          component: () => import('@/views/science/scienceManage/measurePurchase/measurePurchaseDetail.vue'),
          meta: { title: '计量器具采购计划详情', activeMenu: '/science/scienceManage/measurePurchase' }
        },
        {
          path: 'measureBook',
          name: 'MeasureBook',
          component: () => import('@/views/science/scienceManage/measureBook'),
          meta: { title: '计量器具台账' }
        },
        {
          hidden: true,
          path: 'addMeasureBook',
          name: 'MeasureBookAdd',
          component: () => import('@/views/science/scienceManage/measureBook/addMeasureBook.vue'),
          meta: { title: '新增计量器具台账', activeMenu: '/science/scienceManage/measureBook' }
        },
        {
          hidden: true,
          path: 'editMeasureBook/:id',
          name: 'MeasureBookEdit',
          component: () => import('@/views/science/scienceManage/measureBook/addMeasureBook.vue'),
          meta: { title: '编辑计量器具台账', activeMenu: '/science/scienceManage/measureBook' }
        },
        {
          hidden: true,
          path: 'measureBookDetail/:id',
          name: 'MeasureBookDetail',
          component: () => import('@/views/science/scienceManage/measureBook/measureBookDetail.vue'),
          meta: { title: '计量器具台账详情', activeMenu: '/science/scienceManage/measureBook' }
        },
        {
          hidden: true,
          path: 'measureBookMeasureCheckDetail/:id',
          name: 'MeasureBookMeasureCheckDetail',
          component: () => import('@/views/science/scienceManage/measureBook/measureCheckDetail.vue'),
          meta: { title: '计量器具检定/校准详情', activeMenu: '/science/scienceManage/measureBook' }
        },
        {
          hidden: true,
          path: 'measureBookMeasureRepairDetail/:id',
          name: 'MeasureBookMeasureRepairDetail',
          component: () => import('@/views/science/scienceManage/measureBook/measureRepairDetail.vue'),
          meta: { title: '计量器具故障维修详情', activeMenu: '/science/scienceManage/measureBook' }
        },
        {
          hidden: true,
          path: 'measureBookMeasureSealDetail/:id',
          name: 'MeasureBookMeasureSealDetail',
          component: () => import('@/views/science/scienceManage/measureBook/measureSealDetail.vue'),
          meta: { title: '计量器具封存详情', activeMenu: '/science/scienceManage/measureBook' }
        },
        {
          hidden: true,
          path: 'measureBookMeasureScrapDetail/:id',
          name: 'MeasureBookMeasureScrapDetail',
          component: () => import('@/views/science/scienceManage/measureBook/measureScrapDetail.vue'),
          meta: { title: '计量器具报废详情', activeMenu: '/science/scienceManage/measureBook' }
        }
      ]
    },*/
    {
      path: 'drawReview',
      name: 'DrawReview',
      component: () => import('@/views/science/scienceManage/drawReview'),
      meta: { title: '图纸会审' }
    },
    {
      hidden: true,
      path: 'addDrawReview',
      name: 'DrawReviewAdd',
      component: () => import('@/views/science/scienceManage/drawReview/addDrawReview.vue'),
      meta: { title: '新增图纸会审', activeMenu: '/science/drawReview' }
    },
    {
      hidden: true,
      path: 'editDrawReview/:id',
      name: 'DrawReviewEdit',
      component: () => import('@/views/science/scienceManage/drawReview/addDrawReview.vue'),
      meta: { title: '编辑图纸会审', activeMenu: '/science/drawReview' }
    },
    {
      hidden: true,
      path: 'drawReviewDetail/:id',
      name: 'DrawReviewDetail',
      component: () => import('@/views/science/scienceManage/drawReview/drawReviewDetail.vue'),
      meta: { title: '图纸会审详情', activeMenu: '/science/drawReview' }
    },
    {
      path: 'scienceProject',
      name: 'ScienceProject',
      component: () => import('@/views/science/scienceManage/scienceProject'),
      meta: { title: '技术方案' }
    },
    {
      hidden: true,
      path: 'addScienceProject',
      name: 'ScienceProjectAdd',
      component: () => import('@/views/science/scienceManage/scienceProject/addScienceProject.vue'),
      meta: { title: '新增技术方案', activeMenu: '/science/scienceProject' }
    },
    {
      hidden: true,
      path: 'editScienceProject/:id',
      name: 'ScienceProjectEdit',
      component: () => import('@/views/science/scienceManage/scienceProject/addScienceProject.vue'),
      meta: { title: '编辑技术方案', activeMenu: '/science/scienceProject' }
    },
    {
      hidden: true,
      path: 'scienceProjectDetail/:id',
      name: 'ScienceProjectDetail',
      component: () => import('@/views/science/scienceManage/scienceProject/scienceProjectDetail.vue'),
      meta: { title: '技术方案详情', activeMenu: '/science/scienceProject' }
    },
    {
      path: 'scienceExchange',
      name: 'ScienceExchange',
      component: () => import('@/views/science/scienceManage/scienceExchange'),
      meta: { title: '技术交底' }
    },
    {
      hidden: true,
      path: 'addScienceExchange',
      name: 'ScienceExchangeAdd',
      component: () => import('@/views/science/scienceManage/scienceExchange/addScienceExchange.vue'),
      meta: { title: '新增技术交底', activeMenu: '/science/scienceExchange' }
    },
    {
      hidden: true,
      path: 'editScienceExchange/:id',
      name: 'ScienceExchangeEdit',
      component: () => import('@/views/science/scienceManage/scienceExchange/addScienceExchange.vue'),
      meta: { title: '编辑技术交底', activeMenu: '/science/scienceExchange' }
    },
    {
      hidden: true,
      path: 'scienceExchangeDetail/:id',
      name: 'ScienceExchangeDetail',
      component: () => import('@/views/science/scienceManage/scienceExchange/scienceExchangeDetail.vue'),
      meta: { title: '技术交底详情', activeMenu: '/science/scienceExchange' }
    },
    {
      path: 'measurePurchase',
      name: 'MeasurePurchase',
      component: () => import('@/views/science/scienceManage/measurePurchase'),
      meta: { title: '计量器具采购计划' }
    },
    {
      hidden: true,
      path: 'addMeasurePurchase',
      name: 'MeasurePurchaseAdd',
      component: () => import('@/views/science/scienceManage/measurePurchase/addMeasurePurchase.vue'),
      meta: { title: '新增计量器具采购计划', activeMenu: '/science/measurePurchase' }
    },
    {
      hidden: true,
      path: 'editMeasurePurchase/:id',
      name: 'MeasurePurchaseEdit',
      component: () => import('@/views/science/scienceManage/measurePurchase/addMeasurePurchase.vue'),
      meta: { title: '编辑计量器具采购计划', activeMenu: '/science/measurePurchase' }
    },
    {
      hidden: true,
      path: 'measurePurchaseDetail/:id',
      name: 'MeasurePurchaseDetail',
      component: () => import('@/views/science/scienceManage/measurePurchase/measurePurchaseDetail.vue'),
      meta: { title: '计量器具采购计划详情', activeMenu: '/science/measurePurchase' }
    },
    {
      path: 'measureBook',
      name: 'MeasureBook',
      component: () => import('@/views/science/scienceManage/measureBook'),
      meta: { title: '计量器具台账' }
    },
    {
      hidden: true,
      path: 'addMeasureBook',
      name: 'MeasureBookAdd',
      component: () => import('@/views/science/scienceManage/measureBook/addMeasureBook.vue'),
      meta: { title: '新增计量器具台账', activeMenu: '/science/measureBook' }
    },
    {
      hidden: true,
      path: 'editMeasureBook/:id',
      name: 'MeasureBookEdit',
      component: () => import('@/views/science/scienceManage/measureBook/addMeasureBook.vue'),
      meta: { title: '编辑计量器具台账', activeMenu: '/science/measureBook' }
    },
    {
      hidden: true,
      path: 'measureBookDetail/:id',
      name: 'MeasureBookDetail',
      component: () => import('@/views/science/scienceManage/measureBook/measureBookDetail.vue'),
      meta: { title: '计量器具台账详情', activeMenu: '/science/measureBook' }
    },
    {
      hidden: true,
      path: 'measureBookMeasureCheckDetail/:id',
      name: 'MeasureBookMeasureCheckDetail',
      component: () => import('@/views/science/scienceManage/measureBook/measureCheckDetail.vue'),
      meta: { title: '计量器具检定/校准详情', activeMenu: '/science/measureBook' }
    },
    {
      hidden: true,
      path: 'measureBookMeasureRepairDetail/:id',
      name: 'MeasureBookMeasureRepairDetail',
      component: () => import('@/views/science/scienceManage/measureBook/measureRepairDetail.vue'),
      meta: { title: '计量器具故障维修详情', activeMenu: '/science/measureBook' }
    },
    {
      hidden: true,
      path: 'measureBookMeasureSealDetail/:id',
      name: 'MeasureBookMeasureSealDetail',
      component: () => import('@/views/science/scienceManage/measureBook/measureSealDetail.vue'),
      meta: { title: '计量器具封存详情', activeMenu: '/science/measureBook' }
    },
    {
      hidden: true,
      path: 'measureBookMeasureScrapDetail/:id',
      name: 'MeasureBookMeasureScrapDetail',
      component: () => import('@/views/science/scienceManage/measureBook/measureScrapDetail.vue'),
      meta: { title: '计量器具报废详情', activeMenu: '/science/measureBook' }
    },
    {
      path: 'audit',
      name: 'Audit',
      hidden: true,
      component: () => import('@/views/science/audit'),
      meta: { title: '审核' },
      children: [
        {
          path: 'scienceProject',
          name: 'ScienceProjectAudit',
          component: () => import('@/views/science/audit/scienceProject'),
          meta: { title: '技术方案审核' }
        },
        {
          hidden: true,
          path: 'auditScienceProject/:id',
          name: 'AuditScienceProject',
          component: () => import('@/views/science/audit/scienceProject/auditScienceProject.vue'),
          meta: { title: '审核技术方案', activeMenu: '/science/audit/scienceProject' }
        },
        {
          hidden: true,
          path: 'auditScienceProjectDetail/:id',
          name: 'AuditScienceProjectDetail',
          component: () => import('@/views/science/audit/scienceProject/scienceProjectDetail.vue'),
          meta: { title: '审核技术方案详情', activeMenu: '/science/audit/scienceProject' }
        },
        {
          path: 'measurePurchase',
          name: 'MeasurePurchaseAudit',
          component: () => import('@/views/science/audit/measurePurchase'),
          meta: { title: '计量器具采购计划审核' }
        },
        {
          hidden: true,
          path: 'auditMeasurePurchase/:id',
          name: 'AuditMeasurePurchase',
          component: () => import('@/views/science/audit/measurePurchase/auditMeasurePurchase.vue'),
          meta: { title: '审核计量器具采购计划', activeMenu: '/science/audit/measurePurchase' }
        },
        {
          hidden: true,
          path: 'auditMeasurePurchaseDetail/:id',
          name: 'AuditMeasurePurchaseDetail',
          component: () => import('@/views/science/audit/measurePurchase/measurePurchaseDetail.vue'),
          meta: { title: '审核计量器具采购计划详情', activeMenu: '/science/audit/measurePurchase' }
        },
        {
          path: 'measureCheck',
          name: 'MeasureCheckAudit',
          component: () => import('@/views/science/audit/measureCheck'),
          meta: { title: '计量器具检定/校准审核' }
        },
        {
          hidden: true,
          path: 'auditMeasureCheck/:id',
          name: 'AuditMeasureCheck',
          component: () => import('@/views/science/audit/measureCheck/auditMeasureCheck.vue'),
          meta: { title: '审核计量器具检定/校准', activeMenu: '/science/audit/measureCheck' }
        },
        {
          hidden: true,
          path: 'auditMeasureCheckDetail/:id',
          name: 'AuditMeasureCheckDetail',
          component: () => import('@/views/science/audit/measureCheck/measureCheckDetail.vue'),
          meta: { title: '审核计量器具检定/校准详情', activeMenu: '/science/audit/measureCheck' }
        },
        {
          path: 'measureRepair',
          name: 'MeasureRepairAudit',
          component: () => import('@/views/science/audit/measureRepair'),
          meta: { title: '计量器具故障维修审核' }
        },
        {
          hidden: true,
          path: 'auditMeasureRepair/:id',
          name: 'AuditMeasureRepair',
          component: () => import('@/views/science/audit/measureRepair/auditMeasureRepair.vue'),
          meta: { title: '审核计量器具故障维修', activeMenu: '/science/audit/measureRepair' }
        },
        {
          hidden: true,
          path: 'auditMeasureRepairDetail/:id',
          name: 'AuditMeasureRepairDetail',
          component: () => import('@/views/science/audit/measureRepair/measureRepairDetail.vue'),
          meta: { title: '审核计量器具故障维修详情', activeMenu: '/science/audit/measureRepair' }
        },
        {
          path: 'measureSeal',
          name: 'MeasureSealAudit',
          component: () => import('@/views/science/audit/measureSeal'),
          meta: { title: '计量器具封存审核' }
        },
        {
          hidden: true,
          path: 'auditMeasureSeal/:id',
          name: 'AuditMeasureSeal',
          component: () => import('@/views/science/audit/measureSeal/auditMeasureSeal.vue'),
          meta: { title: '审核计量器具封存', activeMenu: '/science/audit/measureSeal' }
        },
        {
          hidden: true,
          path: 'auditMeasureSealDetail/:id',
          name: 'AuditMeasureSealDetail',
          component: () => import('@/views/science/audit/measureSeal/measureSealDetail.vue'),
          meta: { title: '审核计量器具封存详情', activeMenu: '/science/audit/measureSeal' }
        },
        {
          path: 'measureScrap',
          name: 'MeasureScrapAudit',
          component: () => import('@/views/science/audit/measureScrap'),
          meta: { title: '计量器具报废审核' }
        },
        {
          hidden: true,
          path: 'auditMeasureScrap/:id',
          name: 'AuditMeasureScrap',
          component: () => import('@/views/science/audit/measureScrap/auditMeasureScrap.vue'),
          meta: { title: '审核计量器具报废', activeMenu: '/science/audit/measureScrap' }
        },
        {
          hidden: true,
          path: 'auditMeasureScrapDetail/:id',
          name: 'AuditMeasureScrapDetail',
          component: () => import('@/views/science/audit/measureScrap/measureScrapDetail.vue'),
          meta: { title: '审核计量器具报废详情', activeMenu: '/science/audit/measureScrap' }
        }
      ]
    }
  ]
}

import Layout from '@/layout/index'
