/**
 * @author 李建敏
 * @date 2020/02/24 创建
 * @date 2020/03/09 修改   3-18行    添加组织列表和人员分组接口
 * @date 2020/03/10 修改   17-21行   添加获取表单列表接口
 * @date 2020/03/10 修改   11-16行   调整人员接口为项目下的
 * @date 2020/03/12 修改   21-33行   添加获取流程分类接口
 * @date 2020/03/13 修改   13-16行   修改角色人员接口
 */

/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/

import axios from '@/utils/axios'
import toTree from '@/utils/toTree'

export default {
  getOrganList() {
    return axios.system.post('cim6d/system/project/organ/query/', { projectId: localStorage.getItem('projectId') })
  },
  getRoleList() {
    return axios.system
      .post('cim6d/system/project/organ/query', { projectId: localStorage.getItem('projectId') })
      .then(res => (res.data ? res.data : []))
  },
  getRoleCategory() {
    return axios.system
      .post('cim6d/system/project/role', { projectId: localStorage.getItem('projectId') })
      .then(res => (res.data ? res.data : []))
  },
  getFormList() {
    return axios.workflow.post('custom/form/list', { page: 1, rows: 1000 }).then(res => res.data)
  },
  getProcessCategory() {
    return axios.workflow
      .post('activiti/process/type/list', {
        page: 1,
        rows: 10000,
        argGroup: 'processCategory'
      })
      .then(res => {
        return res.data.records
      })
  }
}
