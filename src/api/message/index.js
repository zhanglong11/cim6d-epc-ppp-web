/*
 * @Description:消息接口
 * @Author:
 * @Date:
 */
import axios from '@/utils/axios'
export default {
  getList(data) {
    return axios.design.post('message/list', data)
  },
  getDetails(id) {
    return axios.design.get('/message/get/' + id)
  },
  deleteById(id) {
    return axios.design.get('message/delete/' + id)
  }
}
