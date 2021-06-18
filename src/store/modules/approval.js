/*
 * @Author: 耿为刚 创建
 * @Date: 2020-04-28
 */
import router from '@/router'
import { approvalApi } from '@/api/approval'
import Vue from 'vue'
const state = {
  approvalType: localStorage.getItem('approvalType') || '', // 审批类型
  approvalTargetId: localStorage.getItem('approvalTargetId') || '', // 审批主键Id
  approvalRouter: localStorage.getItem('approvalRouter') ? JSON.parse(localStorage.getItem('approvalRouter')) : {} // 审批路由
}

const mutations = {
  // 设置审批缓存
  async setApprovalRouter(state, obj) {
    let params = {
      page: 1,
      rows: 200,
      type: 1
    }
    const result = await approvalApi.queryDefinitionList(params)
    let datas = result.data.records || []
    let approvalRouter = {}
    datas.map(item => {
      approvalRouter[item.processDefinitionKey] = {
        pcRouteUrl: item.pcRouteUrl,
        appRouteUrl: item.appRouteUrl,
        processDefinitionName: item.processDefinitionName
      }
    })
    localStorage.setItem('approvalRouter', JSON.stringify(approvalRouter))
    state.approvalRouter = approvalRouter
    console.log('设置审批缓存', datas, approvalRouter)
  },
  // 跳转审批
  toApproval(state, { projectItem, taskItem }) {
    let routerList = taskItem.routerName.split(',')
    projectItem.routerName = routerList[taskItem.index]
    projectItem.isApproval = true
    this.commit('setProjectLocalStorage', projectItem)
    this.commit('toApprovalDetails', {
      index: taskItem.index,
      routerList,
      targetId: taskItem.targetId,
      isCheck: parseInt(taskItem.index) === 0
    })
    // router.push({
    //   name: routerList[taskItem.index],
    //   params: {
    //     id: taskItem.targetId,
    //     isCheck: parseInt(taskItem.index) === 0
    //   },
    //   query: {
    //     isCheck: true
    //   }
    // })
  },
  // 跳转审批详情
  toApprovalDetails(state, obj) {
    console.log('跳转审批详情', {
      name: obj.routerList[obj.index],
      params: {
        id: obj.targetId,
        isCheck: parseInt(obj.index) === 0
      },
      query: {
        isCheck: parseInt(obj.index) === 0
      }
    })
    router.push({
      name: obj.routerList[obj.index],
      params: {
        id: obj.targetId,
        isCheck: parseInt(obj.index) === 0
      },
      query: {
        isCheck: parseInt(obj.index) === 0
      }
    })
  },
  // 审批完成
  approvalCompleted(state) {
    router.go(-1)
  }
}

export default {
  state,
  mutations
}
