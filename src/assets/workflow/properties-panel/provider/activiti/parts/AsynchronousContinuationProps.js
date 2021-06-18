'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  is = require('bpmn-js/lib/util/ModelUtil').is,
  asyncContinuation = require('./implementation/AsyncContinuation')

module.exports = function(group, element, bpmnFactory, translate) {
  if (is(element, 'activiti:AsyncCapable')) {
    group.entries = group.entries.concat(
      asyncContinuation(
        element,
        bpmnFactory,
        {
          getBusinessObject: getBusinessObject
        },
        translate
      )
    )
  }
}
