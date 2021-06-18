import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.material.post(`/equipmentMaintenancePlan/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.material.post(`/equipmentMaintenancePlan/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.material.post(`/equipmentMaintenancePlan/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.material.get(`/equipmentMaintenancePlan/delete/${id}`),

  //详情
  detail: id => axios.material.get(`/equipmentMaintenancePlan/get/${id}`),

  //更新状态
  updateStatus: param =>
    axios.material.post(`/equipmentMaintenancePlan/updateStatus`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
