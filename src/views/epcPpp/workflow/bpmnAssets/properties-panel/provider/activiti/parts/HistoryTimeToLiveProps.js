'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject

var historyTimeToLive = require('./implementation/HistoryTimeToLive')

module.exports = function (group, element, bpmnFactory, translate) {
  var businessObject = getBusinessObject(element)

  if (is(element, 'activiti:Process') || (is(element, 'bpmn:Participant') && businessObject.get('processRef'))) {
    group.entries = group.entries.concat(
      historyTimeToLive(
        element,
        bpmnFactory,
        {
          getBusinessObject: function (element) {
            var bo = getBusinessObject(element)

            if (!is(bo, 'bpmn:Participant')) {
              return bo
            }

            return bo.get('processRef')
          }
        },
        translate
      )
    )
  }
}
