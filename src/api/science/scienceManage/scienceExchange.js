import axios from '@/utils/axios'
export default {
  //技术交底列表
  getScienceExchangeList: data => {
    return axios.construction.post('/technologyDisclosure/list', data)
  },
  //新增技术交底
  addScienceExchange: data => {
    return axios.construction.post('/technologyDisclosure/save', data)
  },
  //修改技术交底
  editScienceExchange: data => {
    return axios.construction.post('/technologyDisclosure/update', data)
  },
  //删除技术交底
  deleteScienceExchange: id => {
    return axios.construction.get(`/technologyDisclosure/delete/${id}`)
  },
  //获取技术交底详情
  getScienceExchangeDetail: id => {
    return axios.construction.get(`/technologyDisclosure/get/${id}`)
  }
}
