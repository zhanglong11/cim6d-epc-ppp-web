import axios from '@/utils/axios'
/*
 * @任务编号:2824 || 解决项目id问题
 * @开发人员:张龙
 * @日期:2020-03-07
 * @任务类型: 修改代码
 */
export default {
  /*
   * @任务编号:#2711||设备管理原型修改更改功能
   * @开发人员:张龙
   * @日期:2020-03-25
   * @任务类型: 全新代码
   */
  //总物资计划列表
  materialList: param =>
    axios.construction.post('/project/material/list', {
      ...{ materialType: 2 },
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //列表
  list: param =>
    axios.construction.post(`/projectEquipment/list`, {
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //添加
  add: param =>
    axios.construction.post(`/projectEquipment/save`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.construction.post(`/projectEquipment/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.construction.get(`/projectEquipment/delete/${id}`),

  //详情
  detail: id => axios.construction.get(`/projectEquipment/get/${id}`),

  //提交审核
  submitAudit: param =>
    axios.construction.post(`/projectEquipment/submit`, {
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //审核
  audit: param => axios.construction.post(`/projectEquipment/audit`, param)
}
