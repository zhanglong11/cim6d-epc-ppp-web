/*
 * @Description:供应商管理
 * @Version:
 * @Autor:
 * @Date: 2020-02-17 09:45:03
 * @LastEditTime: 2020-02-17 10:42:48
 */
import axios from '@/utils/axios'
export default {
  // 供应商管理数据-列表
  getSupplierManageList(data) {
    return axios.construction.post('/supplierManage/list', data)
  },
  // 供应商管理数据-查看
  getSupplierManageDetails(id) {
    return axios.construction.get(`supplierManage/get/${id}`)
  },
  // 保存为草稿
  supplierManageSave(data) {
    return axios.construction.post('supplierManage/save', data)
  },
  // 供应商管理数据-保存提交
  supplierManageSubmit(data) {
    return axios.construction.post('supplierManage/submit', data)
  },
  // 供应商管理数据-删除
  supplierManageDelete(id) {
    return axios.construction.get(`supplierManage/delete/${id}`)
  },
  // 审核
  supplierManageAudit(data) {
    return axios.construction.post('supplierManage/audit', data)
  },
  // 审核详情
  supplierManageAuditDetails(id) {
    return axios.construction.get(`supplierManage/auditView/${id}`)
  }
}
