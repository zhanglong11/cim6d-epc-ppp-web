/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9c09ed88507aa76c22849531fc13a576eff74928
@代码提交修改日期: 2020-03-02
@任务类型: 修改代码，采购单 新增采购单时，查询采购合同明细与需用计划明细的交集(40%)
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 407f019814c6559c61ea3dd09445a4750bdf3f24
@代码提交修改日期: 2020-03-03
@任务类型: 修改代码，完成 采购单 列表接口对接；新增采购单时，查询采购合同明细与需用计划明细交集业务；新增采购单接口对接
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9c7fdc0460e9936822107c8ae3bae5082caa11f9
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，完成 采购单 删除接口对接，添加可编辑表格保存状态校验，添加采购数量校验
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 78d89f3e215273723bb7636f4191214b7c384704
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，完成 采购单 编辑接口对接，保存提交功能，详情接口对接，采购单详情界面样式调整
@补加代码注释日期: 2020-04-11
*/
import axios from '@/utils/axios'
export default {
  //采购单列表
  getPurchaseOrderList: data => {
    return axios.construction.post('/material/dispatch/list', data)
  },
  //根据需用计划id查询需用计划明细
  getPlanDetailList: id => {
    return axios.construction.get(`/material/plan/detail/get/${id}`)
  },
  //根据采购合同id查询采购合同明细
  getContractDetailList: data => {
    return axios.construction.post('/contractInventoryPurchase/list', data)
  },
  //获取采购单详情
  getPurchaseOrderDetail: id => {
    return axios.construction.get(`/material/dispatch/get/${id}`)
  },
  //添加采购单
  addPurchaseOrder: data => {
    return axios.construction.post('/material/dispatch/add', data)
  },
  //编辑采购单
  editPurchaseOrder: data => {
    return axios.construction.post('/material/dispatch/update', data)
  },
  //删除采购单
  deletePurchaseOrder: id => {
    return axios.construction.get(`/material/dispatch/delete/${id}`)
  }
}
