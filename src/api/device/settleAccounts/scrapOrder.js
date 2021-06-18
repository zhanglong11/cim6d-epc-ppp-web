/*
 * @任务名称: 2623/物资报废处理单遗留问题
 * @开发人员: 董渊海
 * @创建日期: 2020-03-13
 * @任务类型: 全新代码
 *
 * @修改日期: 2020-03-16
 * @任务类型: 修改代码，添加新增、修改、删除、详情查询接口，修改比例(90%)
 */
/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 1d1dc3029f349f97ee597e982bfb6edb5d8220c9
@代码提交修改日期: 2020-03-13
@任务类型: 修改代码，物资报废处理单 列表接口对接(50%)、新增报废处理单页面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: c168eaca35978f92de892657dd54701bdaaed203
@代码提交修改日期: 2020-03-16
@任务类型: 修改代码，物资报废处理单 对接 列表接口(100%)、新增接口、编辑接口、保存提交功能、删除接口、详情接口、模态框选择剩余库存物资列表接口
@补加代码注释日期: 2020-04-11
*/
import axios from '@/utils/axios'
export default {
  //查询物资报废处理单列表
  getScrapOrderList: data => {
    return axios.construction.post('/material/scrap/bill/list', data)
  },
  //新增物资报废处理单
  addScrapOrder: data => {
    return axios.construction.post('/material/scrap/bill/add', data)
  },
  //编辑物资报废处理单
  editScrapOrder: data => {
    return axios.construction.post('/material/scrap/bill/update', data)
  },
  //查询物资报废处理单详情
  getScrapOrderDetail: id => {
    return axios.construction.get(`/material/scrap/bill/get/${id}`)
  },
  //删除物资报废处理单
  deleteScrapOrder: id => {
    return axios.construction.get(`/material/scrap/bill/delete/${id}`)
  }
}
