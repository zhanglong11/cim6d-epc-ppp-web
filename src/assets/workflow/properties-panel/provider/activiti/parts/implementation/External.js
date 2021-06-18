'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../../factory/EntryFactory'),
  cmdHelper = require('../../../../helper/CmdHelper')

module.exports = function(element, bpmnFactory, options, translate) {
  var getImplementationType = options.getImplementationType,
    getBusinessObject = options.getBusinessObject

  function isExternal(element) {
    return getImplementationType(element) === 'external'
  }

  var topicEntry = entryFactory.textField({
    id: 'externalTopic',
    label: translate('Topic'),
    modelProperty: 'externalTopic',

    get: function(element, node) {
      var bo = getBusinessObject(element)
      return { externalTopic: bo.get('activiti:topic') }
    },

    set: function(element, values, node) {
      var bo = getBusinessObject(element)
      return cmdHelper.updateBusinessObject(element, bo, {
        'activiti:topic': values.externalTopic
      })
    },

    validate: function(element, values, node) {
      return isExternal(element) && !values.externalTopic ? { externalTopic: translate('Must provide a value') } : {}
    },

    hidden: function(element, node) {
      return !isExternal(element)
    }
  })

  return [topicEntry]
}
