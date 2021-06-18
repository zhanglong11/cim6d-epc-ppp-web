/**
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
  增加用户相关信息缓存
**/
import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getOrigin } from '@/utils/'

const state = {
  token: getToken(),
  id: localStorage.getItem('id') || '',
  name: localStorage.getItem('name') || '',
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}, // 缓存用户信息
  createTime: localStorage.getItem('createTime') || '',
  avatar: localStorage.getItem('avatar') || '',
  companyId: localStorage.getItem('companyId') || '',
  companyAdminFlag: localStorage.getItem('companyAdminFlag') === '1'
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERINFO: (state, userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    state.userInfo = userInfo
  },
  SET_TIME: (state, createTime) => {
    state.createTime = createTime
  },
  SET_AVATAR: (state, avatar) => {
    localStorage.setItem('avatar', avatar)
    state.avatar = avatar
  },
  SET_COMPANY_ID: (state, companyId) => {
    state.companyId = companyId
  },
  SET_COMPANY_ADMIN_FLAG: (state, companyAdminFlag) => {
    state.companyAdminFlag = companyAdminFlag
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return login(userInfo).then(res => {
      commit('SET_TOKEN', res.data)
      setToken(res.data)
    })
  },

  // get info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then(res => {
          const datas = res.data
          /**
            任务名称：task#2849 【智慧工地2.0-前端】公告管理》列表、新建、编辑、详情切图及功能开发
            开发人员：耿为刚
            日期：2020-04-02
            任务类型：增加用户信息缓存
          **/
          localStorage.setItem('id', datas.id)
          localStorage.setItem('name', datas.realName)
          localStorage.setItem('companyId', datas.companyId)
          localStorage.setItem('createTime', datas.createTime)
          localStorage.setItem('companyAdminFlag', datas.companyAdminFlag)
          commit('SET_ID', datas.id)
          commit('SET_NAME', datas.realName)
          commit('SET_TIME', datas.createTime)
          commit('SET_AVATAR', datas.headImage)
          commit('SET_USERINFO', datas)
          // 因为有参与方登录，所以公司id从项目中获取
          // commit('SET_COMPANY_ID', datas.companyId)
          commit('SET_COMPANY_ADMIN_FLAG', datas.companyAdminFlag === 1)
          resolve(datas)
        })
        .catch(error => {
          removeToken()
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    commit('SET_TOKEN', '')
    removeToken()
    resetRouter()
    commit('SET_NAME', '')
    commit('SET_AVATAR', '')
    commit('SET_TIME', '')
    commit('SET_COMPANY_ID', '')
    commit('SET_COMPANY_ADMIN_FLAG', '')
    localStorage.clear()
    sessionStorage.clear()
    if (process.env.NODE_ENV === 'development') {
      location.reload()
    } else {
      location.href = `${getOrigin(-2)}/login`
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
