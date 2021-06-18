import axios from '@/utils/axios'
export default {
  //计量器具采购计划列表
  getMeasurePurchaseList: data => {
    return axios.construction.post('/measurePurchasePlan/list', data)
  },
  //计量器具台账列表
  getMeasureBook: data => {
    return axios.construction.post('/measureDevice/list', data)
  },
  //新增计量器具台账
  addMeasureBook: data => {
    return axios.construction.post('/measureDevice/save', data)
  },
  //修改计量器具台账
  editMeasureBook: data => {
    return axios.construction.post('/measureDevice/update', data)
  },
  //获取计量器具台账详情
  getMeasureBookDetail: id => {
    return axios.construction.get(`/measureDevice/get/${id}`)
  },
  //删除计量器具台账
  deleteMeasureBook: id => {
    return axios.construction.get(`/measureDevice/delete/${id}`)
  },
  //后续检定/校准：提交申请
  measureBookVerifyApply: data => {
    return axios.construction.post('/measureDevice/verify', data)
  },
  //后续检定/校准：记录
  measureBookVerifyList: data => {
    return axios.construction.post('/measureDeviceVerify/list', data)
  },
  //故障维修：提交申请
  measureBookFaultApply: data => {
    return axios.construction.post('/measureDevice/fault', data)
  },
  //故障维修：记录
  measureBookFaultList: data => {
    return axios.construction.post('/measureDeviceFault/list', data)
  },
  //封存：提交申请
  measureBookSealApply: data => {
    return axios.construction.post('/measureDevice/seal', data)
  },
  //封存：记录
  measureBookSealList: data => {
    return axios.construction.post('/measureDeviceSeal/list', data)
  },
  //报废：提交申请
  measureBookScrapApply: data => {
    return axios.construction.post('/measureDevice/scrap', data)
  },
  //报废：记录
  measureBookScrapList: data => {
    return axios.construction.post('/measureDeviceScrap/list', data)
  }
}
