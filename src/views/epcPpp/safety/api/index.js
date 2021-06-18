import http from '@/utils/axios'
export default {
  //安全问题列表
  getList: data => {
    return http.epcPPP.post(`/safetyIssue/list`, data)
  },
  add: data => {
    return http.epcPPP.post(`/safetyIssue/add`, data)
  },
  update: data => {
    return http.epcPPP.post(`/safetyIssue/update`, data)
  },
  getDetail: id => {
    return http.epcPPP.get(`/safetyIssue/get/${id}`)
  },
  //取消
  cancel: id => {
    return http.epcPPP.get(`/safetyIssue/cancel/${id}`)
  },
  //催办
  urge: id => {
    return http.epcPPP.get(`/safetyIssue/urging/${id}`)
  },
  //获取年度对比分析表格
  getYearContrast: data => {
    return http.epcPPP.post(`/safetyIssue/getByYearContrast`, { projectId: localStorage.getItem('projectId') })
  },
  //获取年份
  getYear: data => {
    return http.epcPPP.post(`/safetyIssue/getYear`, { projectId: localStorage.getItem('projectId') })
  },
  //获取月份
  getMonth: data => {
    return http.epcPPP.post(`/safetyIssue/getMonth`, { ...data, projectId: localStorage.getItem('projectId') })
  },
  //获取年度分析
  getYearAnalysis: data => {
    return http.epcPPP.post(`/safetyIssue/getByYearAnalys`, { ...data, projectId: localStorage.getItem('projectId') })
  },
  //根据选择年度获取不同类型的安全问题
  getIssueTypeByYear: data => {
    return http.epcPPP.post(`/safetyIssue/getSafetyCount`, { ...data, projectId: localStorage.getItem('projectId') })
  },
  //获取月度分析
  getMonthAnalysis: data => {
    return http.epcPPP.post(`/safetyIssue/getByMonthAnalys`, { ...data, projectId: localStorage.getItem('projectId') })
  }
}
