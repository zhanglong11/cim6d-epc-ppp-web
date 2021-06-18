import { construction } from '@/utils/axios'
const { get, post } = construction
const projectId = localStorage.getItem('projectId')
export default {
  //添加入库单
  addOrder: data => {
    return post('/material/stock/add', data)
  },
  //获取列表
  getList: data => {
    return post('/material/stock/list', data)
  },
  deleteOrder: id => {
    return get(`/material/stock/delete/${id}`, {})
  },
  getDetailById: id => {
    return get(`/material/stock/get/${id}`, {})
  },
  updateOrder: data => {
    return post('/material/stock/update', data)
  },
  /**
   任务名称：2706/取样单修改
   开发人员：崔洛宜
   日期：2020-03-25
   任务类型：修改逻辑结构
   **/
  getPurchaseOrderById: data => {
    return get(`/material/dispatch/get/${data}`, {})
  },
  //入库
  handleInstore: data => {
    return post(`/material/stock/enter/${projectId}`, data)
  }
}
