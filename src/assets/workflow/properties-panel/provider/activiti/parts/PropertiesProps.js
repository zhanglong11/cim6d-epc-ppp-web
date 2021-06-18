'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var properties = require('./implementation/Properties'),
  elementHelper = require('../../../helper/ElementHelper'),
  cmdHelper = require('../../../helper/CmdHelper')

module.exports = function(group, element, bpmnFactory, translate) {
  var propertiesEntry = properties(
    element,
    bpmnFactory,
    {
      id: 'properties',
      modelProperties: ['name', 'value'],
      labels: [translate('Name'), translate('Value')],

      getParent: function(element, node, bo) {
        return bo.extensionElements
      },

      createParent: function(element, bo) {
        var parent = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory)
        var cmd = cmdHelper.updateBusinessObject(element, bo, { extensionElements: parent })
        return {
          cmd: cmd,
          parent: parent
        }
      }
    },
    translate
  )

  if (propertiesEntry) {
    group.entries.push(propertiesEntry)
  }
}
