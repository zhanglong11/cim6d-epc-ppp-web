'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var eventDefinitionReference = require('./EventDefinitionReference'),
  elementReferenceProperty = require('./ElementReferenceProperty')

module.exports = function(group, element, bpmnFactory, signalEventDefinition, translate) {
  group.entries = group.entries.concat(
    eventDefinitionReference(element, signalEventDefinition, bpmnFactory, {
      label: translate('Signal'),
      elementName: 'signal',
      elementType: 'bpmn:Signal',
      referenceProperty: 'signalRef',
      newElementIdPrefix: 'Signal_'
    })
  )

  group.entries = group.entries.concat(
    elementReferenceProperty(element, signalEventDefinition, bpmnFactory, {
      id: 'signal-element-name',
      label: translate('Signal Name'),
      referenceProperty: 'signalRef',
      modelProperty: 'name',
      shouldValidate: true
    })
  )
}
