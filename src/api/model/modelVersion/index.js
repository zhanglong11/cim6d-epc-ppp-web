import axios from '@/utils/axios'
const { post, get } = axios
export default {
  addVersion: data => {
    return post(`/project/bim/version/add`, data)
  },
  deleteVersionById: id => {
    return get(`/project/bim/version/delete/${id}`, {})
  },
  getVersionById: id => {
    return get(`/project/bim/version/get/${id}`, {})
  },
  getVersionList: data => {
    return post(`/project/bim/version/list`, data)
  },
  updateVersion: data => {
    return post(`/project/bim/version/update`, data)
  },
  // 保存单体
  saveEntity: data => {
    return post(`/bim/version/entity/save`, data)
  },
  getEntityTree: id => {
    return post(`/bim/version/entity/tree/${id}`, {})
  },
  getModelTreeList: data => {
    return axios.gis.get(`/feign/construction/bim/modelTreeList`, data)
  },
  getModelVersionList: modelId => {
    return axios.gis.get(`/feign/construction/bim/${modelId}/modelVersionList`, {})
  }
}
