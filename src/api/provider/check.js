/*
 * @Description:供应商考核
 * @Version:
 * @Autor:
 * @Date: 2020-02-17 16:46:42
 * @LastEditTime: 2020-02-19 09:58:54
 */
import axios from '@/utils/axios'
export default {
  // 考核列表
  getSupplierCheckList(data) {
    return axios.construction.post('supplierCheck/list', data)
  },
  // 详情
  getSupplierDetalis(id) {
    return axios.construction.get(`supplierCheck/get/${id}`)
  },
  // 审核详情
  getSupplierCheckDetails(id) {
    return axios.construction.get(`supplierCheck/auditView/${id}`)
  },
  // 审核
  auditSupplierCheck(data) {
    return axios.construction.post('supplierCheck/audit', data)
  },
  // 保存草稿
  saveSupplierCheck(data) {
    return axios.construction.post(`supplierCheck/save`, data)
  },
  // 保存
  submitSupplierCheck(data) {
    return axios.construction.post(`supplierCheck/submit`, data)
  },
  // 删除
  deleteSupplierCheck(id) {
    return axios.construction.get(`supplierCheck/delete/${id}`)
  }
}
