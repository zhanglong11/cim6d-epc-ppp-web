import { ppp } from '@/utils/axios'
export default {
  //党建首页
  getHome(body) {
    return ppp.post('partyBuilding/home/query', body)
  },
  // 获取党员列表
  getCcpMembers(body) {
    return ppp.post('partyMemberManagement/list', body)
  },
  // 获取党员信息
  getCcpMemberById(id) {
    return ppp.get('partyMemberManagement/get/' + id)
  },
  //新建党员
  addCcpMember(body) {
    return ppp.post('partyMemberManagement/add', { projectId: localStorage.getItem('projectId'), ...body })
  },
  //删除党员
  removeCcpMemberById(id) {
    return ppp.get('partyMemberManagement/delete/' + id)
  },
  //编辑党员
  updateCcpMember(body) {
    return ppp.post('partyMemberManagement/update', { ...body })
  },
  // 获取党建要闻列表
  getCcpNews(body) {
    return ppp.post('partyBuildingNews/list', body)
  },
  // 获取党建要闻列表详情
  getCcpNewsById(id) {
    return ppp.get('partyBuildingNews/get/' + id)
  },
  // 新建党建要闻
  saveCcpNews(body) {
    return ppp.post('partyBuildingNews/' + (body.id ? 'update' : 'add'), body)
  },
  // 删除党建要闻
  removeCcpNewsById(id) {
    return ppp.get('partyBuildingNews/delete/' + id)
  },
  /**
   * 党建要闻推荐
   * @param {String} id
   * @param {Number} type  1为宣传图 2为头条
   * @returns {Promise}
   */
  addNewsRecommend(id, type) {
    return ppp.post('partyBuildingNews/addRecommend', { id, type })
  },
  /**
   *党建要闻取消推荐
   * @param {String} id
   * @param {Number} type  1为宣传图 2为头条
   * @returns {Promise}
   */
  cancelNewsRecommend(id, type) {
    return ppp.post('partyBuildingNews/cancelRecommend', { id, type })
  },
  //获取党建活动列表
  getCcpActiviti(body) {
    return ppp.post('partyBuilding/activity/pageList', body)
  },
  //获取党建活动详情
  getCcpActivitiById(id) {
    return ppp.get('partyBuilding/activity/detail/' + id)
  },
  // 新建党建活动
  addCcpActiviti(body) {
    return ppp.post('partyBuilding/activity/add', body)
  },
  // 编辑党建活动
  updateCcpActiviti(body) {
    return ppp.post('partyBuilding/activity/update', body)
  },
  // 删除党建活动
  removeCcpActivitiById(id) {
    return ppp.get('partyBuilding/activity/delete/' + id)
  },
  // 新建党建活动成果
  addCcpActivitiResult(body) {
    return ppp.post('partyBuilding/activity/addResult', body)
  },
  // 获取党建活动成果
  getCcpActivitiResultById(id) {
    return ppp.get('partyBuilding/activity/viewResult/' + id)
  },
  /**
   * 活动推荐
   * @param {String} id
   * @param {Number} type  1为宣传图 2为头条
   * @returns {Promise}
   */
  addActivitiRecommend(id, type) {
    return ppp.post('partyBuilding/activity/recommend/add', { id, type })
  },
  /**
   * 活动取消推荐
   * @param {String} id
   * @param {Number} type  1为宣传图 2为头条
   * @returns {Promise}
   */
  cancelActivitiRecommend(id, type) {
    return ppp.post('partyBuilding/activity/recommend/cancel', { id, type })
  },
  // 获取党建资料列表
  getCcpData(body) {
    return ppp.post('partyBuildingDocument/list', { projectId: localStorage.getItem('projectId'), ...body })
  },
  // 新建党建资料
  addCcpData(body) {
    return ppp.post('partyBuildingDocument/add', { projectId: localStorage.getItem('projectId'), ...body })
  },
  // 删除党建资料
  removeCcpDataById(id) {
    return ppp.get('partyBuildingDocument/delete/' + id)
  },
  // 下载党建资料
  downloadCcpDataById(id) {
    return ppp.get('partyBuildingDocument/downLoad/' + id)
  }
}
