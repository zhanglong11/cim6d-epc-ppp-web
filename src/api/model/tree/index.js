import axios, { gis } from '@/utils/axios'
import http from '@/utils/axios'
const { post, get } = gis
export default {
  //获取项目下生效的资源树
  getProjectTreeData: projectId => {
    return axios.post(`/project/bim/tree/active/${projectId}`, {})
  },
  //楼层树
  getFloorTreeData: bimResourceId => {
    return http.gis({
      url: `/noToken/old/basic/commonFile/get/fdht/bim_${bimResourceId}/space.json`,
      method: 'get'
    })
  },
  //专业树
  getSpecialTreeData: bimResourceId => {
    return http.gis({
      url: `/noToken/old/basic/commonFile/get/fdht/bim_${bimResourceId}/special.json`,
      method: 'get'
    })
  },
  //项目特征树
  getProjectFeatureTreeData: bimResourceId => {
    return http.gis({
      url: `/noToken/old/basic/commonFile/get/fdht/bim_${bimResourceId}/bill.json`,
      method: 'get'
    })
  }
}
