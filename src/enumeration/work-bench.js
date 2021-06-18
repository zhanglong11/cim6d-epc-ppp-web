/*
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
*/

// 消息类型
const MESSAGE_TYPE = {
  SYSTEM_TYPE: {
    value: 1,
    desc: '系统'
  },
  MEETING_TYPE: {
    value: 2,
    desc: '会议'
  },
  AUTH_TYPE: {
    value: 3,
    desc: '审批'
  },
  TASK_TYPE: {
    value: 4,
    desc: '任务'
  }
}

// 公告类型
const NOTICE_TYPE = {
  SYSTEM: {
    value: 1,
    desc: '系统公告'
  },
  PERSON: {
    value: 2,
    desc: '个人消息'
  }
}

// 审批类型
/**
 * 审批类型修改：兼容精装修项目审批
 * desc：第一个为施工项目，第二个为精装修项目
 * 修改模块：合同模块
 * 新增模块：物资设备，包含施工和精装修（似乎没用到）
 * 开发人员:王晓锋
 * **/

const APPROVAL_TYPE = {
  CONTRACT_MANAGEMENT: {
    value: 'contract_management',
    label: '合同管理',
    desc: 'ContractDetail,ContractDetailSmartDecoration'
  },
  PROJECT_BUDGETER_REPORT: {
    value: 'project_budgeter_report',
    label: '计量与支付-项目预算员报量',
    desc: 'PaymentDetail,PaymentDetailSmartDecoration'
  },
  SUBCONTRACTOR_REPORT: {
    value: 'subcontractor_report',
    label: '计量与支付-分包负责人报量',
    desc: 'PaymentDetail,PaymentDetailSmartDecoration'
  },
  CONTRACT_CHANGE: {
    value: 'contract_change',
    label: '合同变更',
    desc: 'ChangeContractDetail,ChangeContractDetail'
  },
  SITE_VISA: {
    value: 'site_visa',
    label: '现场签证',
    desc: 'SceneVisaDetail,SceneVisaDetail'
  },
  CONTRACT_BUDGET: {
    value: 'contract_budget',
    label: '合同预算',
    desc: 'ContractBudgetDetail,ContractBudgetCheckDetail'
  },
  COST_CALCULATION: {
    value: 'cost_calculation',
    label: '成本测算',
    desc: 'ContractTargetCostBudgetCheckDetail,ContractTargetCostBudgetCheckDetail'
  },
  COST_ACCOUNT: {
    value: 'cost_account',
    label: '成本核算',
    desc: 'ContractCostAccountCheckDetail,ContractCostAccountCheckDetail'
  },
  PROJECT_EXPENSE_ACCOUNT: {
    value: 'project_expense_account',
    label: '项目经费核算',
    desc: 'checkContractProjectsFundingDetail,checkContractProjectsFundingDetail'
  },
  CHECK_PLAN: {
    value: 'check_plan',
    label: '检查计划',
    desc: 'QualityControlCheckPlanDetail,QualityControlCheckPlanDetail'
  },
  ACCEPTANCE_CHECK: {
    value: 'acceptance_check',
    label: '验收申请',
    desc: 'QualityAcceptanceQualityApplyDetail,QualityAcceptanceQualityApplyDetail'
  },
  ACCEPTANCE_RECORD: {
    value: 'acceptance_record',
    label: '验收记录',
    desc: 'CheckRecordAuditDetail,CheckRecordAuditDetail'
  },
  START_APPLY: {
    value: 'start_apply',
    label: '开工申请',
    desc: 'QualityToggleStartDetail,QualityToggleStartDetail'
  },
  RETURN_WORK: {
    value: 'return_work',
    label: '复工',
    desc: 'QualityToggleStopDetail,QualityToggleStopDetail'
  },
  SAFETY_MANAGEMENT: {
    value: 'safety_management',
    label: '安全管理制度',
    desc: 'SafeOrganizationSystemDetail,SafeOrganizationSystemDetail'
  },
  SAFETY_GOAL: {
    value: 'safety_goal',
    label: '安全目标',
    desc: 'SafePlanTargetDetail,SafePlanTargetDetail'
  },
  SAFETY_CIVILIZATION_GOAL: {
    value: 'safety_civilization_goal',
    label: '安全文明目标',
    desc: 'SafePlanCultureDetail,SafePlanCultureDetail'
  },
  SAFETY_PLAN: {
    value: 'safety_plan',
    label: '安全计划',
    desc: 'SafePlanSafePlanDetail,SafePlanSafePlanDetail'
  },
  HAZARD_SOURCE_IDENTIFICATION: {
    value: 'hazard_source_identification',
    label: '危险源',
    desc: 'SafePlanDangerousDetail,SafePlanDangerousDetail'
  },
  SECURITY_LOG: {
    value: 'security_log',
    label: '安全日志',
    desc: 'SafeProcessLogDetail,SafeProcessLogDetail'
  },
  SAFETY_REWARD_PUNISHMENT: {
    value: 'safety_reward_punishment',
    label: '安全奖惩',
    desc: 'SafeProcessToggleDetail,SafeProcessToggleDetail'
  },
  SAFETY_ASSESSMENT: {
    value: 'safety_assessment',
    label: '安全考核',
    desc: 'SafeProcessAuditDetail,SafeProcessAuditDetail'
  },
  SPECIAL_CONSTRUCTION_RECORD: {
    value: 'special_work',
    label: '特种作业施工记录',
    desc: 'SafeProcessSpecialDetail,SafeProcessSpecialDetail'
  },
  /**device.js中的路由，已废弃**/

  NEED_PLAN: {
    value: 'need_plan',
    label: '需用计划',
    desc: 'NeedPlanDetail,NeedPlanDetail'
  },
  PURCHASE_BILL: {
    value: 'purchase_bill',
    label: '采购单',
    desc: 'PurchaseOrderDetail,PurchaseOrderDetail'
  },
  //未验证
  LEASE_PLAN: {
    value: 'lease_plan',
    label: '租赁计划',
    desc: 'LeasePlanDetail,LeasePlanDetail'
  },
  LEASE_BILL: {
    value: 'lease_bill',
    label: '租赁单',
    desc: 'LeaseOrderDetail,LeaseOrderDetail'
  },
  EQUIPMENT_CALIBRATION: {
    value: 'equipment_calibration',
    label: '设备检定',
    desc: 'DocimasyRecordDetail,DocimasyRecordDetail'
  },
  EQUIPMENT_CHECK: {
    value: 'equipment_check',
    label: '设备验收',
    desc: 'CheckRecordDetail,CheckRecordDetail'
  },
  EQUIPMENT_ENTER: {
    value: 'equipment_enter',
    label: '设备进场',
    desc: 'EnterArenaDetail,EnterArenaDetail'
  },
  // EQUIPMENT_FAILURE_MAINTENANCE: {
  //   value: 'equipment_failure_maintenance',
  //   label: '设备故障维修',
  //   desc: 'BreakDownDetail,BreakDownDetail'
  // },
  EQUIPMENT_MAINTENANCE: {
    value: 'equipment_maintenance',
    label: '设备保养',
    desc: 'UpKeepDetail,UpKeepDetail'
  },
  EQUIPMENT_SHUTDOWN: {
    value: 'equipment_shutdown',
    label: '设备停用',
    desc: 'StopUsingDetail,StopUsingDetail'
  },
  EQUIPMENT_EXIT: {
    value: 'equipment_exit',
    label: '设备退场',
    desc: 'OutArenaDetail,OutArenaDetail'
  },
  LEASE_SETTLE_BILL: {
    value: 'lease_settle_bill',
    label: '租赁结算单',
    desc: 'ClosingOrderDetail,ClosingOrderDetail'
  },
  DEPRECIATION_BILL: {
    value: 'depreciation_bill',
    label: '折旧单',
    desc: 'DepreciationOrderDetail,DepreciationOrderDetail'
  },
  SCRAP_BILL: {
    value: 'scrap_bill',
    label: '报废处理单',
    desc: 'ScrapOrderDetail,ScrapOrderDetail'
  },
  RECEIVE_BILL: {
    value: 'receive_bill',
    label: '领料单',
    desc: 'PickOrderDetail,PickOrderDetail'
  },
  /**device.js 结束**/

  //有问题
  CONSTRUCTION_SCHEDULE: {
    value: 'construction_schedule',
    label: '施工进度计划',
    desc: 'SchedulePlanEdit,SchedulePlanEdit'
  },
  GENERAL_PLAN: {
    value: 'general_plan',
    label: '技术方案-一般方案',
    desc: 'ScienceProjectDetail,ScienceProjectDetail'
  },
  SPECIAL_CONSTRUCTION_PLAN: {
    value: 'special_construction_plan',
    label: '技术方案-专项施工方案',
    desc: 'ScienceProjectDetail,ScienceProjectDetail'
  },
  INSTRUMENT_PURCHASE_PLAN: {
    value: 'instrument_purchase_plan',
    label: '计量器具采购计划',
    desc: 'MeasurePurchaseDetail,MeasurePurchaseDetail'
  },
  // MEASURE_INSTRUMENT_LEDGER: {
  //   value: 'measure_instrument_ledger',
  //   label: '计量器具台账',
  //   desc: 'MeasureBookDetail,MeasureBookDetail'
  // },
  SUPPLIER_MANAGEMENT: {
    value: 'supplier_management',
    label: '供应商管理',
    desc: 'ProviderManagementDetails,ProviderManagementDetails'
  },
  SUPPLIER_CHECK: {
    value: 'supplier_check',
    label: '供应商考核',
    desc: 'SubsuppliersDetails,SubsuppliersDetails'
  },
  SUBCONTRACTOR_APPROACH: {
    value: 'subcontractor_approach',
    label: '分包商进场',
    desc: 'SubContractorEnterDetails,SubContractorEnterDetails'
  },
  SUBCONTRACTOR_EXIT: {
    value: 'subcontractor_exit',
    label: '分包商退场',
    desc: 'SubContractorBowOutDetails,SubContractorBowOutDetails'
  },
  MODEL_VERSION_CHANGE: {
    value: 'model_version_change',
    label: '模型版本变更',
    desc: 'ModelVersionDetail,ModelVersionDetail'
  },

  //新添加

  MEASURE_DEVICE_VERIFY: {
    value: 'measure_device_verify',
    label: '计量器检定',
    desc: 'AuditMeasureCheckDetail,AuditMeasureCheckDetail'
  },
  MEASURE_DEVICE_FAULT: {
    value: 'measure_device_fault',
    label: '计量器故障维修',
    desc: 'AuditMeasureRepairDetail,AuditMeasureRepairDetail'
  },
  MEASURE_DEVICE_SEAL: {
    value: 'measure_device_seal',
    label: '计量器封存',
    desc: 'AuditMeasureSealDetail,AuditMeasureSealDetail'
  },
  MEASURE_DEVICE_SCRAP: {
    value: 'measure_device_scrap',
    label: '计量器报废',
    desc: 'AuditMeasureScrapDetail,AuditMeasureScrapDetail'
  },
  MATERIAL_SUPPLY_PLAN: {
    value: 'material_supply_plan',
    label: '甲供计划单',
    desc: 'MaterialPlanListView,MaterialPlanListView'
  },
  MATERIAL_SUPPLY_CONFIRM_BILL: {
    value: 'material_supply_confirm_bill',
    label: '材料确认单',
    desc: 'MaterialConfirmCodeDetail,MaterialConfirmCodeDetail'
  },
  // 新增物资设备审核列表
  MATERIAL_PPROCUREMENT: {
    value: 'material_procurement',
    label: '材料采购',
    desc: 'ProcurementDetail,ProcurementDetailSmartDecoration'
  },
  EQUIPMENT_FAILURE_MAINTENANCE: {
    value: 'equipment_repair',
    label: '设备故障维修与验收',
    desc: 'EquipmentRepairDetail,EquipmentRepairDetailSmartDecoration'
  },
  EQUIPMENT_PPROCUREMENT: {
    value: 'equipment_procurement',
    label: '设备采购',
    desc: 'EquipmentPurchaseDetail,EquipmentPurchaseDetailSmartDecoration'
  },
  EQUIPMENT_RENT: {
    value: 'equipment_rent',
    label: '设备租赁',
    desc: 'EquipmentRentDetail,EquipmentRentDetailSmartDecoration'
  },
  //招采管理
  BIDDING_ANNOUNCEMENT: {
    value: 'bidding_announcement',
    label: '招标公告登记',
    desc: 'TenderDetailEpc,TenderDetailEpc'
  },
  BIDDING_INFORMATION: {
    value: 'bidding_information',
    label: '中标资料登记',
    desc: 'WinningDetailEpc,WinningDetailEpc'
  },
  PROJECT_MEETING: {
    value: 'project_meeting',
    label: '立项会议',
    desc: 'ProjectMeetingDetailEpc,ProjectMeetingDetailEpc'
  },
  // 工程初验
  PROJECT_ACCEPTANCE: {
    value: 'project_acceptance',
    label: '工程初验',
    desc: 'ProjectFirstInspectDetailEpc,ProjectFirstInspectDetailEpc'
  },
  // 竣工验收
  PROJECT_ACCEPTANCE_COMPLETED: {
    value: 'project_acceptance_completed',
    label: '竣工验收',
    desc: 'OverInspectDetailEpc,OverInspectDetailEpc'
  },
  // 工程建设总投资确认单
  INVEST_CONFIRM_BILL: {
    value: 'invest_confirm_bill',
    label: '工程建设总投资确认单',
    desc: 'investmentConfirmationDetailEpcPpp,investmentConfirmationDetailEpcPpp'
  }
}
export default {
  MESSAGE_TYPE,
  APPROVAL_TYPE,
  NOTICE_TYPE
}
