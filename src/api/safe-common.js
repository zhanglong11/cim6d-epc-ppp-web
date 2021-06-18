import axios from '@/utils/axios'

export default {
  //人员列表
  userList: param => axios.post(`/cim6d/system/user/list`, param)
}
