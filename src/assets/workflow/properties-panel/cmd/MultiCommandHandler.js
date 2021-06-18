'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var forEach = require('lodash/forEach')

/**
 * A handler that combines and executes multiple commands.
 *
 * All updates are bundled on the command stack and executed in one step.
 * This also makes it possible to revert the changes in one step.
 *
 * Example use case: remove the camunda:formKey attribute and in addition
 * add all form fields needed for the camunda:formData property.
 *
 * @class
 * @constructor
 */
function MultiCommandHandler(commandStack) {
  this._commandStack = commandStack
}

MultiCommandHandler.$inject = ['commandStack']

module.exports = MultiCommandHandler

MultiCommandHandler.prototype.preExecute = function(context) {
  var commandStack = this._commandStack

  forEach(context, function(command) {
    commandStack.execute(command.cmd, command.context)
  })
}
