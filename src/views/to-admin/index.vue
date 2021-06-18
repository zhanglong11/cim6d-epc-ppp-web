<template>
  <div></div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
import { messageApi } from '@/api/message'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      token: this.$route.query.token,
      subModules: this.$route.query.subModules || '', // 消息模块
      projectInfo: {
        id: this.$route.query.id || '',
        type: this.$route.query.type || '',
        name: this.$route.query.name || '',
        title: this.$route.query.title || '',
        projectUserCategory: this.$route.query.projectUserCategory || ''
      },
      // 审批相关
      taskInfo: {
        processDefinitionCategory: this.$route.query.processDefinitionCategory || '',
        targetId: this.$route.query.targetId || '',
        index: this.$route.query.index
      }
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      if (!this.token) {
        return
      }
      setToken(this.token)
      this.$store.commit('setWebTitle', {
        serviceCode: this.projectInfo.type,
        webTitle: this.projectInfo.title
      })
      this.$store.commit('setProjectId', this.projectInfo.id)
      this.$store.commit('setProjectUserCategory', this.projectInfo.projectUserCategory)
      this.$store.commit('getPower', () => {
        if (this.taskInfo.processDefinitionCategory && this.taskInfo.targetId) {
          let routerName = this.$enum.getDescByValue('APPROVAL_TYPE', this.taskInfo.processDefinitionCategory) || ''
          if (!routerName) {
            // 项目中转
            this.$store.commit('setProjectLocalStorage', this.projectInfo)
            return
          }
          // 审批中转
          this.$store.commit('toApproval', {
            projectItem: Object.assign({}, this.projectInfo),
            taskItem: Object.assign({}, this.taskInfo, { routerName })
          })
        } else if (this.subModules) {
          this.getCommonMessageList()
        } else {
          // 项目中转
          this.$store.commit('setProjectLocalStorage', this.projectInfo)
        }
      })
    },
    // 获取消息分类列表
    async getCommonMessageList() {
      let result = await messageApi.getCommonMessageList()
      let datas = result.data
      let subModulesItem = _.find(datas, { subModules: this.subModules })
      let subModulesRouterName = ''
      if (subModulesItem) {
        // 处理消息路由名字
        let redirectUrl = subModulesItem.redirectUrl.split(',')
        if (redirectUrl.length > 1) {
          subModulesRouterName = this.projectInfo.type === 'decoration' ? redirectUrl[1] : redirectUrl[0]
        } else {
          subModulesRouterName = subModulesItem.redirectUrl
        }
      }
      if (!subModulesRouterName) {
        // 找不到路由配置进行项目中转
        this.$store.commit('setProjectLocalStorage', this.projectInfo)
        return
      }
      // 消息中转
      this.$store.commit('toMessageDetails', {
        projectItem: Object.assign({}, this.projectInfo, { targetId: this.taskInfo.targetId, isApproval: true }),
        subModulesRouterName
      })
    }
  }
}
</script>
