import axios from '@/utils/axios'
export default {
  //计量器具故障维修审核列表
  getMeasureRepairAuditList: data => {
    return axios.construction.post('/measureDeviceFault/list', data)
  },
  //计量器具故障维修查看
  getMeasureRepairDetail: id => {
    return axios.construction.get(`/measureDeviceFault/get/${id}`)
  },
  //计量器具故障维修审核
  submitMeasureRepairAudit: data => {
    return axios.construction.post('/measureDeviceFault/audit', data)
  }
}
