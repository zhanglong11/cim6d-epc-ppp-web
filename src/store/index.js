/*
 * @Author: 耿为刚 创建
 * @Date: 2020-08-31 09:03:51
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-08-31 09:54:28
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import bim from './modules/bim'
import project from './modules/project'
import labour from '@/views/labour/store'
import iot from '@/views/iot/store'
import systemConfig from './modules/system-config' // 系统参数全局缓存
import approval from './modules/approval' // 审批全局缓存
import userPower from './modules/user-power' // 用户权限
import workflow from './modules/workflow'
import treeForEach from '@/utils/treeForEach'
import api from '@/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    workflow,
    bim,
    project,
    labour,
    iot,
    systemConfig,
    approval,
    userPower
  },
  getters,
  state: {
    userList: [],
    departmentUserList: [],
    departmentList: [],
    departmentUserListWithDep: []
  },
  mutations: {
    changeUserList(state, list) {
      state.userList = list
    },
    changeDepartmentUserList(state, list) {
      state.departmentUserList = list
    },
    changeDepartmentList(state, list) {
      state.departmentList = list
    },
    changeDepartmentUserListWithDep(state, list) {
      state.departmentUserListWithDep = list
    }
  },
  actions: {
    async getDepartmentUserList({ commit }, keyWords) {
      let data = await api.getOrganList().then(res => res.data || [])
      if (_.get(data, '0.children.0')) {
        data = data[0].children
      }
      let userList = []
      treeForEach(data, (e, parent) => {
        e.label = e.name
        if (!e.children) e.children = []
        if (e.type === 2) {
          e.organId = parent?.id
        }
        if (e.type === 3) {
          e.organId = parent.organId
          e.organName = parent.name
          e.id = e.userId
          delete e.children
          userList.push(e)
        }
      })
      commit('changeUserList', userList)
      commit('changeDepartmentUserList', data)
    },
    async getDepartmentList({ commit }) {
      const projectId = localStorage.getItem('projectId') || ''
      if (!projectId) {
        return
      }
      let obj = {
        projectId: localStorage.getItem('projectId')
      }
      let data = await api.getDepartList(obj).then(res => res.data[0].children)
      treeForEach(data, e => {
        e.label = e.name
        if (!e.children) delete e.children
      })
      commit('changeDepartmentList', data)
    },
    async getDepartmentUserListWithDep({ commit }) {
      let data = await api.getOrganList().then(res => res.data || [])
      treeForEach(data, e => {
        e.label = e.name
        if (_.size(e.userList))
          e.userList.forEach(user => {
            user.organId = e.id
            user.depName = e.name
          })
        if (e.userList) e.children = (e.children || []).concat(e.userList)
      })
      commit('changeDepartmentUserListWithDep', data)
    }
  }
})

export default store
