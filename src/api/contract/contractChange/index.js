import { construction } from '@/utils/axios'
const { post, get } = construction
export default {
  //添加合同变更
  addContractChange: data => {
    return post('/contractChangeRecord/add', data)
  },
  //获取合同变更列表
  getContractChangeList: data => {
    return post('/contractChangeRecord/list', data)
  },
  deleteContractChangeById: id => {
    return post(`/contractChangeRecord/delete/${id}`, {})
  },
  getContractChangeById: id => {
    return get(`/contractChangeRecord/get/${id}`, {})
  },
  updateContractChangeById: data => {
    return post(`/contractChangeRecord/update`, data)
  },
  //审核接口
  handleCheck: data => {
    return post(`/check`, data)
  }
}
