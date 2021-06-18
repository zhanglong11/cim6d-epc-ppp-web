import { bimSynergy } from '@/utils/axios'
const { post, get } = bimSynergy
export default {
  //获取最新施工计划任务列表
  getComponentBindTaskList: data => {
    return post(`/componentBind/schedule/taskList`, data)
  },
  // 关联
  componentBind: data => {
    return post(`/componentBind/schedule/bind`, data)
  },
  //取消关联
  componentCancelBind: id => {
    return post(`/componentBind/schedule/cancelBind/${id}`, {})
  }
}
