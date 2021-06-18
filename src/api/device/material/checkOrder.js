import { construction } from '@/utils/axios'
const { get, post } = construction
export default {
  //添加原材料检验单
  addOrder: data => {
    return post('/raw/material/inspect/record/add', data)
  },
  //获取列表
  getList: data => {
    return post('/raw/material/inspect/record/list', data)
  },
  deleteOrder: id => {
    return get(`/raw/material/inspect/record/delete/${id}`, {})
  },
  getDetailById: id => {
    return get(`/raw/material/inspect/record/get/${id}`, {})
  },
  updateOrder: data => {
    return post('/raw/material/inspect/record/update', data)
  },
  //获取原材料列表
  getMaterialList: data => {
    return post('/raw/material/inspect/rule/list', data)
  }
}
