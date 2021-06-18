import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.material.post(`/equipmentMaintenance/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.material.get(`/equipmentMaintenance/delete/${id}`),

  //详情
  detail: id => axios.material.get(`/equipmentMaintenance/get/${id}`),

  //更新状态
  updateStatus: param =>
    axios.material.post(`/equipmentMaintenance/updateStatus`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
