'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject

var entryFactory = require('../../../factory/EntryFactory')

var participantHelper = require('../../../helper/ParticipantHelper')

module.exports = function(group, element, translate) {
  var bo = getBusinessObject(element)

  if (!bo) {
    return
  }

  if (is(element, 'bpmn:Process') || (is(element, 'bpmn:Participant') && bo.get('processRef'))) {
    var executableEntry = entryFactory.checkbox({
      id: 'process-is-executable',
      label: translate('Executable'),
      modelProperty: 'isExecutable'
    })

    // in participants we have to change the default behavior of set and get
    if (is(element, 'bpmn:Participant')) {
      executableEntry.get = function(element) {
        return participantHelper.getProcessBusinessObject(element, 'isExecutable')
      }

      executableEntry.set = function(element, values) {
        return participantHelper.modifyProcessBusinessObject(element, 'isExecutable', values)
      }
    }

    group.entries.push(executableEntry)
  }
}
