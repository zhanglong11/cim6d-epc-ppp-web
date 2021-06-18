import api from '@/api/workflow'
import toTree from '@/utils/toTree'
export default {
  namespaced: true,
  state: {
    userListTree: [],
    roleList: [],
    roleCategory: [],
    formList: [],
    processCategory: [],
    processCategoryTree: []
  },
  mutations: {
    changeUserListTree(state, treeData) {
      state.userListTree = treeData
    },
    changeRoleList(state, list) {
      state.roleList = list
    },
    changeRoleCategory(state, list) {
      state.roleCategory = list
    },
    changeFormList(state, list) {
      state.formList = list
    },
    changeProcessCategory(state, list) {
      state.processCategory = list
      state.processCategoryTree = toTree(list)
    }
  },
  actions: {
    async getRoleList({ commit }) {
      const list = await api.getRoleList()
      commit('changeRoleList', list)
    },
    async getRoleCategory({ commit }) {
      const list = await api.getRoleCategory()
      commit('changeRoleCategory', list)
    },
    async getFormList({ commit }) {
      const list = await api.getFormList()
      let newList = []
      list.map(item => {
        if (item.children) {
          newList.push(item)
        }
      })
      commit('changeFormList', newList)
    },
    async getProcessCategory({ commit }) {
      const list = await api.getProcessCategory()
      commit('changeProcessCategory', list)
    }
  }
}
