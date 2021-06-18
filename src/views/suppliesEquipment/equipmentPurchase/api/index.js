import axios from '@/utils/axios'
export default {
  //获取采购列表
  getList: param =>
    axios.material.post(`/equipmentPurchase/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //新建时获取库存设备
  getPurchaseLeaseList: param =>
    axios.material.post(`/equipment/purchaseLeaseList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  addEquipmentPurchase: param =>
    axios.material.post(`/equipmentPurchase/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  updateEquipmentPurchase: param =>
    axios.material.post(`/equipmentPurchase/submit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  getEquipmentPurchaseById: id => axios.material.get(`/equipmentPurchase/get/${id}`),
  deleteEquipmentPurchase: id => axios.material.get(`/equipmentPurchase/delete/${id}`),
  //采购
  makeEquipmentPurchase: id => axios.material.get(`/equipmentPurchase/makePurchases/${id}`),
  //到货确认
  getReceiveConfirm: param =>
    axios.material.post(`/equipmentPurchase/arrivalConfirmation`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  getVerificationAcceptance: param =>
    axios.material.post(`/equipmentPurchase/verificationAcceptance`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //执行入库
  getEquipmentInstore: id => axios.material.get(`/equipmentPurchase/addInventory/${id}`),
  getAudit: param =>
    axios.material.post(`/equipmentPurchase/updatePurchase`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
