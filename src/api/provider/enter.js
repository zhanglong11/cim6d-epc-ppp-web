/*
 * @Description:分包商进场
 * @Version:
 * @Autor:
 * @Date: 2020-02-19 11:07:31
 * @LastEditTime: 2020-02-19 11:32:37
 */
import axios from '@/utils/axios'
export default {
  // 考核列表
  getSubContractorEnterList(data) {
    return axios.construction.post('subContractorEnter/list', data)
  },
  // 保存草稿
  saveSubContractorEnter(data) {
    return axios.construction.post('subContractorEnter/save', data)
  },
  // 保存提交
  submitSubContractorEnter(data) {
    return axios.construction.post('subContractorEnter/submit', data)
  },
  getDetails(id) {
    return axios.construction.get(`subContractorEnter/get/${id}`)
  },
  // 审核详情
  getCheckDetalis(id) {
    return axios.construction.get(`subContractorEnter/auditView/${id}`)
  },
  delete(id) {
    return axios.construction.get(`subContractorEnter/delete/${id}`)
  },
  // 审核
  audit(data) {
    return axios.construction.post(`subContractorEnter/audit`, data)
  }
}
