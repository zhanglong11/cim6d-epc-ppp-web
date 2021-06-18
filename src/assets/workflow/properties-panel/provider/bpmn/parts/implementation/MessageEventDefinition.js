'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var eventDefinitionReference = require('./EventDefinitionReference'),
  elementReferenceProperty = require('./ElementReferenceProperty')

module.exports = function(group, element, bpmnFactory, messageEventDefinition, translate) {
  group.entries = group.entries.concat(
    eventDefinitionReference(element, messageEventDefinition, bpmnFactory, {
      label: translate('Message'),
      elementName: 'message',
      elementType: 'bpmn:Message',
      referenceProperty: 'messageRef',
      newElementIdPrefix: 'Message_'
    })
  )

  group.entries = group.entries.concat(
    elementReferenceProperty(element, messageEventDefinition, bpmnFactory, {
      id: 'message-element-name',
      label: translate('Message Name'),
      referenceProperty: 'messageRef',
      modelProperty: 'name',
      shouldValidate: true
    })
  )
}
