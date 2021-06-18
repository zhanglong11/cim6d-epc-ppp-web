import { construction } from '@/utils/axios'
const { get, post } = construction
export default {
  //获取列表
  getList: data => {
    return post('/project/material/remain/list', data)
  }
}
