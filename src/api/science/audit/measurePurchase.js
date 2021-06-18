import axios from '@/utils/axios'
export default {
  //计量器具采购计划审核列表
  getMeasurePurchaseAuditList: data => {
    return axios.construction.post('/measurePurchasePlan/list', data)
  },
  //审核计量器具采购计划：待审核时：提交
  submitMeasurePurchaseAudit: data => {
    return axios.construction.post('/measurePurchasePlan/audit', data)
  },
  //获取计量器具采购计划详情信息和审核结果信息
  getMeasurePurchaseDetailAuditResult: id => {
    return axios.construction.get(`/measurePurchasePlan/auditView/${id}`)
  }
}
