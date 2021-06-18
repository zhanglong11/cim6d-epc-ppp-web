/*
 * @Description:公共接口
 * @Version:
 * @Autor:
 * @Date: 2020-02-14 17:02:48
 * @LastEditTime: 2020-02-21 10:16:08
 */
import axios from '@/utils/axios'
export default {
  getOrganList() {
    return axios.post('cim6d/system/project/organ/query', { projectId: localStorage.getItem('projectId') })
  },
  // 获取用户详情
  getUserById(id) {
    return axios.get('cim6d/system/user/get/' + id)
  },
  // 获取用户可用权限
  getPermissionList() {
    return axios.get('cim6d/system/power/available')
  },
  // 获取项目下部门列表
  getDepartList(data) {
    return axios.post('cim6d/system/project/organ/list', data)
  },
  // 获取参项单位列表
  getCompanyListByProjectId: id => {
    return axios.system.get('/project/participant/company/list/' + id)
  },
  /**
   任务名称：1256/新建采购单的问题
   开发人员：崔洛宜
   日期：2020-03-23
   BUG类型：自测bug
   **/
  getUserList(data) {
    return axios.post('cim6d/system/user/list', data)
  },
  // 参数列表
  /**
   * @param {{argGroup: string, [module]: String}} body 参数对象
   */
  getArgList(body) {
    return axios.construction.post('/cim6d/arg/tree', { module: 'construction-2.0,epcPPP' })
  },
  //添加参数
  /**
   * @param {{argGroup: string, argText: String, [module]: String}} arg 参数对象
   */
  addArg(arg) {
    return axios.construction.post('/building/arg/add', {
      module: 'construction-2.0',
      projectId: localStorage.getItem('projectId'),
      ...arg
    })
  },
  // 参数详情
  getArgById(id) {
    return axios.construction.get('/building/arg/get/' + id, {})
  },
  // 编辑参数
  updateArg(arg) {
    return axios.construction.post('/building/arg/update', arg)
  },
  // 删除参数
  removeArgById(id) {
    return axios.construction.get('/building/arg/delete/' + id, null)
  }
}
