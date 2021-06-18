import axios from '@/utils/axios'
export default {
  //列表
  list: param =>
    axios.ppp.post(`/constructionDailyReport/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.ppp.post(`/constructionDailyReport/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //修改资料
  update: param =>
    axios.ppp.post(`/constructionDailyReport/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //提交
  submit: param =>
    axios.ppp.post(`/constructionDailyReport/submitAndAudit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  remove: id => axios.ppp.get(`/constructionDailyReport/delete/${id}`),

  //详情
  detail: id => axios.ppp.get(`/constructionDailyReport/get/${id}`)
}
