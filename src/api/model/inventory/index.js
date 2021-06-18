import axios, { bimSynergy } from '@/utils/axios'
const { post, get } = bimSynergy
export default {
  //清单列表
  getInventoryList: data => {
    return axios.construction.post(`/contractInventorySubprojectUnivalenceMeasure/listByProject`, data)
  },
  // 关联
  componentBind: data => {
    return post(`/componentBind/inventory/bind`, data)
  },

  // 自动匹配
  autoMatch: () =>
    post(`/componentBind/autoCorrelation/${localStorage.getItem('projectId')}`, {}, { timeout: 3600000 }),

  //取消关联
  componentCancelBind: id => {
    return post(`/componentBind/inventory/cancelBind/${localStorage.getItem('projectId')}/${id}`, {})
  },

  //轮询获取进度

  getPercent: () => post(`/componentBind/selectAutoCorrelationProgress/${localStorage.getItem('projectId')}`, {})
}
