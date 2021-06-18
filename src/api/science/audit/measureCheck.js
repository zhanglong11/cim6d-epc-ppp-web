import axios from '@/utils/axios'
export default {
  //计量器具检定校准审核列表
  getMeasureCheckAuditList: data => {
    return axios.construction.post('/measureDeviceVerify/list', data)
  },
  //计量器具检定校准查看
  getMeasureCheckDetail: id => {
    return axios.construction.get(`/measureDeviceVerify/get/${id}`)
  },
  //计量器具检定校准审核
  submitMeasureCheckAudit: data => {
    return axios.construction.post('/measureDeviceVerify/audit', data)
  }
}
