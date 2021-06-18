import axios from '@/utils/axios'
export default {
  //图纸会审列表
  getDrawReviewList: data => {
    return axios.construction.post('/drawingMeeting/list', data)
  },
  //新增图纸会审
  addDrawReview: data => {
    return axios.construction.post('/drawingMeeting/save', data)
  },
  //修改图纸会审
  editDrawReview: data => {
    return axios.construction.post('/drawingMeeting/update', data)
  },
  //删除图纸会审
  deleteDrawReview: id => {
    return axios.construction.get(`/drawingMeeting/delete/${id}`)
  },
  //获取图纸会审详情
  getDrawReviewDetail: id => {
    return axios.construction.get(`/drawingMeeting/get/${id}`)
  }
}
