'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var eventDefinitionReference = require('./EventDefinitionReference'),
  elementReferenceProperty = require('./ElementReferenceProperty')

module.exports = function(group, element, bpmnFactory, errorEventDefinition, translate) {
  group.entries = group.entries.concat(
    eventDefinitionReference(element, errorEventDefinition, bpmnFactory, {
      label: translate('Error'),
      elementName: 'error',
      elementType: 'bpmn:Error',
      referenceProperty: 'errorRef',
      newElementIdPrefix: 'Error_'
    })
  )

  group.entries = group.entries.concat(
    elementReferenceProperty(element, errorEventDefinition, bpmnFactory, {
      id: 'error-element-name',
      label: translate('Error Name'),
      referenceProperty: 'errorRef',
      modelProperty: 'name',
      shouldValidate: true
    })
  )

  group.entries = group.entries.concat(
    elementReferenceProperty(element, errorEventDefinition, bpmnFactory, {
      id: 'error-element-code',
      label: translate('Error Code'),
      referenceProperty: 'errorRef',
      modelProperty: 'errorCode'
    })
  )
}
