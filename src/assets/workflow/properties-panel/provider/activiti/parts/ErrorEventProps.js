'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var is = require('bpmn-js/lib/util/ModelUtil').is,
  eventDefinitionHelper = require('../../../helper/EventDefinitionHelper'),
  error = require('./implementation/ErrorEventDefinition')

var forEach = require('lodash/forEach')

module.exports = function(group, element, bpmnFactory, translate) {
  var errorEvents = ['bpmn:StartEvent', 'bpmn:BoundaryEvent', 'bpmn:EndEvent']

  forEach(errorEvents, function(event) {
    if (is(element, event)) {
      var errorEventDefinition = eventDefinitionHelper.getErrorEventDefinition(element)

      if (errorEventDefinition) {
        var isCatchingErrorEvent = is(element, 'bpmn:StartEvent') || is(element, 'bpmn:BoundaryEvent')

        var showErrorCodeVariable = isCatchingErrorEvent,
          showErrorMessageVariable = isCatchingErrorEvent

        error(
          group,
          element,
          bpmnFactory,
          errorEventDefinition,
          showErrorCodeVariable,
          showErrorMessageVariable,
          translate
        )
      }
    }
  })
}
