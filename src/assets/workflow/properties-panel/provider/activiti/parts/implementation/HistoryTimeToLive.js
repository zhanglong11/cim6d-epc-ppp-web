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

  var historyTimeToLiveEntry = entryFactory.textField({
    id: 'historyTimeToLive',
    label: translate('History Time To Live'),
    modelProperty: 'historyTimeToLive',

    get: function(element, node) {
      var bo = getBusinessObject(element)
      var historyTimeToLive = bo.get('activiti:historyTimeToLive')

      return {
        historyTimeToLive: historyTimeToLive ? historyTimeToLive : ''
      }
    },

    set: function(element, values) {
      var bo = getBusinessObject(element)
      return cmdHelper.updateBusinessObject(element, bo, {
        'activiti:historyTimeToLive': values.historyTimeToLive || undefined
      })
    }
  })

  return [historyTimeToLiveEntry]
}
