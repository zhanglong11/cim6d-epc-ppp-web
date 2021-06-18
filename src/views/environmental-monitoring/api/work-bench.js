/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-27
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-04-01 15:01:20
 */

import http from '@/utils/axios'
export const workBenchApi = {
  // 获取项目列表
  queryProjectList: data => {
    return http.get('cim6d/system/project/list', data)
  }
}
