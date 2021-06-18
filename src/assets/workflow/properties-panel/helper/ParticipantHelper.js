'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  cmdHelper = require('./CmdHelper')

var ParticipantHelper = {}

module.exports = ParticipantHelper

ParticipantHelper.modifyProcessBusinessObject = function(element, property, values) {
  if (!is(element, 'bpmn:Participant')) {
    return {}
  }

  var bo = getBusinessObject(element).get('processRef'),
    properties = {}

  properties[property] = values[property]

  return cmdHelper.updateBusinessObject(element, bo, properties)
}

ParticipantHelper.getProcessBusinessObject = function(element, propertyName) {
  if (!is(element, 'bpmn:Participant')) {
    return {}
  }

  var bo = getBusinessObject(element).get('processRef'),
    properties = {}

  properties[propertyName] = bo.get(propertyName)

  return properties
}
