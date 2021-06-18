'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var assign = require('lodash/assign')

var inputOutputParameter = require('./implementation/InputOutputParameter')

module.exports = function(group, element, bpmnFactory, options, translate) {
  options = assign(
    {
      idPrefix: 'connector-',
      insideConnector: true
    },
    options
  )

  group.entries = group.entries.concat(inputOutputParameter(element, bpmnFactory, options, translate))
}
