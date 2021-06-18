import axios from '@/utils/axios'
export default {
  //总物资计划列表
  getTotalMaterialList: data => {
    return axios.construction.post('/project/material/list', data)
  },
  //总物资计划编辑
  totalMaterialUpdate: data => {
    return axios.construction.post('/project/material/source/update', data)
  }
}
