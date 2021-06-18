import axios from '@/utils/axios'
export default {
  //计量器具封存审核列表
  getMeasureSealAuditList: data => {
    return axios.construction.post('/measureDeviceSeal/list', data)
  },
  //计量器具封存查看
  getMeasureSealDetail: id => {
    return axios.construction.get(`/measureDeviceSeal/get/${id}`)
  },
  //计量器具封存审核
  submitMeasureSealAudit: data => {
    return axios.construction.post('/measureDeviceSeal/audit', data)
  }
}
