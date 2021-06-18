/*
 * @Description:存储bim相关的参数
 * @Author:申豪强
 * @Date: 2020-03-20 11:44:59
 */
/*
 * @任务编号: 2522 || 树与模型交互,存储树形选中信息
 * @开发人员:申豪强
 * @日期:2020-03-20
 * @任务类型: 新代码
 */
const state = {
  // 单体楼层勾选数据
  singleChecks: [],
  // 专业构件数据
  majorChecks: [],
  // 获取模型数据：所有版本modelIds
  versionModelIds: [],
  // 清单关联的
  inventory: []
}
const mutations = {
  changeSingle(state, data) {
    state.singleChecks = data
  },
  changeMajor(state, data) {
    state.majorChecks = data
  },
  changeVersionModelIds(state, data) {
    state.versionModelIds = data
  },
  changeInventory(state, data) {
    state.inventory = data
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
