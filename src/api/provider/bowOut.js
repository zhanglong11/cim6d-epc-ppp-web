/*
 * @Description:分包商退场
 * @Version:
 * @Autor:
 * @Date: 2020-02-19 14:36:10
 * @LastEditTime: 2020-02-19 15:51:55
 */
import axios from '@/utils/axios'
export default {
  // 考核列表
  getList(data) {
    return axios.construction.post('subContractorLeave/list', data)
  },
  getDetails(id) {
    return axios.construction.get(`subContractorLeave/get/${id}`)
  },
  // 保存草稿
  save(data) {
    return axios.construction.post('subContractorLeave/save', data)
  },
  submit(data) {
    return axios.construction.post('subContractorLeave/submit', data)
  },
  delete(id) {
    return axios.construction.get(`subContractorLeave/delete/${id}`)
  },
  // 审核
  audit(data) {
    return axios.construction.post('subContractorLeave/audit', data)
  },
  getCheckDetails(id) {
    return axios.construction.get(`subContractorLeave/auditView/${id}`)
  }
}
