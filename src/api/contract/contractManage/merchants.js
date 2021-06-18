import { construction, getDownload, postDownload } from '@/utils/axios'
const { get, post } = construction
export default {
  //添加合同
  addContract: data => {
    return post('/contractBaseinfoSupply/add', data)
  },
  getContractList: data => {
    return post('/contractBaseinfoSupply/list', data)
  },
  deleteContractById: id => {
    return post(`/contractBaseinfoSupply/delete/${id}`, {})
  },
  getContractById: id => {
    return get(`/contractBaseinfoSupply/get/${id}`, {})
  },
  updateContractById: data => {
    return post(`/contractBaseinfoSupply/update`, data)
  },
  //添加合同清单信息
  addOrderFile: data => {
    return post(`/contractBaseinfoSupply/upload/inventory`, data, {
      'Content-Type': 'multipart/form-data'
    })
  },
  //添加合同清单信息
  addOrderFile1: data => {
    return post(`/contractBaseinfoSupply/app/upload/inventory`, data)
  },
  //删除清单
  deleteInventoryAttachmentById(id) {
    return post(`/contractBaseinfo/delete/inventoryAttachment/${id}`, {})
  },
  getContractInventoryPurchase: data => {
    return post('/contractInventoryPurchase/list', data)
  },
  //导出租赁采购清单
  exportContractInventoryPurchase: data => {
    return post('/contractBaseinfoSupply/export/inventory', data, { responseType: 'blob' })
  },
  //上传纸质文件操作
  uploadPaperContract: data => {
    return post('/contractBaseinfoSupply/uploadPaper', data)
  }
}
