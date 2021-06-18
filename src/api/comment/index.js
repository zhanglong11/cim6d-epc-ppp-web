/*
 * @Description:评论接口
 * @Author:
 * @Date: 2020-01-19 09:11:06
 */
import { design } from '@/utils/axios'
const { post, get } = design
export default {
  //获取评论列表
  getCommentList: data => {
    return post('/project/comment/list', data)
  },
  // 新增评论
  addComment: data => {
    return post('/project/comment/add', data)
  }
}
