import axios from '@/utils/axios'
/*
 * @任务编号:2824 || 解决项目id问题
 * @开发人员:张龙
 * @日期:2020-03-07
 * @任务类型: 修改代码
 */
export default {
  //列表
  list: param =>
    axios.construction.post(`/equipmentMaintenance/list`, {
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //添加
  add: param =>
    axios.construction.post(`/equipmentMaintenance/save`, {
      //bug 1440 张龙 3-31
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //更新
  update: param =>
    axios.construction.post(`/equipmentMaintenance/save`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.construction.get(`/equipmentMaintenance/delete/${id}`),

  //详情
  detail: id => axios.construction.get(`/equipmentMaintenance/get/${id}`),

  //提交审核
  submitAudit: param =>
    axios.construction.post(`/equipmentMaintenance/submit`, {
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //审核
  audit: param => axios.construction.post(`/equipmentMaintenance/audit`, param)
}
