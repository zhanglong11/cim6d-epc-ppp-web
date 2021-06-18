import axios from '@/utils/axios'
export default {
  //需用计划列表
  getNeedPlanList: data => {
    return axios.construction.post('/material/plan/list', data)
  },
  //新增需用计划
  addNeedPlan: data => {
    return axios.construction.post('/material/plan/add', data)
  },
  //编辑需用计划
  editNeedPlan: data => {
    return axios.construction.post('/material/plan/update', data)
  },
  //获取需用计划详情
  getNeedPlanDetail: id => {
    return axios.construction.get(`/material/plan/get/${id}`)
  },
  //删除需用计划
  deleteNeedPlan: id => {
    return axios.construction.get(`/material/plan/delete/${id}`)
  }
}
