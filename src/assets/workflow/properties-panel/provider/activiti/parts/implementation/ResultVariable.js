'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var is = require('bpmn-js/lib/util/ModelUtil').is

var assign = require('lodash/assign')

var entryFactory = require('../../../../factory/EntryFactory'),
  cmdHelper = require('../../../../helper/CmdHelper')

module.exports = function(element, bpmnFactory, options, translate) {
  var getBusinessObject = options.getBusinessObject,
    hideResultVariable = options.hideResultVariable,
    id = options.id || 'resultVariable'

  var resultVariableEntry = entryFactory.textField({
    id: id,
    label: translate('Result Variable'),
    modelProperty: 'resultVariable',

    get: function(element, node) {
      var bo = getBusinessObject(element)
      return { resultVariable: bo.get('activiti:resultVariable') }
    },

    set: function(element, values, node) {
      var bo = getBusinessObject(element)

      var resultVariable = values.resultVariable || undefined

      var props = {
        'activiti:resultVariable': resultVariable
      }

      if (is(bo, 'activiti:DmnCapable') && !resultVariable) {
        props = assign({ 'activiti:mapDecisionResult': 'resultList' }, props)
      }

      return cmdHelper.updateBusinessObject(element, bo, props)
    },

    hidden: function(element, node) {
      if (typeof hideResultVariable === 'function') {
        return hideResultVariable.apply(resultVariableEntry, arguments)
      }
    }
  })

  return [resultVariableEntry]
}
