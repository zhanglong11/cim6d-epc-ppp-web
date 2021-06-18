'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../factory/EntryFactory'),
  is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject

module.exports = function(group, element, translate) {
  var bo = getBusinessObject(element)

  if (!bo) {
    return
  }

  if (is(element, 'activiti:Initiator') && !is(element.parent, 'bpmn:SubProcess')) {
    group.entries.push(
      entryFactory.textField({
        id: 'initiator',
        label: translate('Initiator'),
        modelProperty: 'initiator'
      })
    )
  }
}
