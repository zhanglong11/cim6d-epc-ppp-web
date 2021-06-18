import axios from '@/utils/axios'
export default {
  //资料列表
  rootList: type => axios.ppp.get(`/document/firstLevel/query/${type}`),

  //子列表
  childList: id => axios.ppp.get(`/document/subLevel/query/${id}`),

  //添加资料
  add: param =>
    axios.ppp.post(`/document/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //修改资料
  update: param =>
    axios.ppp.post(`/document/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  deleteRoot: id => axios.ppp.get(`/document/firstLevel/delete/${id}`),

  //删除子集
  deleteChild: param =>
    axios.ppp.post(`/document/otherLevel/delete`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //添加监理单位月报
  addSupervisionMonth: param =>
    axios.ppp.post(`/supervisorMonthReport/saveRecord`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //获取监理单位月报期号列表
  getSupervisionMonthList: param =>
    axios.ppp.post(`/supervisorMonthReport/pageList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //获取监理单位月报详情
  getSupervisionMonthDetail: id => axios.ppp.get(`/supervisorMonthReport/detail/${id}`),
  //删除监理月报
  deleteSupervisionMonthById: id => axios.ppp.get(`/supervisorMonthReport/delete/${id}`),
  //监理月报提交审核
  auditSupervisionMonth: id => axios.ppp.get(`/supervisorMonthReport/submitAudit/${id}`)
}
