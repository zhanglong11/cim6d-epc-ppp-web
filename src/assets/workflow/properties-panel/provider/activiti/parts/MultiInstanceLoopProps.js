'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  is = require('bpmn-js/lib/util/ModelUtil').is

var multiInstanceLoopCharacteristics = require('./implementation/MultiInstanceLoopCharacteristics')

var jobRetryTimeCycle = require('./implementation/JobRetryTimeCycle'),
  asyncContinuation = require('./implementation/AsyncContinuation')

function getLoopCharacteristics(element) {
  var bo = getBusinessObject(element)
  return bo.loopCharacteristics
}

function ensureMultiInstanceSupported(element) {
  var loopCharacteristics = getLoopCharacteristics(element)
  return !!loopCharacteristics && is(loopCharacteristics, 'activiti:Collectable')
}

module.exports = function(group, element, bpmnFactory, translate) {
  if (!ensureMultiInstanceSupported(element)) {
    return
  }

  // multi instance properties
  group.entries = group.entries.concat(multiInstanceLoopCharacteristics(element, bpmnFactory, translate))

  // async continuation ///////////////////////////////////////////////////////
  group.entries = group.entries.concat(
    asyncContinuation(
      element,
      bpmnFactory,
      {
        getBusinessObject: getLoopCharacteristics,
        idPrefix: 'multiInstance-',
        labelPrefix: translate('Multi Instance ')
      },
      translate
    )
  )

  // retry time cycle //////////////////////////////////////////////////////////
  group.entries = group.entries.concat(
    jobRetryTimeCycle(
      element,
      bpmnFactory,
      {
        getBusinessObject: getLoopCharacteristics,
        idPrefix: 'multiInstance-',
        labelPrefix: translate('Multi Instance ')
      },
      translate
    )
  )
}
