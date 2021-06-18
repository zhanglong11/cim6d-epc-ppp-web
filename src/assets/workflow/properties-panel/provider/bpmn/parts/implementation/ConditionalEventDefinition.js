'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../../factory/EntryFactory'),
  cmdHelper = require('../../../../helper/CmdHelper')

var is = require('bpmn-js/lib/util/ModelUtil').is,
  isEventSubProcess = require('bpmn-js/lib/util/DiUtil').isEventSubProcess

module.exports = function(group, element, bpmnFactory, conditionalEventDefinition, elementRegistry, translate) {
  var getValue = function(modelProperty) {
    return function(element) {
      var modelPropertyValue = conditionalEventDefinition.get('camunda:' + modelProperty)
      var value = {}

      value[modelProperty] = modelPropertyValue
      return value
    }
  }

  var setValue = function(modelProperty) {
    return function(element, values) {
      var props = {}

      props['camunda:' + modelProperty] = values[modelProperty] || undefined

      return cmdHelper.updateBusinessObject(element, conditionalEventDefinition, props)
    }
  }

  group.entries.push(
    entryFactory.textField({
      id: 'variableName',
      label: translate('Variable Name'),
      modelProperty: 'variableName',

      get: getValue('variableName'),
      set: setValue('variableName')
    })
  )

  var isConditionalStartEvent = is(element, 'bpmn:StartEvent') && !isEventSubProcess(element.parent)

  if (!isConditionalStartEvent) {
    group.entries.push(
      entryFactory.textField({
        id: 'variableEvent',
        label: translate('Variable Event'),
        description: translate('Specify more than one variable change event as a comma separated list.'),
        modelProperty: 'variableEvent',

        get: getValue('variableEvent'),
        set: setValue('variableEvent')
      })
    )
  }
}
