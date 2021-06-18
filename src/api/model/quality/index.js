import axios, { bimSynergy } from '@/utils/axios'
const { post, get } = bimSynergy
export default {
  //质量安全关联列表
  getQualityBindPage: data => {
    return axios.model.post(`/inspect/task/quality/bindPage`, data)
  },
  //质量验收关联列表
  getQualityAcceptanceBindPage: data => {
    return axios.model.post(`/quality/acceptanceApply/bindPage`, data)
  },
  // 质量问题关联
  qualityProblemBimBind: data => {
    return post(`/qualityProblemBimBind/bind`, data)
  },
  //质量问题取消关联
  qualityProblemUnbind: data => {
    return post(`/qualityProblemBimBind/unbind`, data)
  },
  // 质量验收关联
  qualityAcceptanceBimBind: data => {
    return post(`/qualityAcceptanceBimBind/bind`, data)
  },
  // 质量验收取消关联
  qualityAcceptanceUnbind: data => {
    return post(`/qualityAcceptanceBimBind/unbind`, data)
  },
  //获取guid
  getGuid: data => {
    return post(`/qualityProblemBimBind/selectByTargetId`, { projectId: localStorage.getItem('projectId'), ...data })
  },

  //质量验收获取guid
  getAcceptGuid: data => {
    return post(`/qualityAcceptanceBimBind/selectByTargetId`, { projectId: localStorage.getItem('projectId'), ...data })
  }
}
