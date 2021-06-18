import { construction } from '@/utils/axios'
const { post, get } = construction
export default {
  //添加现场签证
  addSceneVisa: data => {
    return post('/contractSiteAccess/add', data)
  },
  //获取现场签证列表
  getSceneVisaList: data => {
    return post('/contractSiteAccess/list', data)
  },
  deleteSceneVisaById: id => {
    return post(`/contractSiteAccess/delete/${id}`, {})
  },
  getSceneVisaById: id => {
    return get(`/contractSiteAccess/get/${id}`, {})
  },
  updateSceneVisaById: data => {
    return post(`/contractSiteAccess/update`, data)
  },
  // 查询变更前工期
  selectBeforeDate: id => {
    return post(`/contractSiteAccess/${id}/selectBeforeDate`, {})
  },
  // 现场签证详情
  addSceneVisaDetail: data => {
    return post(`/contractSiteAccessDetail/add`, data)
  },
  getSceneVisaDetailList: data => {
    return post('/contractSiteAccessDetail/list', data)
  },
  deleteSceneVisaDetailById: id => {
    return post(`/contractSiteAccessDetail/delete/${id}`, {})
  },
  getSceneVisaDetailById: id => {
    return get(`/contractSiteAccessDetail/get/${id}`, {})
  },
  updateSceneVisaDetailById: data => {
    return post(`/contractSiteAccessDetail/update`, data)
  },
  // 选择清单
  getDecomposeList: data => {
    return post('/contractInventorySubprojectUnivalenceMeasure/decompose/list', data)
  },
  //审核接口
  handleCheck: data => {
    return post(`/check`, data)
  }
}
