'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  is = require('bpmn-js/lib/util/ModelUtil').is,
  entryFactory = require('../../../factory/EntryFactory'),
  cmdHelper = require('../../../helper/CmdHelper'),
  scriptImplementation = require('./implementation/Script')

module.exports = function(group, element, bpmnFactory, translate) {
  var bo

  if (is(element, 'bpmn:ScriptTask')) {
    bo = getBusinessObject(element)
  }

  if (!bo) {
    return
  }

  var script = scriptImplementation('scriptFormat', 'script', false, translate)
  group.entries.push({
    id: 'script-implementation',
    label: translate('Script'),
    html: script.template,

    get: function(element) {
      return script.get(element, bo)
    },

    set: function(element, values, containerElement) {
      var properties = script.set(element, values, containerElement)

      return cmdHelper.updateProperties(element, properties)
    },

    validate: function(element, values) {
      return script.validate(element, values)
    },

    script: script,

    cssClasses: ['bpp-textfield']
  })

  group.entries.push(
    entryFactory.textField({
      id: 'scriptResultVariable',
      label: translate('Result Variable'),
      modelProperty: 'scriptResultVariable',

      get: function(element, propertyName) {
        var boResultVariable = bo.get('activiti:resultVariable')

        return { scriptResultVariable: boResultVariable }
      },

      set: function(element, values, containerElement) {
        return cmdHelper.updateProperties(element, {
          'activiti:resultVariable': values.scriptResultVariable.length ? values.scriptResultVariable : undefined
        })
      }
    })
  )
}
