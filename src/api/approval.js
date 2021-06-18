// 审批跳转API

import http from '@/utils/axios'
export const approvalApi = {
  // 查询审批跳转列表
  queryDefinitionList: data => {
    return http.admin({
      url: '/route/definition/list',
      method: 'post',
      data
    })
  }
}
