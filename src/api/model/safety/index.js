import axios, { bimSynergy } from '@/utils/axios'
const { post, get } = bimSynergy
export default {
  //安全检查关联列表
  getSafetyBindPage: data => {
    return axios.model.post(`/inspect/task/safety/bindPage`, data)
  },
  //安全文明关联列表
  getSafetyCivilizationBindPage: data => {
    return axios.model.post(`/safety/bim/civilization/list`, data)
  },
  // 安全检查关联
  safetyCheckBimBind: data => {
    return post(`/safetyCheckBimBind/bind`, data)
  },
  // 安全检查取消关联
  safetyCheckUnbind: data => {
    return post(`/safetyCheckBimBind/unbind`, data)
  },
  // 安全文明关联
  safetyCultureBimBind: data => {
    return post(`/safetyCultureBimBind/bind`, data)
  },
  // 安全文明取消关联
  safetyCultureUnbind: data => {
    return post(`/safetyCultureBimBind/unbind`, data)
  },
  //获取guid
  getCheckGuid: data => {
    return post(`/safetyCheckBimBind/selectByTargetId`, { projectId: localStorage.getItem('projectId'), ...data })
  },
  //获取guid
  getCultureGuid: data => {
    return post(`/safetyCultureBimBind/selectByTargetId`, { projectId: localStorage.getItem('projectId'), ...data })
  }
}
