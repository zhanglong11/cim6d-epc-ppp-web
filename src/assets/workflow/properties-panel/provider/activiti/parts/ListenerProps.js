'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var listener = require('./implementation/Listener')

module.exports = function(group, element, bpmnFactory, translate) {
  var listenerEntry = listener(element, bpmnFactory, {}, translate)

  group.entries = group.entries.concat(listenerEntry.entries)

  return {
    getSelectedListener: listenerEntry.getSelectedListener
  }
}
