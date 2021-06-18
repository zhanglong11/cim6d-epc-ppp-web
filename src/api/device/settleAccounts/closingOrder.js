/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 543ebac50c423a475a1b21b616f09b34e8269555
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，物资租赁结算单 租赁单模态框接口调整，新增物资租赁结算单接口对接，新增物资租赁结算单界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: ae534b410c148fda9e347871bf82ada349aaf3ea
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 编辑接口对接，结算单列表接口对接，详情接口对接，并重新调整租赁结算单详情页样式
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 707075396d45ffaf3e980f32348af96fed37f273
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 删除接口对接，审核列表接口对接，审核提交接口对接，添加审核详情页，审核页和详情页样式重新调整
@补加代码注释日期: 2020-04-11
*/
import axios from '@/utils/axios'
export default {
  //获取租赁单详情
  getLeaseOrderDetail: id => {
    return axios.construction.get(`/material/dispatch/get/${id}`)
  },
  //新增物资租赁结算单
  addClosingOrder: data => {
    return axios.construction.post('/material/rent/settlement/bill/add', data)
  },
  //编辑物资租赁结算单
  editClosingOrder: data => {
    return axios.construction.post('/material/rent/settlement/bill/update', data)
  },
  //查询物资租赁结算单列表
  getClosingOrderList: data => {
    return axios.construction.post('/material/rent/settlement/bill/list', data)
  },
  //查询物资租赁结算单详情
  getClosingOrderDetailById: id => {
    return axios.construction.get(`/material/rent/settlement/bill/get/${id}`)
  },
  //删除物资租赁结算单
  deleteClosingOrder: id => {
    return axios.construction.get(`/material/rent/settlement/bill/delete/${id}`)
  }
}
