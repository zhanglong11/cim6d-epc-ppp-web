import axios from '@/utils/axios'
export default {
  //进度列表
  progressList: param =>
    axios.ppp.post(`/qianjiang/ppp/schedule/task/analysis/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //质量列表
  qualityList: param =>
    axios.ppp.post(`/quality/bimIssueList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //安全列表
  safeList: param =>
    axios.ppp.post(`/safetyIssue/bimIssueList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //所有模型列表
  allTree: () => axios.ppp.post(`/projectBim/${localStorage.getItem('projectId')}/select/bimTree`, {}),

  //当前模型列表
  bimTree: () => axios.ppp.post(`/projectBim/${localStorage.getItem('projectId')}/bimTree`, {}),

  //添加模型
  addTree: param => axios.ppp.post(`/projectBim/add`, param),

  //更新
  updateTree: param =>
    axios.ppp.post(`/projectBim/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //楼层树
  floorTree: param =>
    axios.ppp.post(`/projectBim/bimView/floorList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //图纸列表
  libraryList: param =>
    axios.ppp.post(`/projectBim/selectDrawingList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //关联
  link: param =>
    axios.ppp.post(`/projectBim/bind/drawing`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //取消关联
  cancelBind: param =>
    axios.ppp.post(`/projectBim/cancelBind/drawing`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //模型进度
  getProgressModel: param =>
    axios.ppp.post(`/qianjiang/ppp/schedule/bim/cycle/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //质量模型
  getQualityModel: param =>
    axios.ppp.post(`/quality/issue/getQualityIssueGuid`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //安全模型
  getSafeModel: param =>
    axios.ppp.post(`/safetyIssue/getSafetyIssueGuid`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
