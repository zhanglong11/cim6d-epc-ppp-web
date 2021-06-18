import axios from '@/utils/axios'
export default {
  //计量器具报废审核列表
  getMeasureScrapAuditList: data => {
    return axios.construction.post('/measureDeviceScrap/list', data)
  },
  //计量器具报废查看
  getMeasureScrapDetail: id => {
    return axios.construction.get(`/measureDeviceScrap/get/${id}`)
  },
  //计量器具报废审核
  submitMeasureScrapAudit: data => {
    return axios.construction.post('/measureDeviceScrap/audit', data)
  }
}
