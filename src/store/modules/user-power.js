import { roleApi } from '@/api/role'
import toFlat from '@/utils/toFlat'
// 用户权限
const state = {
  power: localStorage.getItem('power') ? localStorage.getItem('power').split(',') : [],
  powerFlatList: [],
  serviceCode: localStorage.getItem('serviceCode') || 'construction',
  webTitle: localStorage.getItem('webTitle') || 'CIM6D' // 标题栏地址
}

const mutations = {
  // 设置通用标题栏
  setWebTitle(state, obj) {
    state.serviceCode = obj.serviceCode
    state.webTitle = obj.webTitle
    localStorage.setItem('serviceCode', obj.serviceCode)
    localStorage.setItem('webTitle', obj.webTitle)
  },
  // 获取用户授权
  getPower(state, callBack = () => {}) {
    if (!this.state.project.projectId) {
      return
    }
    return new Promise((resolve, reject) => {
      roleApi
        .getAvailablePower(this.state.project.projectId, +this.state.project.projectUserCategory === 1)
        .then(response => {
          const { data } = response
          const power = []
          const findArray = array => {
            if (!array) {
              return
            }
            array.map(e => {
              if (e.powerKey !== 'AppConstruction') {
                power.push(e.powerKey)
              }
              if (e.children && e.powerKey !== 'AppConstruction') {
                findArray(e.children)
              }
            })
          }
          state.powerFlatList = toFlat(data)
          data.map(item => {
            if (item.serviceCode === state.serviceCode) {
              findArray(item.children)
            }
          })
          localStorage.setItem('power', power.join(','))
          state.power = power
          callBack()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  setPower(state, obj) {}
}
const actions = {}

export default {
  state,
  mutations,
  actions
}
