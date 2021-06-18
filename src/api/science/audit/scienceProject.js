import axios from '@/utils/axios'
export default {
  //技术方案审核列表
  getScienceProjectAuditList: data => {
    return axios.construction.post('/technologyScheme/list', data)
  },
  //审核技术方案：电子版待审核时：提交
  submitScienceProjectElectronicAudit: data => {
    return axios.construction.post('/technologyScheme/electronicAudit', data)
  },
  //审核技术方案：纸质版待审核时：提交
  submitScienceProjectPaperAudit: data => {
    return axios.construction.post('/technologyScheme/paperAudit', data)
  },
  //获取技术方案详情信息和审核结果信息
  getScienceProjectDetailAuditResult: id => {
    return axios.construction.get(`/technologyScheme/auditView/${id}`)
  },
  uploadPaperScienceProject: data => {
    return axios.construction.post('/technologyScheme/paperSubmit', data)
  }
}
