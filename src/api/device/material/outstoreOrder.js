import { construction } from '@/utils/axios'
const { get, post } = construction
const projectId = localStorage.getItem('projectId')
export default {
  //添加出库单
  addOrder: data => {
    return post('/material/out/stock/add', data)
  },
  //获取列表
  getList: data => {
    return post('/material/out/stock/list', data)
  },
  deleteOrder: id => {
    return get(`/material/out/stock/delete/${id}`, {})
  },
  getDetailById: id => {
    return get(`/material/out/stock/get/${id}`, {})
  },
  updateOrder: data => {
    return post('/material/out/stock/update', data)
  },
  getPickOrderDetailById: id => {
    return get(`/material/receive/bill/get/${id}`, {})
  },
  //出库
  handleOutstore: data => {
    return post(`/material/out/stock/remove/${projectId}`, data)
  }
}
