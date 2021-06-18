import { construction } from '@/utils/axios'
const { get, post } = construction
const projectId = localStorage.getItem('projectId')
export default {
  //耗料清单
  addOrder: data => {
    return post('/material/consume/inventory/bill/add', data)
  },
  //获取列表
  getList: data => {
    return post('/material/consume/inventory/bill/list', data)
  },
  deleteOrder: id => {
    return get(`/material/consume/inventory/bill/delete/${id}`, {})
  },
  getDetailById: id => {
    return get(`/material/consume/inventory/bill/get/${id}`, {})
  },
  updateOrder: data => {
    return post('/material/consume/inventory/bill/update', data)
  },
  /**
   任务名称：2714/耗料清点修改
   开发人员：崔洛宜
   日期：2020-03-25
   任务类型：修改逻辑结构
   **/
  getPickOrderDetailById: id => {
    return get(`/material/receive/bill/get/${id}`, {})
  },
  //耗料入库
  comsumeInstore: data => {
    return post(`/material/stock/put/${projectId}`, data)
  }
}
