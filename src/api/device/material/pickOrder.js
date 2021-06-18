import { construction } from '@/utils/axios'
const { get, post } = construction
export default {
  //添加领料单
  addOrder: data => {
    return post('/material/receive/bill/add', data)
  },
  //获取列表
  getList: data => {
    return post('/material/receive/bill/list', data)
  },
  deleteOrder: id => {
    return get(`/material/receive/bill/delete/${id}`, {})
  },
  getDetailById: id => {
    return get(`/material/receive/bill/get/${id}`, {})
  },
  updateOrder: data => {
    return post('/material/receive/bill/update', data)
  },
  /**
   任务名称：2709/取样单修改
   开发人员：崔洛宜
   日期：2020-03-25
   任务类型：修改逻辑
   **/
  //获取库存材料
  getMaterialList: data => {
    return post('/project/material/remain/list', data)
  },
  /**
   任务名称：2729/领料单审核
   开发人员：崔洛宜
   日期：2020-03-26
   任务类型：修改逻辑
   **/
  handleCheck: data => {
    return post('/material/receive/bill/update', data)
  }
}
