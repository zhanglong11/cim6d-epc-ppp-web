import http from '@/utils/axios'
export default {
  //质量问题列表
  getList: data => {
    return http.epcPPP.post(`/quality/issue/list`, data)
  },
  add: data => {
    return http.epcPPP.post(`/quality/issue/add`, data)
  },
  update: data => {
    return http.epcPPP.post(`/quality/issue/update`, data)
  },
  getDetail: id => {
    return http.epcPPP.get(`/quality/issue/get/${id}`)
  },
  //取消
  cancel: id => {
    return http.epcPPP.get(`/quality/issue/cancel/${id}`)
  },
  //催办
  urge: id => {
    return http.epcPPP.get(`/quality/issue/urging/${id}`)
  },
  //获取年度对比分析表格
  getYearContrast: data => {
    return http.epcPPP.post(`/quality/issue/getByYearContrast`, { projectId: localStorage.getItem('projectId') })
  },
  //获取年份
  getYear: data => {
    return http.epcPPP.post(`/quality/issue/getYear`, { projectId: localStorage.getItem('projectId') })
  },
  //获取月份
  getMonth: data => {
    return http.epcPPP.post(`/quality/issue/getMonth`, { ...data, projectId: localStorage.getItem('projectId') })
  },
  //获取年度分析
  getYearAnalysis: data => {
    return http.epcPPP.post(`/quality/issue/getByYearAnalys`, { ...data, projectId: localStorage.getItem('projectId') })
  },
  //根据选择年度获取不同类型的质量问题
  getIssueTypeByYear: data => {
    return http.epcPPP.post(`/quality/issue/getQualityCount`, { ...data, projectId: localStorage.getItem('projectId') })
  },
  //获取月度分析
  getMonthAnalysis: data => {
    return http.epcPPP.post(`/quality/issue/getByMonthAnalys`, {
      ...data,
      projectId: localStorage.getItem('projectId')
    })
  },
  // 查询项目下的所有楼层结构
  queryFloorList: data => {
    return http.epcPPP.post(`/projectBim/project/floorList`, { ...data, projectId: localStorage.getItem('projectId') })
  }
}
