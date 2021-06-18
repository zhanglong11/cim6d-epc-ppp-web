'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var escapeHTML = require('../Utils').escapeHTML

var entryFieldDescription = require('./EntryFieldDescription')

var textBox = function(options, defaultParameters) {
  var resource = defaultParameters,
    label = options.label || resource.id,
    canBeShown = !!options.show && typeof options.show === 'function',
    description = options.description

  resource.html =
    '<label for="activiti-' +
    escapeHTML(resource.id) +
    '" ' +
    (canBeShown ? 'data-show="isShown"' : '') +
    '>' +
    label +
    '</label>' +
    '<div class="bpp-field-wrapper" ' +
    (canBeShown ? 'data-show="isShown"' : '') +
    '>' +
    '<div contenteditable="true" id="activiti-' +
    escapeHTML(resource.id) +
    '" ' +
    'name="' +
    escapeHTML(options.modelProperty) +
    '" />' +
    '</div>'

  // add description below text box entry field
  if (description) {
    resource.html += entryFieldDescription(description)
  }

  if (canBeShown) {
    resource.isShown = function() {
      return options.show.apply(resource, arguments)
    }
  }

  resource.cssClasses = ['bpp-textbox']

  return resource
}

module.exports = textBox
