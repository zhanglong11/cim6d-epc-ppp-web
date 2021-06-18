import axios from '@/utils/axios'
export default {
  //计量器具采购计划列表
  getMeasurePurchaseList: data => {
    return axios.construction.post('/measurePurchasePlan/list', data)
  },
  //保存计量器具采购计划
  saveMeasurePurchase: data => {
    return axios.construction.post('/measurePurchasePlan/save', data)
  },
  //保存提交计量器具采购计划
  saveSubmitMeasurePurchase: data => {
    return axios.construction.post('/measurePurchasePlan/submit', data)
  },
  //获取计量器具采购计划详情
  getMeasurePurchaseDetail: id => {
    return axios.construction.get(`/measurePurchasePlan/get/${id}`)
  },
  //删除计量器具采购计划
  deleteMeasurePurchase: id => {
    return axios.construction.get(`/measurePurchasePlan/delete/${id}`)
  }
}
