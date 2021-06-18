import { construction } from '@/utils/axios'
const { post, get } = construction
export default {
  //合同计量与支付
  addPrepayment: data => {
    return post('/contractMeasurementPayment/add', data)
  },
  updatePrepayment: data => {
    return post('/contractMeasurementPayment/update', data)
  },

  audit: id => post(`/contractMeasurementPayment/progressPayment/${id}/submitAudit`, {}),

  // 下一步
  addNext: id => {
    return post(`/contractMeasurementPayment/${id}/addNext`, {})
  },
  getContractMeasurementPaymentList: data => {
    return post('/contractMeasurementPayment/list', data)
  },
  deleteContractMeasurementPaymentById: id => {
    return post(`/contractMeasurementPayment/delete/${id}`, {})
  },
  getContractMeasurementPaymentById: id => {
    return get(`/contractMeasurementPayment/get/${id}`, {})
  },
  //工程进度款第二步更新总金额
  updateTotalMoney: id => {
    return post(`/contractMeasurementPayment/${id}/secondNext`, {})
  },
  updateContractMeasurementPaymentById: data => {
    return post(`/contractMeasurementPayment/update`, data)
  },
  // 分部分项工程和单价措施项目清单（支付）
  contractMeteringUnitDivisionTree: data => {
    return post('/contractMeteringUnitDivision/tree', data)
  },
  getContractMeasurementPaymentUnitDivisionList: data => {
    return post('/contractMeasurementPaymentUnitDivision/inventory/list', data)
  },
  updateInventory: data => {
    return post('/contractMeasurementPaymentUnitDivision/updateInventory', data)
  },
  //清单项目 计量支付清单列表查询
  getContractMeasurementPaymentSubpackageList: data => {
    return post('/contractMeasurementPaymentSubpackage/list', data)
  },
  updatePaymentSubpackage: data => {
    return post('/contractMeasurementPaymentSubpackage/update', data)
  },
  // 总价措施（支付）
  getContractMeasurementPaymentTotalPriceMeasureList: data => {
    return post('/contractMeasurementPaymentTotalPriceMeasure/list', data)
  },
  // 设置本期完成金额
  updateTotalPriceMeasure: data => {
    return post('/contractMeasurementPaymentTotalPriceMeasure/update', data)
  },
  // 计日工（支付）,
  getContractMeasurementPaymentDayWorksList: data => {
    return post('/contractMeasurementPaymentDayWorks/list', data)
  },
  updatePaymentDayWorksById: data => {
    return post(`/contractMeasurementPaymentDayWorks/update`, data)
  },
  //索赔项目
  addPaymentCompensation: data => {
    return post('/contractMeasurementPaymentCompensation/add', data)
  },
  getContractMeasurementPaymentCompensationList: data => {
    return post('/contractMeasurementPaymentCompensation/list', data)
  },
  deleteContractMeasurementPaymentCompensationById: id => {
    return post(`/contractMeasurementPaymentCompensation/delete/${id}`, {})
  },
  getContractMeasurementPaymentCompensationById: id => {
    return get(`/contractMeasurementPaymentCompensation/get/${id}`, {})
  },
  updateContractMeasurementPaymentCompensationById: data => {
    return post(`/contractMeasurementPaymentCompensation/update`, data)
  },
  //迟付款金额
  addPaymentLateShipment: data => {
    return post('/contractMeasurementPaymentLateShipment/add', data)
  },
  getContractMeasurementPaymentLateShipmentList: data => {
    return post('/contractMeasurementPaymentLateShipment/list', data)
  },
  deleteContractMeasurementPaymentLateShipmentById: id => {
    return post(`/contractMeasurementPaymentLateShipment/delete/${id}`, {})
  },
  getContractMeasurementPaymentLateShipmentById: id => {
    return get(`/contractMeasurementPaymentLateShipment/get/${id}`, {})
  },
  updateContractMeasurementPaymentLateShipmentById: data => {
    return post(`/contractMeasurementPaymentLateShipment/update`, data)
  },
  //其他支付
  addPaymentOtherPay: data => {
    return post('/contractMeasurementPaymentOtherPay/add', data)
  },
  getContractMeasurementPaymentOtherPayList: data => {
    return post('/contractMeasurementPaymentOtherPay/list', data)
  },
  deleteContractMeasurementPaymentOtherPayById: id => {
    return post(`/contractMeasurementPaymentOtherPay/delete/${id}`, {})
  },
  getContractMeasurementPaymentOtherPayById: id => {
    return get(`/contractMeasurementPaymentOtherPay/get/${id}`, {})
  },
  updateContractMeasurementPaymentOtherPayById: data => {
    return post(`/contractMeasurementPaymentOtherPay/update`, data)
  },
  //保证金
  addPaymentCashDeposit: data => {
    return post('/contractMeasurementPaymentCashDeposit/add', data)
  },
  getContractMeasurementPaymentCashDepositList: data => {
    return post('/contractMeasurementPaymentCashDeposit/list', data)
  },
  deleteContractMeasurementPaymentCashDepositById: id => {
    return post(`/contractMeasurementPaymentCashDeposit/delete/${id}`, {})
  },
  getContractMeasurementPaymentCashDepositById: id => {
    return get(`/contractMeasurementPaymentCashDeposit/get/${id}`, {})
  },
  updateContractMeasurementPaymentCashDepositById: data => {
    return post(`/contractMeasurementPaymentCashDeposit/update`, data)
  },
  //预付款
  getContractMeasurementPaymentAdvanceList: data => {
    return post('/contractMeasurementPaymentAdvance/list', data)
  },
  getContractMeasurementPaymentAdvanceById: id => {
    return get(`/contractMeasurementPayment/get/${id}`, {})
  },
  updateContractMeasurementPaymentAdvanceById: data => {
    return post(`/contractMeasurementPaymentAdvance/update`, data)
  },
  //违约赔偿
  addPaymentBreach: data => {
    return post('/contractMeasurementPaymentBreach/add', data)
  },
  getContractMeasurementPaymentBreachList: data => {
    return post('/contractMeasurementPaymentBreach/list', data)
  },
  deleteContractMeasurementPaymentBreachById: id => {
    return post(`/contractMeasurementPaymentBreach/delete/${id}`, {})
  },
  getContractMeasurementPaymentBreachById: id => {
    return get(`/contractMeasurementPaymentBreach/get/${id}`, {})
  },
  updateContractMeasurementPaymentBreachById: data => {
    return post(`/contractMeasurementPaymentBreach/update`, data)
  },
  //其他扣款
  addPaymentOtherWithhold: data => {
    return post('/contractMeasurementPaymentOtherWithhold/add', data)
  },
  getContractMeasurementPaymentOtherWithholdList: data => {
    return post('/contractMeasurementPaymentOtherWithhold/list', data)
  },
  deleteContractMeasurementPaymentOtherWithholdById: id => {
    return post(`/contractMeasurementPaymentOtherWithhold/delete/${id}`, {})
  },
  getContractMeasurementPaymentOtherWithholdById: id => {
    return get(`/contractMeasurementPaymentOtherWithhold/get/${id}`, {})
  },
  updateContractMeasurementPaymentOtherWithholdById: data => {
    return post(`/contractMeasurementPaymentOtherWithhold/update`, data)
  },
  //支付填报
  addPaymentReport: data => {
    return post('/contractMeasurementPaymentReport/add', data)
  },
  getPaymentReportList: data => {
    return post('/contractMeasurementPaymentReport/list', data)
  },
  deletePaymentReportById: id => {
    return post(`/contractMeasurementPaymentReport/delete/${id}`, {})
  },
  getPaymentReportById: id => {
    return get(`/contractMeasurementPaymentReport/get/${id}`, {})
  },
  updatePaymentReportById: data => {
    return post(`/contractMeasurementPaymentReport/update`, data)
  },
  /* //审核接口
  addPrepayment: data => {
    return post('/contractMeasurementPayment/add', data)
  },
  getContractMeasurementPaymentList: data => {
    return post('/contractMeasurementPayment/list', data)
  },
  deleteContractMeasurementPaymentById: id => {
    return post(`/contractMeasurementPayment/delete/${id}`, {})
  },
  getContractMeasurementPaymentById: id => {
    return get(`/contractMeasurementPayment/get/${id}`, {})
  },
  updateContractMeasurementPaymentById: data => {
    return post(`/contractMeasurementPayment/update`, data)
  },*/
  handleCheck: data => {
    return post(`/check`, data)
  },
  getPayById: id => {
    return get(`/contractMeasurementPayment/get/${id}`, {})
  },
  // 填报支付完成 @author huanghaoqi
  finishContractMeasurementPaymentReport: paymentId => {
    return get(`/contractMeasurementPaymentReport/${paymentId}/finish`)
  }
}
