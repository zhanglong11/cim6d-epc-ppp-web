//投资确认列表
import { ppp } from '@/utils/axios'

// 投资确认单列表
export const getConfirmList = body => {
  return ppp.post('invest/confirm/list', body)
}
// 投资确认详情
export const getConfirmDetail = id => {
  return ppp.get('invest/confirm/get/' + id)
}
// 删除投资确认单
export const removeConfirm = idList => {
  return ppp.post('invest/confirm/delete', idList)
}
//投资确认保存草稿
export const saveConfirm = body => {
  return ppp.post('invest/confirm/save', body)
}
//投资确认保存并提交
export const submitConfirm = body => {
  return ppp.post('invest/confirm/saveAndSubmit', body)
}
// 填报完成
export const completeConfirm = body => {
  return ppp.post('invest/confirm/task/complete', body)
}
