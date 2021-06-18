import http from '@/utils/axios'
export const messageApi = {
  // 获取消息分类列表 @author zhangshilong
  getCommonMessageList: () => {
    return http.system({
      url: '/message/category/getCommonMessageList',
      method: 'get'
    })
  }
}
