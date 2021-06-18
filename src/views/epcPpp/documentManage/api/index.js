import axios from '@/utils/axios'
export default {
  //资料列表
  rootList: type =>
    axios.ppp.post(`/document/firstLevel/query`, {
      projectId: localStorage.getItem('projectId'),
      category: type
    }),

  //子列表
  childList: id =>
    axios.ppp.post(`/document/subLevel/query`, {
      projectId: localStorage.getItem('projectId'),
      id
    }),

  //添加资料
  add: param =>
    axios.ppp.post(`/document/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //修改资料
  update: param =>
    axios.ppp.post(`/document/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  deleteRoot: id => axios.ppp.get(`/document/firstLevel/delete/${id}`),

  //删除子集
  deleteChild: param =>
    axios.ppp.post(`/document/otherLevel/delete`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
