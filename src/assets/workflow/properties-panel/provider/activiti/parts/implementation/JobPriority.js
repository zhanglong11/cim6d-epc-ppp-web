'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../../factory/EntryFactory')

var cmdHelper = require('../../../../helper/CmdHelper')

module.exports = function(element, bpmnFactory, options, translate) {
  var getBusinessObject = options.getBusinessObject

  var jobPriorityEntry = entryFactory.textField({
    id: 'jobPriority',
    label: translate('Job Priority'),
    modelProperty: 'jobPriority',

    get: function(element, node) {
      var bo = getBusinessObject(element)
      return {
        jobPriority: bo.get('activiti:jobPriority')
      }
    },

    set: function(element, values) {
      var bo = getBusinessObject(element)
      return cmdHelper.updateBusinessObject(element, bo, {
        'activiti:jobPriority': values.jobPriority || undefined
      })
    }
  })

  return [jobPriorityEntry]
}
