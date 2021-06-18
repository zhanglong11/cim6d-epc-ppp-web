import axios from '@/utils/axios'
export default {
  //列表
  list: param =>
    axios.ppp.post(`/constructionWeeklyReport/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.ppp.post(`/constructionWeeklyReport/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //修改资料
  update: param =>
    axios.ppp.post(`/constructionWeeklyReport/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //进度信息
  progressInfo: param =>
    axios.ppp.post(`/qianjiang/ppp/schedule/task/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //质量列表
  qualityList: param =>
    axios.ppp.post(`/quality/issue/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //安全列表
  safeList: param =>
    axios.ppp.post(`/safetyIssue/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //提交
  submit: param =>
    axios.ppp.post(`/constructionWeeklyReport/submitAndAudit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  remove: id => axios.ppp.get(`/constructionWeeklyReport/delete/${id}`),

  //详情
  detail: id => axios.ppp.get(`/constructionWeeklyReport/get/${id}`)
}
