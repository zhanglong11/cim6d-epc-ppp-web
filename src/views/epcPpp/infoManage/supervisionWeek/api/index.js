import axios from '@/utils/axios'
export default {
  //列表
  list: param =>
    axios.ppp.post(`/supervisorWeeklyReport/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.ppp.post(`/supervisorWeeklyReport/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //修改资料
  update: param =>
    axios.ppp.post(`/supervisorWeeklyReport/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //获取上周信息
  lastInfo: param =>
    axios.ppp.post(`/supervisorWeeklyReport/getLastWeek`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //提交
  submit: param =>
    axios.ppp.post(`/supervisorWeeklyReport/submitAndAudit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  remove: id => axios.ppp.get(`/supervisorWeeklyReport/delete/${id}`),

  //详情
  detail: id => axios.ppp.get(`/supervisorWeeklyReport/get/${id}`)
}
