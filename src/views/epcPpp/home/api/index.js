import http from '@/utils/axios'
export const homeApi = {
  // 获取项目详情
  getProjectInfo: projectId => {
    return http.system({
      url: `/cim6d/system/project/get/${projectId}`,
      method: 'get'
    })
  },
  // 首页公告列表 @author huanghaoqi
  queryNoticeList: data => {
    return http.epcPPP({
      url: '/announcement/index/list',
      method: 'post',
      data
    })
  },
  // 消息 更新为已读
  readMessage: id => {
    return http.epcPPP({
      url: `/announcement/get/${id}`,
      method: 'get'
    })
  },
  // 标记全部已读 @author huanghaoqi
  markAllRead: data => {
    return http.epcPPP({
      url: '/announcement/markAllRead',
      method: 'post',
      data
    })
  },
  // 获取任务列表
  queryTaskList: data => {
    return http.workflow({
      url: '/task/list',
      method: 'post',
      data
    })
  },
  // 我发起的流程
  queryInstanceActivitiList: data => {
    return http.workflow({
      url: '/activiti/process/instance/started',
      method: 'post',
      data
    })
  },
  // 进度管理-查询进度文件列表 @author yangjiaqi
  querySchedulePlanList: data => {
    return http.schedule({
      url: '/plan/list',
      method: 'post',
      data
    })
  },
  // 进度管理-查询未完成进度计划 @author yangjiaqi
  queryScheduleUnfinishedTaskList: data => {
    return http.schedule({
      url: '/task/unfinished/list',
      method: 'post',
      data
    })
  },
  // 进度管理-查询个人进度计划 @author yangjiaqi
  queryScheduleTaskOwnList: data => {
    return http.schedule({
      url: '/task/own/list',
      method: 'post',
      data
    })
  },
  // 进度管理-领取任务 @author yangjiaqi
  getScheduleTaskReceive: taskId => {
    return http.schedule({
      url: `/task/receive/${taskId}`,
      method: 'get'
    })
  },
  // 进度管理-分配任务 @author yangjiaqi
  distributionScheduleTask: data => {
    return http.schedule({
      url: '/task/distribution',
      method: 'post',
      data
    })
  },
  // 进度管理-查看分配记录 @author yangjiaqi
  recordDistributionTask: taskId => {
    return http.schedule({
      url: `/task/distribution/record/${taskId}`,
      method: 'get'
    })
  },
  // 进度管理-开始任务 @author yangjiaqi
  startScheduleTask: taskId => {
    return http.schedule({
      url: `/task/start/${taskId}`,
      method: 'get'
    })
  },
  // 进度管理-结束任务 @author yangjiaqi
  finishScheduleTask: taskId => {
    return http.schedule({
      url: `/task/finish/${taskId}`,
      method: 'get'
    })
  },
  // 进度管理-进度任务确认 @author yangjiaqi
  confirmTask: data => {
    return http.schedule({
      url: '/task/confirm',
      method: 'post',
      data
    })
  },
  // 延期解决方案-提交 @author yangjiaqi
  delayProgram: data => {
    return http.schedule({
      url: '/delayProgram/submit',
      method: 'post',
      data
    })
  },
  // 进度工期变更-提交 @author yangjiaqi
  changeDurationTask: data => {
    return http.schedule({
      url: '/task/duration/change',
      method: 'post',
      data
    })
  },
  // 进度工期变更-关联任务列表 @author yangjiaqi
  queryTaskLink: taskId => {
    return http.schedule({
      url: `/task/link/${taskId}`,
      method: 'get'
    })
  },
  // 进度bim关联-按周期汇总 @author yangjiaqi
  scheduleTotal: data => {
    return http.epcPPP({
      url: '/qianjiang/ppp/schedule/bim/cycle/list',
      method: 'post',
      data
    })
  },
  // 首页-安全问题数量
  getSafetyIssueCount: data => {
    return http.epcPPP({
      url: '/safetyIssue/getSafetyIssueCount',
      method: 'post',
      data
    })
  },
  // 首页-质量问题数量
  getQualityIssueCount: data => {
    return http.epcPPP({
      url: '/quality/issue/getQualityIssueCount',
      method: 'post',
      data
    })
  },
  // 进度管理-项目进度面板 @author yangjiaqi
  getScheduleTaskPanel: projectId => {
    return http.epcPPP({
      url: `/qianjiang/ppp/schedule/task/panel/${projectId}`,
      method: 'get'
    })
  },
  // 获取天气信息
  queryWeatherInfo: data => {
    return http.system({
      url: '/weather/info',
      method: 'post',
      data
    })
  },
  // 获取确认投资额度
  getInvestConfirmAmount: projectId => {
    return http.epcPPP({
      url: `/invest/confirm/getInvestConfirmAmount/${projectId}`,
      method: 'get'
    })
  },
  // 施工现场摄像头列表
  queryDeviceList: data => {
    return http.construction({
      url: '/monitor/device/queryList',
      method: 'post',
      data
    })
  },
  // 更新用户信息
  updateUser: data => {
    return http.system({
      url: '/cim6d/system/user/update',
      method: 'post',
      data
    })
  }
}
