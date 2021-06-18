/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 59853e620c5d96d0dab46c54c6bd564896eec168
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，完成 租赁单列表查询接口对接(80%)，新增租赁单界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 19e660f1b658104f720580f3167a2b2bb04ae1e3
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，租赁单 新增租赁单时，查询租赁合同明细与租赁计划明细的交集(40%)
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: e04dcf4a7120d82136af418984d5c7ad6cd64082
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，完成 租赁单 新增租赁单时，查询租赁合同明细与租赁计划明细的交集业务；新增租赁单接口对接；租赁单列表功能；编辑租赁单接口对接；保存提交功能；删除租赁单接口对接；详情接口对接；详情界面样式重新调整
@补加代码注释日期: 2020-04-11
*/
import axios from '@/utils/axios'
export default {
  //租赁单列表
  getLeaseOrderList: data => {
    return axios.construction.post('/material/dispatch/list', data)
  },
  //根据租赁计划id查询租赁计划明细
  getPlanDetailList: id => {
    return axios.construction.get(`/material/plan/detail/get/${id}`)
  },
  //根据租赁合同id查询租赁合同明细
  getContractDetailList: data => {
    return axios.construction.post('/contractInventoryPurchase/list', data)
  },
  //获取租赁单详情
  getLeaseOrderDetail: id => {
    return axios.construction.get(`/material/dispatch/get/${id}`)
  },
  //添加租赁单
  addLeaseOrder: data => {
    return axios.construction.post('/material/dispatch/add', data)
  },
  //编辑租赁单
  editLeaseOrder: data => {
    return axios.construction.post('/material/dispatch/update', data)
  },
  //删除租赁单
  deleteLeaseOrder: id => {
    return axios.construction.get(`/material/dispatch/delete/${id}`)
  }
}
