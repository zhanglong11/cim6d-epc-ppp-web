'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var ChangeElementTemplateHandler = require('./ChangeElementTemplateHandler')

var getTemplate = require('../Helper').getTemplate,
  getDefaultTemplate = require('../Helper').getDefaultTemplate

function registerHandlers(commandStack, elementTemplates, eventBus, elementRegistry) {
  commandStack.registerHandler('propertiesPanel.activiti.changeTemplate', ChangeElementTemplateHandler)

  // apply default element templates on shape creation
  eventBus.on(['commandStack.shape.create.postExecuted'], function(context) {
    applyDefaultTemplate(context.context.shape, elementTemplates, commandStack)
  })

  // apply default element templates on connection creation
  eventBus.on(['commandStack.connection.create.postExecuted'], function(context) {
    applyDefaultTemplate(context.context.connection, elementTemplates, commandStack)
  })
}

registerHandlers.$inject = ['commandStack', 'elementTemplates', 'eventBus', 'elementRegistry']

module.exports = {
  __init__: [registerHandlers]
}

function applyDefaultTemplate(element, elementTemplates, commandStack) {
  if (!getTemplate(element, elementTemplates) && getDefaultTemplate(element, elementTemplates)) {
    var command = 'propertiesPanel.activiti.changeTemplate'
    var commandContext = {
      element: element,
      newTemplate: getDefaultTemplate(element, elementTemplates)
    }

    commandStack.execute(command, commandContext)
  }
}
