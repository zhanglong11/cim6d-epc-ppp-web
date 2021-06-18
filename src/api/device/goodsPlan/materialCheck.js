/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 6600fc69b57e504075ed3574a7619696fc484db0
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，完成 原材料检验计划 查询列表、新增(编辑)、删除接口对接；总物资计划模态框添加物资类别参数控制
@补加代码注释日期: 2020-04-11
*/
import axios from '@/utils/axios'
export default {
  //查询原材料检验计划列表
  getMaterialCheckList: data => {
    return axios.construction.post('/raw/material/inspect/rule/list', data)
  },
  //新增(编辑)原材料检验计划
  addMaterialCheck: data => {
    return axios.construction.post('/raw/material/inspect/rule/add', data)
  },
  //删除原材料检验计划
  deleteMaterialCheck: id => {
    return axios.construction.get(`/raw/material/inspect/rule/delete/${id}`)
  }
}
