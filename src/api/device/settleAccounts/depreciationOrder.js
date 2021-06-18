/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 03bc9435863f3f2d1377b33ddda1abbfdaa297e7
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资折旧单 列表接口对接(80%)、新增接口对接(60%)、新增界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b3a4aa7c259c85548859d00bdc08c147853936bc
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单 选择采购单和采购明细模态框组件开发，列表接口对接、新增接口对接、删除接口对接
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b5e5a2177d49291f9e7b2997ee96dc6975731b83
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单 对接物资折旧单编辑接口、保存提交功能、详情查询接口、详情页样式重新调整
@补加代码注释日期: 2020-04-11
*/
import axios from '@/utils/axios'
export default {
  //查询物资折旧单列表
  getDepreciationOrderList: data => {
    return axios.construction.post('/material/depreciation/bill/list', data)
  },
  //新增物资折旧单
  addDepreciationOrder: data => {
    return axios.construction.post('/material/depreciation/bill/add', data)
  },
  //编辑物资折旧单
  editDepreciationOrder: data => {
    return axios.construction.post('/material/depreciation/bill/update', data)
  },
  //查询物资折旧单详情
  getDepreciationOrderDetailById: id => {
    return axios.construction.get(`/material/depreciation/bill/get/${id}`)
  },
  //删除物资折旧单
  deleteDepreciationOrder: id => {
    return axios.construction.get(`/material/depreciation/bill/delete/${id}`)
  }
}
