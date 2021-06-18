import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.material.post(`/equipmentRepair/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.material.post(`/equipmentRepair/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.material.post(`/equipmentRepair/submit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.material.get(`/equipmentRepair/delete/${id}`),

  //详情
  detail: id => axios.material.get(`/equipmentRepair/get/${id}`),

  //审核
  check: param =>
    axios.material.post(`/equipmentRepair/updateRepair`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //执行维修
  beginRepair: param =>
    axios.material.post(`/equipmentRepair/beginRepair`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //验收
  accept: param =>
    axios.material.post(`/equipmentRepair/acceptRepair`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新状态
  updateStatus: param =>
    axios.material.post(`/equipmentRepair/updateStatus`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
