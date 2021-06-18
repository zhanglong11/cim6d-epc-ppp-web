'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var ImplementationTypeHelper = require('../../../helper/ImplementationTypeHelper')

var fieldInjection = require('./implementation/FieldInjection')

module.exports = function(group, element, bpmnFactory, translate) {
  var bo = ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element)

  if (!bo) {
    return
  }

  var fieldInjectionEntry = fieldInjection(element, bpmnFactory, translate, { businessObject: bo })

  if (fieldInjectionEntry && fieldInjectionEntry.length > 0) {
    group.entries = group.entries.concat(fieldInjectionEntry)
  }
}
