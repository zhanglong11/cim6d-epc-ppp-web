import axios from '@/utils/axios'
export default {
  //列表
  list: param =>
    axios.ppp.post(`/supervisorDailyReport/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.ppp.post(`/supervisorDailyReport/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //修改资料
  update: param =>
    axios.ppp.post(`/supervisorDailyReport/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //提交
  submit: param =>
    axios.ppp.post(`/supervisorDailyReport/submitAndAudit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  remove: id => axios.ppp.get(`/supervisorDailyReport/delete/${id}`),

  //删除
  detail: id => axios.ppp.get(`/supervisorDailyReport/get/${id}`)
}
