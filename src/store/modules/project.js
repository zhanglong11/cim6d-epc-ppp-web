/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-27
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-09-11 16:29:46
 */
import router from '@/router'
const state = {
  projectId: localStorage.getItem('projectId') || '', // 项目id
  companyName: localStorage.getItem('companyName') || '', // 公司名称
  companyId: localStorage.getItem('companyId') || '', // 公司名称
  projectUserCategory: localStorage.getItem('projectUserCategory') || '', //项目人员分类
  projectName: localStorage.getItem('projectName') || '', //项目名称
  projectType: localStorage.getItem('projectType') || '', // 项目类型
  latitude: localStorage.getItem('latitude') || '', // 项目位置
  longitude: localStorage.getItem('longitude') || '',
  projectDetail: localStorage.getItem('projectDetail') ? JSON.parse(localStorage.getItem('projectDetail')) : {} //项目详情
}

const mutations = {
  // 消息中转处理
  toMessageDetails(state, { projectItem, subModulesRouterName }) {
    this.commit('setProjectLocalStorage', projectItem)
    router.push({
      name: subModulesRouterName,
      params: {
        id: projectItem.targetId
      },
      query: {
        id: projectItem.targetId
      }
    })
  },
  // 设置项目缓存
  setProjectLocalStorage(state, obj) {
    this.commit('user/SET_COMPANY_ID', obj.companyId)
    localStorage.setItem('companyName', obj.companyName)
    localStorage.setItem('companyId', obj.companyId)
    localStorage.setItem('projectId', obj.id)
    localStorage.setItem('projectType', obj.type)
    localStorage.setItem('projectName', obj.name)
    localStorage.setItem('projectUserCategory', obj.projectUserCategory)
    localStorage.setItem('projectDetail', JSON.stringify(obj))
    state.projectId = obj.id
    state.companyName = obj.companyName
    state.projectName = obj.name
    state.projectType = obj.type
    state.projectUserCategory = obj.projectUserCategory
    state.projectDetail = obj
    this.commit('setLocal', {
      latitude: obj.latitude,
      longitude: obj.longitude
    })
    if (process.env.NODE_ENV === 'development' && !obj.isApproval) {
      this.commit('setWebTitle', {
        serviceCode: obj.type,
        webTitle: '本地开发'
      })
      this.commit('getPower', () => {
        let firstPowerRoute = this.state.userPower && this.state.userPower.power[0]
        if (router.history.current.name === firstPowerRoute) {
          location.reload()
        } else {
          // 判断有没有建设阶段首页权限
          if (this.state.userPower.power.includes('EpcPppCenter')) {
            router.push({
              name: 'EpcPppCenter'
            })
          } else {
            router.push({
              name: firstPowerRoute
            })
          }
        }
        this.dispatch('setSystemConfigStorage')
      })
      return
    } else {
      this.dispatch('setSystemConfigStorage')
    }
    let firstPowerRoute = this.state.userPower && this.state.userPower.power[0]
    if (!obj.routerName) {
      if (router.history.current.name === firstPowerRoute) {
        location.reload()
      } else {
        if (this.state.userPower.power.includes('EpcPppCenter')) {
          router.push({
            name: 'EpcPppCenter'
          })
        } else {
          router.push({
            name: firstPowerRoute
          })
        }
      }
    }
  },
  // 单独设置项目id
  setProjectId(state, projectId) {
    localStorage.setItem('projectId', projectId)
    state.projectId = projectId
  },
  // 单独设置项目人员分类
  setProjectUserCategory(state, projectUserCategory) {
    localStorage.setItem('projectUserCategory', projectUserCategory)
    state.projectUserCategory = projectUserCategory
  },
  // 单独设置项目名称
  setProjectName(state, projectName) {
    localStorage.setItem('projectName', projectName)
    state.projectName = projectName
  },
  // 单独设置项目详情
  setProjectDetail(state, projectDetail) {
    localStorage.setItem('projectDetail', JSON.stringify(projectDetail))
    state.projectDetail = projectDetail
  },
  // 单独设置项目经纬度
  setLocal(state, obj) {
    localStorage.setItem('latitude', obj.latitude)
    localStorage.setItem('longitude', obj.longitude)
    state.latitude = obj.latitude
    state.longitude = obj.longitude
  }
}

export default {
  state,
  mutations
}
