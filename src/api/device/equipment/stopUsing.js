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
    axios.construction.post(`/equipmentDisableScrap/list`, {
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //添加
  add: param =>
    axios.construction.post(`/equipmentDisableScrap/save`, {
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //更新
  update: param =>
    axios.construction.post(`/equipmentDisableScrap/save`, {
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //删除
  delete: id => axios.construction.get(`/equipmentDisableScrap/delete/${id}`),

  //详情
  detail: id => axios.construction.get(`/equipmentDisableScrap/get/${id}`),

  //提交审核
  submitAudit: param =>
    axios.construction.post(`/equipmentDisableScrap/submit`, {
      ...param,
      projectId: localStorage.getItem('projectId')
    }),

  //审核
  audit: param => axios.construction.post(`/equipmentDisableScrap/audit`, param)
}
