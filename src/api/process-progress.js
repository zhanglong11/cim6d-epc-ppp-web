/**
  任务名称：task#2867 【智慧工地2.0-前端】工序进度模块功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/

import http from '@/utils/axios'
export const processProgressApi = {
  // 工序模板查询
  queryTemplateListWorking: data => {
    return http.decoration({
      url: '/working/procedure/template/list',
      method: 'post',
      data
    })
  },
  //查询所选房间的模板列表
  queryProcedureScheduleListByLocationIds: data => {
    return http.decoration({
      url: '/working/procedure/floor/schedule/scheduleListJiaWeb',
      method: 'post',
      data
    })
  },
  // 添加工序模板
  addTemplateWorking: data => {
    return http.decoration({
      url: '/working/procedure/template/add',
      method: 'post',
      data
    })
  },
  // 更新工序模板
  updateTemplateWorking: data => {
    return http.decoration({
      url: '/working/procedure/template/update',
      method: 'post',
      data
    })
  },
  // 删除工序模板
  deleteTemplateWorking: id => {
    return http.decoration({
      url: `working/procedure/template/delete/${id}`,
      method: 'get'
    })
  },
  // 工序模板详情
  getDetailsTemplateWorking: id => {
    return http.decoration({
      url: `working/procedure/template/get/${id}`,
      method: 'get'
    })
  },
  //修改模板的状态为启用
  updateTemplateStatusStartWorking: id => {
    return http.decoration({
      url: `working/procedure/template/start/${id}`,
      method: 'get'
    })
  },
  //修改模板的状态为停用
  updateTemplateStatusStopWorking: id => {
    return http.decoration({
      url: `working/procedure/template/stop/${id}`,
      method: 'get'
    })
  },
  //复制模板
  copyTemplateWorking: id => {
    return http.decoration({
      url: `working/procedure/template/copy/${id}`,
      method: 'get'
    })
  },
  // 工序模板-交换顺序（将当前记录与目标记录交换顺序）
  swapTemplateWorking: (sourceId, targetId) => {
    return http.decoration({
      url: `working/procedure/template/swap/${sourceId}/${targetId}`,
      method: 'get'
    })
  },
  // 工序列表
  queryListWorking: data => {
    return http.decoration({
      url: 'working/procedure/list',
      method: 'post',
      data
    })
  },
  // 添加工序
  addWorking: data => {
    return http.decoration({
      url: '/working/procedure/add',
      method: 'post',
      data
    })
  },
  // 更新工序
  updateWorking: data => {
    return http.decoration({
      url: 'working/procedure/update',
      method: 'post',
      data
    })
  },
  // 工序详情
  getDetailsWorking: id => {
    return http.decoration({
      url: `working/procedure/get/${localStorage.getItem('projectId')}/${id}`,
      method: 'get'
    })
  },
  // 工序-交换顺序（将当前记录与目标记录交换顺序）
  swapWorking: (sourceId, targetId) => {
    return http.decoration({
      url: `working/procedure/swap/${sourceId}/${targetId}`,
      method: 'get'
    })
  },
  // 删除工序
  deleteWorking: id => {
    return http.decoration({
      url: `working/procedure/delete/${id}`,
      method: 'get'
    })
  },
  // 工序配置-分页列表
  queryConfigListWorking: data => {
    return http.decoration({
      url: 'working/procedure/config/list',
      method: 'post',
      data
    })
  },
  // 添加工序配置
  addConfigWorking: data => {
    return http.decoration({
      url: 'working/procedure/config/add',
      method: 'post',
      data
    })
  },
  // 更新工序配置
  updateConfigWorking: data => {
    return http.decoration({
      url: 'working/procedure/config/update',
      method: 'post',
      data
    })
  },
  // 获取工序配置详情
  getDetailsConfigWorking: id => {
    return http.decoration({
      url: `/working/procedure/config/view/${id}`,
      method: 'get'
    })
  },
  // 保存工序配置下所有工序明细
  saveDetailConfigWorking: data => {
    return http.decoration({
      url: `working/procedure/config/add`,
      method: 'post',
      data
    })
  },
  // 查看工序配置下所有工序明细
  getDetailsConfigListWorking: id => {
    return http.decoration({
      url: `working/procedure/config/detail/list/${id}`,
      method: 'get'
    })
  },
  // 删除工序配置
  deleteConfigWorking: id => {
    return http.decoration({
      url: `working/procedure/config/delete/${id}`,
      method: 'get'
    })
  },
  //发布工序配置
  publishConfigWorking: id => {
    return http.decoration({
      url: `/working/procedure/config/publish/${id}`,
      method: 'get'
    })
  },
  // 关联楼层
  bindFloor: data => {
    return http.working({
      url: '/working/procedure/config/floor/bind',
      method: 'post',
      data
    })
  },
  // 获取bim数据
  queryBimTree: projectId => {
    return http({
      url: `/project/bim/tree/active/${projectId}`,
      method: 'post'
    })
  },
  // 获取bim楼层数据
  getBimResource: bimResourceId => {
    return http.gis({
      url: `/noToken/old/basic/commonFile/get/fdht/bim_${bimResourceId}/space.json`,
      method: 'get'
    })
  },
  // 工序配置下楼层绑定关系
  queryFloorBindList: configId => {
    return http.working({
      url: `/working/procedure/config/floor/bind/list/${configId}`,
      method: 'get'
    })
  },
  /***********新增接口******/

  // 单元-工序列表
  queryProcedureScheduleList: configId => {
    return http.decoration({
      url: `/working/procedure/floor/schedule/list/${configId}`,
      method: 'get'
    })
  },
  // 工序详情
  queryProcedureScheduleDetail: scheduleId => {
    return http.decoration({
      url: `/working/procedure/floor/schedule/get/${scheduleId}`,
      method: 'get'
    })
  },
  // 预览配置项信息(未提交)
  getConfigPreviewInfo: data => {
    return http.decoration({
      url: `/working/procedure/config/preview`,
      method: 'POST',
      data
    })
  },
  // 预览配置项信息(已提交)
  getConfigTreeInfo(id) {
    return http.decoration({
      url: `/working/procedure/config/tree/${id}`,
      method: 'get'
    })
  },
  //开工
  start(libraryId) {
    return http.decoration({
      url: `/working/procedure/floor/schedule/startSingle//${libraryId}`,
      method: 'get'
    })
  },
  // 工序内容统计列表 @author 杨佳奇
  getScheduleStatistics(configId) {
    return http.decoration({
      url: `/working/procedure/floor/schedule/statistics/${configId}`,
      method: 'get'
    })
  },
  // 获取工序明细title @author 杨佳奇
  getConfigDetailName(configId) {
    return http.decoration({
      url: `/working/procedure/config/detail/getName/${configId}`,
      method: 'get'
    })
  },
  // 工序工程量进度 -精装修甲方
  queryScheduleQuantitiesJiaWeb(data) {
    return http.construction({
      url: '/working/procedure/floor/schedule/scheduleQuantitiesJiaWeb',
      method: 'post',
      data
    })
  },
  // 工序进度 -精装修甲方
  queryScheduleQuantitiesDetailJiaWeb(data) {
    return http.construction({
      url: '/working/procedure/floor/schedule/scheduleQuantitiesDetailJiaWeb',
      method: 'post',
      data
    })
  },
  // 拖拽后提交
  handleChangeSort: ({ oldId, newId }) => {
    return http.decoration({
      url: `/working/procedure/swap/${oldId}/${newId}`,
      method: 'get'
    })
  }
}
