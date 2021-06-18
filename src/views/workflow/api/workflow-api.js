/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19
 */

import http from '@/utils/axios'
export const workFlowApi = {
  // 获取工作流布局
  getProcessLayout: targetId => {
    return http.workflow({
      url: `/process-instance/${targetId}/diagram-layout`,
      method: 'get'
    })
  },
  // 获取任务表单
  getTaskForm: taskId => {
    return http.workflow({
      url: `/activiti/process/definition/get/task/form/${taskId}`,
      method: 'get'
    })
  },
  // 添加分组
  addCategory: data => {
    return http.workflow({
      url: '/category/add',
      method: 'post',
      data
    })
  },
  // 编辑分组
  updateCategory: data => {
    return http.workflow({
      url: '/category/update',
      method: 'post',
      data
    })
  },
  // 删除分组
  deleteCategory: id => {
    return http.workflow({
      url: `/category/delete/${id}`,
      method: 'get'
    })
  },
  // 分组树
  treeCategory: data => {
    return http.workflow({
      url: '/category/tree',
      method: 'post',
      data
    })
  },
  // 模型列表
  queryModelListCategory: data => {
    return http.workflow({
      url: '/activiti/model/list',
      method: 'post',
      data
    })
  },
  // 获取自定义表单列表
  queryFormList: data => {
    return http.workflow({
      url: '/custom/form/list',
      method: 'post',
      data
    })
  },
  // 获取模型详情
  getModel: id => {
    return http.workflow({
      url: `/activiti/model/json/${id}`,
      method: 'get'
    })
  }
}
