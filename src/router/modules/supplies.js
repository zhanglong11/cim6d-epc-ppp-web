import Layout from '@/layout'
import shell from '@/utils/shell'
export default {
  path: '/supplies',
  name: 'Supplies',
  component: Layout,
  redirect: '/supplies/equipmentManage/list',
  meta: { title: '物资设备', icon: 'el-icon-umbrella' },
  children: [
    {
      path: 'equipmentManage',
      name: 'EquipmentManage',
      alwaysShow: true,
      component: shell('EquipmentManage'),
      meta: { title: '设备管理' },
      children: [
        {
          path: 'list',
          name: 'EquipmentList',
          component: () => import('@/views/suppliesEquipment/equipmentManage/list'),
          meta: { title: '设备台账' }
        },
        {
          path: 'add',
          name: 'EquipmentAdd',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/equipmentManage/list/edit'),
          meta: { title: '添加', activeMenu: '/supplies/equipmentManage/list' }
        },
        {
          path: 'edit',
          name: 'EquipmentEdit',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/equipmentManage/list/edit'),
          meta: { title: '编辑', activeMenu: '/supplies/equipmentManage/list' }
        },
        {
          path: 'detail',
          name: 'EquipmentDetail',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/equipmentManage/list/detail'),
          meta: { title: '详情', activeMenu: '/supplies/equipmentManage/list' }
        },
        /***设备进退场start***/
        {
          path: 'enterAndExit',
          name: 'EnterAndExit',
          component: () => import('@/views/suppliesEquipment/enterAndExit/index'),
          meta: { title: '设备进退场' }
        },
        {
          path: 'enter',
          name: 'EquipmentEnterItem',
          component: () => import('@/views/suppliesEquipment/enterAndExit/enter'),
          hidden: true,
          meta: { title: '新建进场设备', activeMenu: '/supplies/equipmentManage/enterAndExit' }
        },
        {
          path: 'exit',
          name: 'EquipmentExitOutItem',
          component: () => import('@/views/suppliesEquipment/enterAndExit/exit'),
          hidden: true,
          meta: { title: '设备退场', activeMenu: '/supplies/equipmentManage/enterAndExit' }
        },
        {
          path: 'enterAndExitDetail',
          name: 'EnterAndExitDetail',
          component: () => import('@/views/suppliesEquipment/enterAndExit/detail'),
          hidden: true,
          meta: { title: '设备进退场详情', activeMenu: '/supplies/equipmentManage/enterAndExit' }
        },
        /***设备进退场end***/

        {
          path: 'maintenance',
          name: 'Maintenance',
          component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance'),
          meta: { title: '设备保养与维修' },
          children: [
            {
              path: 'maintenancePlan',
              name: 'MaintenancePlan',
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/plan'),
              meta: { title: '保养计划' }
            },
            {
              path: 'maintenancePlanAdd',
              name: 'MaintenancePlanAdd',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/plan/edit'),
              meta: { title: '添加', activeMenu: '/supplies/equipmentManage/maintenance/maintenancePlan' }
            },
            {
              path: 'maintenancePlanEdit',
              name: 'MaintenancePlanEdit',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/plan/edit'),
              meta: { title: '编辑', activeMenu: '/supplies/equipmentManage/maintenance/maintenancePlan' }
            },
            {
              path: 'maintenancePlanDetail',
              name: 'MaintenancePlanDetail',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/plan/detail'),
              meta: { title: '详情', activeMenu: '/supplies/equipmentManage/maintenance/maintenancePlan' }
            },
            {
              path: 'equipmentMaintenance',
              name: 'EquipmentMaintenance',
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/equipmentMaintenance'),
              meta: { title: '设备保养' }
            },
            {
              path: 'equipmentMaintenanceDetail',
              name: 'EquipmentMaintenanceDetail',
              hidden: true,
              component: () =>
                import('@/views/suppliesEquipment/equipmentManage/maintenance/equipmentMaintenance/detail'),
              meta: { title: '详情', activeMenu: '/supplies/equipmentManage/maintenance/equipmentMaintenance' }
            },
            {
              path: 'equipmentRepair',
              name: 'EquipmentRepair',
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/repair'),
              meta: { title: '设备故障维修' }
            },
            {
              path: 'equipmentRepairAdd',
              name: 'EquipmentRepairAdd',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/repair/edit'),
              meta: { title: '添加', activeMenu: '/supplies/equipmentManage/maintenance/equipmentRepair' }
            },
            {
              path: 'equipmentRepairEdit',
              name: 'EquipmentRepairEdit',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/repair/edit'),
              meta: { title: '编辑', activeMenu: '/supplies/equipmentManage/maintenance/equipmentRepair' }
            },
            {
              path: 'equipmentRepairDetail',
              name: 'EquipmentRepairDetail',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/repair/detail'),
              meta: { title: '详情', activeMenu: '/supplies/equipmentManage/maintenance/equipmentRepair' }
            },
            {
              path: 'equipmentRepairBasicDetail',
              name: 'EquipmentRepairBasicDetail',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentManage/maintenance/repair/basicDetail'),
              meta: { title: '详情', activeMenu: '/supplies/equipmentManage/maintenance/equipmentRepair' }
            }
          ]
        },
        {
          path: 'purchaseList',
          name: 'PurchaseList',
          component: () => import('@/views/suppliesEquipment/equipmentPurchase'),
          meta: { title: '设备采购' }
        },
        {
          path: 'equipmentPurchaseAdd',
          name: 'EquipmentPurchaseAdd',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/equipmentPurchase/edit'),
          meta: { title: '新建设备采购申请' }
        },
        {
          path: 'equipmentPurchaseEdit/:id',
          name: 'EquipmentPurchaseEdit',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/equipmentPurchase/edit'),
          meta: { title: '修改设备采购申请' }
        },
        {
          path: 'equipmentPurchaseDetail/:id',
          name: 'EquipmentPurchaseDetail',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/equipmentPurchase/detail'),
          meta: { title: '设备采购详情' }
        },
        /**设备采购结束**/

        {
          path: 'equipmentRent',
          name: 'EquipmentRent',
          component: shell('EquipmentRent'),
          children: [
            {
              path: 'list',
              name: 'EquipmentRentList',
              component: () => import('@/views/suppliesEquipment/equipmentRent'),
              meta: { title: '设备租赁' }
            },
            {
              path: 'add',
              name: 'EquipmentRentAdd',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentRent/edit'),
              meta: { title: '新建租赁申请', activeMenu: '/supplies/equipmentManage/equipmentRent/list' }
            },
            {
              path: 'edit/:id',
              name: 'EquipmentRentEdit',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentRent/edit'),
              meta: { title: '编辑', activeMenu: '/supplies/equipmentManage/equipmentRent/list' }
            },
            {
              path: 'detail/:id',
              name: 'EquipmentRentDetail',
              hidden: true,
              component: () => import('@/views/suppliesEquipment/equipmentRent/detail'),
              meta: { title: '详情', activeMenu: '/supplies/equipmentManage/equipmentRent/list' }
            }
          ]
        }
      ]
    },
    {
      path: 'materialManage',
      name: 'MaterialManage',
      alwaysShow: true,
      component: () => import('@/views/suppliesEquipment/materialManage'),
      meta: { title: '材料管理' },
      children: [
        {
          path: 'inventory',
          name: 'InventoryList',
          component: () => import('@/views/suppliesEquipment/materialManage/inventory/index'),
          meta: { title: '材料库存' }
        },
        {
          path: 'add-inventory',
          name: 'InventoryAdd',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inventory/add'),
          meta: { title: '新建材料', activeMenu: '/materialManage/inventory' }
        },
        {
          path: 'edit-inventory',
          name: 'InventoryEdit',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inventory/add'),
          meta: { title: '编辑材料', activeMenu: '/materialManage/inventory' }
        },
        {
          path: 'inventory-record',
          name: 'InventoryRecord',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inventory/record'),
          meta: { title: '出入库记录', activeMenu: '/materialManage/inventory' }
        },
        {
          path: 'Procurement',
          name: 'Procurement',
          component: () => import('@/views/suppliesEquipment/materialManage/procurement'),
          meta: { title: '材料采购' }
        },
        {
          path: 'procurementAdd',
          name: 'ProcurementAdd',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/procurement/edit'),
          meta: { title: '新建采购申请', activeMenu: '/supplies/materialManage/procurement' }
        },
        {
          path: 'procurementEdit',
          name: 'ProcurementEdit',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/procurement/edit'),
          meta: { title: '编辑', activeMenu: '/supplies/materialManage/procurement' }
        },
        {
          path: 'procurementDetail',
          name: 'ProcurementDetail',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/procurement/detail'),
          meta: { title: '详情', activeMenu: '/supplies/materialManage/procurement' }
        },
        {
          path: 'ProcurementUser',
          name: 'ProcurementUser',
          component: () => import('@/views/suppliesEquipment/materialManage/procurementUser'),
          meta: { title: '材料使用申请' }
        },
        {
          path: 'procurementUserAdd',
          name: 'ProcurementUserAdd',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/procurementUser/edit'),
          meta: { title: '新建材料使用申请', activeMenu: '/supplies/materialManage/procurementUser' }
        },
        {
          path: 'procurementUserEdit',
          name: 'ProcurementUserEdit',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/procurementUser/edit'),
          meta: { title: '编辑', activeMenu: '/supplies/materialManage/procurementUser' }
        },
        {
          path: 'procurementUserDetail',
          name: 'ProcurementUserDetail',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/procurementUser/detail'),
          meta: { title: '使用申请详情', activeMenu: '/materialManage/procurementUser' }
        },

        {
          path: 'inOutWarehouse',
          name: 'InOutWarehouse',
          component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse'),
          meta: { title: '出入库管理' },
          children: [
            {
              path: 'in',
              name: 'InWarehouse',
              component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse/in'),
              meta: { title: '入库管理' }
            },
            {
              path: 'out',
              name: 'OutWarehouse',
              component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse/out'),
              meta: { title: '出库管理' }
            }
          ]
        },
        {
          path: 'newInWarehouse',
          name: 'NewInWarehouse',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse/newIn'),
          meta: { title: '新建入库单', activeMenu: '/supplies/materialManage/inOutWarehouse/in' }
        },
        {
          path: 'editInWarehouse',
          name: 'ditInWarehouse',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse/newIn'),
          meta: { title: '修改入库单', activeMenu: '/supplies/materialManage/inOutWarehouse/in' }
        },
        {
          path: 'inWarehouseDetail',
          name: 'InWarehouseDetail',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse/inDetail'),
          meta: { title: '入库单详情', activeMenu: '/supplies/materialManage/inOutWarehouse/in' }
        },
        {
          path: 'addOutWarehouse',
          name: 'AddOutWarehouse',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse/addOut'),
          meta: { title: '添加出库信息', activeMenu: '/supplies/materialManage/inOutWarehouse/out' }
        },
        {
          path: 'outWarehouseDetail',
          name: 'OutWarehouseDetail',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse/outDetail'),
          meta: { title: '出库单详情', activeMenu: '/supplies/materialManage/inOutWarehouse/out' }
        },
        {
          path: 'editOutWarehouse',
          name: 'EditOutWarehouse',
          hidden: true,
          component: () => import('@/views/suppliesEquipment/materialManage/inOutWarehouse/addOut'),
          meta: { title: '修改出库信息', activeMenu: '/supplies/materialManage/inOutWarehouse/out' }
        }
      ]
    }
  ]
}
