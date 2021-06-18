/**
  任务名称：task#2867 【智慧工地2.0-前端】工序进度模块功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/

import http from '@/utils/axios'
export const systemConfigApi = {
  // 查询列表
  queryListArg: data => {
    return http.working({
      url: 'building/arg/list',
      method: 'post',
      data
    })
  },
  // 添加参数
  addArg: data => {
    return http.working({
      url: 'building/arg/add',
      method: 'post',
      data
    })
  },
  // 编辑参数
  updateArg: data => {
    return http.working({
      url: 'building/arg/update',
      method: 'post',
      data
    })
  },
  // 删除参数
  deleteArg: id => {
    return http.working({
      url: `building/arg/delete/${id}`,
      method: 'get'
    })
  },
  // 获取参数树
  queryTreeArg: data => {
    // return http.working({
    //   url: 'cim6d/arg/tree',
    //   method: 'post',
    //   baseUrl: 'cim6d-global',
    //   data
    // })
    return http.global({
      url: 'cim6d/arg/tree',
      method: 'post',
      data
    })
  }
}
