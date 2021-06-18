import { construction } from '@/utils/axios'
const { get, post } = construction
export default {
  //添加过磅单
  addOrder: data => {
    return post('/sampling/bill/add', data)
  },
  //获取过磅单列表
  getList: data => {
    return post('/sampling/bill/list', data)
  },
  deleteOrder: id => {
    return get(`/sampling/bill/delete/${id}`, {})
  },
  getDetailById: id => {
    return get(`/sampling/bill/get/${id}`, {})
  },
  updateOrder: data => {
    return post('/sampling/bill/update', data)
  }
}
