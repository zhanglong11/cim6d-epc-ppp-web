/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 17b336f4058bf4489a328ddcf5cec6d254a6aee7
@代码提交修改日期: 2020-03-02
@任务类型: 修改代码，完成 租赁计划 列表接口对接，新增接口对接，新增租赁计划界面样式调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: bd20b60ac90cb91079ad631ed6cfc6f771b0f08b
@代码提交修改日期: 2020-03-03
@任务类型: 修改代码，完成 租赁计划 编辑接口对接，详情接口对接，删除接口对接，详情页样式重新调整
@补加代码注释日期: 2020-04-11
*/
import axios from '@/utils/axios'
export default {
  //租赁计划列表
  getLeasePlanList: data => {
    return axios.construction.post('/material/plan/list', data)
  },
  //新增租赁计划
  addLeasePlan: data => {
    return axios.construction.post('/material/plan/add', data)
  },
  //编辑租赁计划
  editLeasePlan: data => {
    return axios.construction.post('/material/plan/update', data)
  },
  //获取租赁计划详情
  getLeasePlanDetail: id => {
    return axios.construction.get(`/material/plan/get/${id}`)
  },
  //删除租赁计划
  deleteLeasePlan: id => {
    return axios.construction.get(`/material/plan/delete/${id}`)
  }
}
