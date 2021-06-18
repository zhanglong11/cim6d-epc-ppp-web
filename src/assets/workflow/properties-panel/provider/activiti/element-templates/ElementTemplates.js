'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var values = require('lodash/values')

/**
 * The guy knowing all configured element templates.
 *
 * This registry won't validate. Use the {@link Validator}
 * to verify a template is valid prior to adding it to
 * this registry.
 */
function ElementTemplates() {
  this._templates = {}

  /**
   * Sets the known element templates.
   *
   * @param {Array<TemplateDescriptor>} descriptors
   *
   * @return {ElementTemplates}
   */
  this.set = function(descriptors) {
    var templates = (this._templates = {})

    descriptors.forEach(function(descriptor) {
      templates[descriptor.id] = descriptor
    })

    return this
  }

  /**
   * Get template descriptor with given id.
   *
   * @param {String} id
   *
   * @return {TemplateDescriptor}
   */
  this.get = function(id) {
    return this._templates[id]
  }

  /**
   * Return all known template descriptors.
   *
   * @return {Array<TemplateDescriptor>}
   */
  this.getAll = function() {
    return values(this._templates)
  }
}

module.exports = ElementTemplates
