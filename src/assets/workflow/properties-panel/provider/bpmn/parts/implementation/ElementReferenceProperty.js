'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../../factory/EntryFactory')

var cmdHelper = require('../../../../helper/CmdHelper')

/**
 * Create an entry to modify a property of an element which
 * is referenced by a event definition.
 *
 * @param  {djs.model.Base} element
 * @param  {ModdleElement} definition
 * @param  {BpmnFactory} bpmnFactory
 * @param  {Object} options
 * @param  {string} options.id the id of the entry
 * @param  {string} options.label the label of the entry
 * @param  {string} options.referenceProperty the name of referencing property
 * @param  {string} options.modelProperty the name of property to modify
 * @param  {string} options.shouldValidate a flag indicate whether to validate or not
 *
 * @return {Array<Object>} return an array containing the entries
 */
module.exports = function(element, definition, bpmnFactory, options) {
  var id = options.id || 'element-property'
  var label = options.label
  var referenceProperty = options.referenceProperty
  var modelProperty = options.modelProperty || 'name'
  var shouldValidate = options.shouldValidate || false

  var entry = entryFactory.textField({
    id: id,
    label: label,
    modelProperty: modelProperty,

    get: function(element, node) {
      var reference = definition.get(referenceProperty)
      var props = {}
      props[modelProperty] = reference && reference.get(modelProperty)
      return props
    },

    set: function(element, values, node) {
      var reference = definition.get(referenceProperty)
      var props = {}
      props[modelProperty] = values[modelProperty] || undefined
      return cmdHelper.updateBusinessObject(element, reference, props)
    },

    hidden: function(element, node) {
      return !definition.get(referenceProperty)
    }
  })

  if (shouldValidate) {
    entry.validate = function(element, values, node) {
      var reference = definition.get(referenceProperty)
      if (reference && !values[modelProperty]) {
        var validationErrors = {}
        validationErrors[modelProperty] = 'Must provide a value'
        return validationErrors
      }
    }
  }

  return [entry]
}
