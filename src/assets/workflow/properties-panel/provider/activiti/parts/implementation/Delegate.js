'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../../factory/EntryFactory'),
  cmdHelper = require('../../../../helper/CmdHelper')

var DELEGATE_TYPES = ['class', 'expression', 'delegateExpression']

var PROPERTIES = {
  class: 'activiti:class',
  expression: 'activiti:expression',
  delegateExpression: 'activiti:delegateExpression'
}

function isDelegate(type) {
  return DELEGATE_TYPES.indexOf(type) !== -1
}

function getAttribute(type) {
  return PROPERTIES[type]
}

module.exports = function(element, bpmnFactory, options, translate) {
  var getImplementationType = options.getImplementationType,
    getBusinessObject = options.getBusinessObject

  function getDelegationLabel(type) {
    switch (type) {
      case 'class':
        return translate('Java Class')
      case 'expression':
        return translate('Expression')
      case 'delegateExpression':
        return translate('Delegate Expression')
      default:
        return ''
    }
  }

  var delegateEntry = entryFactory.textField({
    id: 'delegate',
    label: translate('Value'),
    dataValueLabel: 'delegationLabel',
    modelProperty: 'delegate',

    get: function(element, node) {
      var bo = getBusinessObject(element)
      var type = getImplementationType(element)
      var attr = getAttribute(type)
      var label = getDelegationLabel(type)
      return {
        delegate: bo.get(attr),
        delegationLabel: label
      }
    },

    set: function(element, values, node) {
      var bo = getBusinessObject(element)
      var type = getImplementationType(element)
      var attr = getAttribute(type)
      var prop = {}
      prop[attr] = values.delegate || ''
      return cmdHelper.updateBusinessObject(element, bo, prop)
    },

    validate: function(element, values, node) {
      return isDelegate(getImplementationType(element)) && !values.delegate
        ? { delegate: translate('Must provide a value') }
        : {}
    },

    hidden: function(element, node) {
      return !isDelegate(getImplementationType(element))
    }
  })

  return [delegateEntry]
}
