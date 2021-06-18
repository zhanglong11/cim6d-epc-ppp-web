'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  cmdHelper = require('../helper/CmdHelper'),
  escapeHTML = require('../Utils').escapeHTML

var entryFieldDescription = require('./EntryFieldDescription')

var checkbox = function(options, defaultParameters) {
  var resource = defaultParameters,
    id = resource.id,
    label = options.label || id,
    canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
    canBeHidden = !!options.hidden && typeof options.hidden === 'function',
    description = options.description

  resource.html =
    '<input id="activiti-' +
    escapeHTML(id) +
    '" ' +
    'type="checkbox" ' +
    'name="' +
    escapeHTML(options.modelProperty) +
    '" ' +
    (canBeDisabled ? 'data-disable="isDisabled"' : '') +
    (canBeHidden ? 'data-show="isHidden"' : '') +
    ' />' +
    '<label for="activiti-' +
    escapeHTML(id) +
    '" ' +
    (canBeDisabled ? 'data-disable="isDisabled"' : '') +
    (canBeHidden ? 'data-show="isHidden"' : '') +
    '>' +
    escapeHTML(label) +
    '</label>'

  // add description below checkbox entry field
  if (description) {
    resource.html += entryFieldDescription(description)
  }

  resource.get = function(element) {
    var bo = getBusinessObject(element),
      res = {}

    res[options.modelProperty] = bo.get(options.modelProperty)

    return res
  }

  resource.set = function(element, values) {
    var res = {}

    res[options.modelProperty] = !!values[options.modelProperty]

    return cmdHelper.updateProperties(element, res)
  }

  if (typeof options.set === 'function') {
    resource.set = options.set
  }

  if (typeof options.get === 'function') {
    resource.get = options.get
  }

  if (canBeDisabled) {
    resource.isDisabled = function() {
      return options.disabled.apply(resource, arguments)
    }
  }

  if (canBeHidden) {
    resource.isHidden = function() {
      return !options.hidden.apply(resource, arguments)
    }
  }

  resource.cssClasses = ['bpp-checkbox']

  return resource
}

module.exports = checkbox
