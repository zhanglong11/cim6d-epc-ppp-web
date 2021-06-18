'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject

var ImplementationTypeHelper = require('../../../helper/ImplementationTypeHelper')

var externalTaskPriority = require('./implementation/ExternalTaskPriority')

function getServiceTaskLikeBusinessObject(element) {
  var bo = ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element)

  // if the element is not a serviceTaskLike element, fetch the normal business object
  // This avoids the loss of the process / participant business object
  if (!bo) {
    bo = getBusinessObject(element)
  }

  return bo
}

module.exports = function(group, element, bpmnFactory, translate) {
  var bo = getServiceTaskLikeBusinessObject(element)

  if (!bo) {
    return
  }

  if (is(bo, 'activiti:TaskPriorized') || (is(bo, 'bpmn:Participant') && bo.get('processRef'))) {
    group.entries = group.entries.concat(
      externalTaskPriority(
        element,
        bpmnFactory,
        {
          getBusinessObject: function(element) {
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
