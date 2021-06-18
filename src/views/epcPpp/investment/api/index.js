import axios from '@/utils/axios'
export default {
  //投资月报列表
  getMonthlyList: data => {
    return axios.epcPPP.post('/investMonthlyReportBase/list', data)
  },
  //投资月报列表删除
  getMonthlyDelete: id => {
    return axios.epcPPP.get(`/investMonthlyReportBase/delete/${id}`, {})
  },
  //投资月报添加
  getMonthlyAdd: data => {
    return axios.epcPPP.post('/investMonthlyReportBase/add', data)
  },
  //投资月报编辑
  getMonthlyUpdate: data => {
    return axios.epcPPP.post('/investMonthlyReportBase/update', data)
  },
  //投资月报下载
  getMonthlyDownload: id => {
    return axios.epcPPP.get(`/investMonthlyReportBase/exportAndFormat/${id}`, { responseType: 'blob' })
  },
  //投资月报扩展编辑
  getMonthlyExtendUpdate: data => {
    return axios.epcPPP.post('/investMonthlyReportExtra/update', data)
  },
  //投资月报详情
  getMonthlyDetails: id => {
    return axios.epcPPP.post(`/investMonthlyReportBase/get/${id}`, {})
  },
  //获取最近一次审核通过的月报详情
  getMonthlyRecentDetails: data => {
    return axios.epcPPP.post('/investMonthlyReportBase/getLately', data)
  },
  //获取期号列表
  getConfirmIssue: id => {
    return axios.epcPPP.get(`/invest/confirm/getAllIssue/${id}`)
  },
  //投资确认列表删除
  geConfirmDelete: id => {
    return axios.epcPPP.get(`/invest/confirm/delete/${id}`, {})
  },
  //获取上期累计
  getPreviousPeriodTotal: data => {
    return axios.epcPPP.post('/invest/confirm/getPreviousPeriodTotal', data)
  },
  //获取投资估算列表
  getReckonList: data => {
    return axios.epcPPP.post('/investBudget/list', data)
  },
  //删除投资估算
  deleteReckon: id => {
    return axios.epcPPP.get(`/investBudget/delete/${id}`, {})
  },
  //获取投资估算详情
  getReckonDetail: id => {
    return axios.epcPPP.get(`/investBudget/get/${id}`, {})
  },
  //添加投资估算
  addReckon: data => {
    return axios.epcPPP.post('/investBudget/add', data)
  },
  //更新投资估算
  updateReckon: data => {
    return axios.epcPPP.post('/investBudget/update', data)
  },
  //获取投资概算列表
  getEstimateList: data => {
    return axios.epcPPP.post('/investBudget/list', data)
  },
  //删除投资概算
  deleteEstimate: id => {
    return axios.epcPPP.get(`/investBudget/delete/${id}`, {})
  },
  //获取投资概算详情
  getEstimateDetail: id => {
    return axios.epcPPP.get(`/investBudget/get/${id}`, {})
  },
  //添加投资概算
  addEstimate: data => {
    return axios.epcPPP.post('/investBudget/add', data)
  },
  //更新投资概算
  updateEstimate: data => {
    return axios.epcPPP.post('/investBudget/update', data)
  },
  //预算列表
  getBudgetList: data => {
    return axios.epcPPP.post('/investBudget/list', data)
  },
  //删除预算
  deleteBudget: id => {
    return axios.epcPPP.get(`/investBudget/delete/${id}`, {})
  },
  //获取预算详情
  getBudgetDetail: id => {
    return axios.epcPPP.get(`/investBudget/get/${id}`, {})
  },
  //添加预算
  addBudget: data => {
    return axios.epcPPP.post('/investBudget/add', data)
  },
  //更新预算
  updateBudget: data => {
    return axios.epcPPP.post('/investBudget/update', data)
  }
}
