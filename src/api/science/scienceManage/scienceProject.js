import axios from '@/utils/axios'
export default {
  //技术方案列表
  getScienceProjectList: data => {
    return axios.construction.post('/technologyScheme/list', data)
  },
  //保存技术方案
  saveScienceProject: data => {
    return axios.construction.post('/technologyScheme/save', data)
  },
  //电子版：保存并提交技术方案
  saveSubmitScienceProjectElectronic: data => {
    return axios.construction.post('/technologyScheme/submitAudit', data)
  },
  //纸质版：保存并提交技术方案
  saveSubmitScienceProjectPaper: data => {
    return axios.construction.post('/technologyScheme/submitAudit', data)
  },
  //删除技术方案
  deleteScienceProject: id => {
    return axios.construction.get(`/technologyScheme/delete/${id}`)
  },
  //获取技术方案详情
  getScienceProjectDetail: id => {
    return axios.construction.get(`/technologyScheme/get/${id}`)
  }
}
