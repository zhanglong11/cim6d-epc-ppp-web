'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var textField = require('./TextInputEntryFactory')

/**
 * This function is a wrapper around TextInputEntryFactory.
 * It adds functionality to cache an invalid value entered in the
 * text input, instead of setting it on the business object.
 */
var validationAwareTextField = function(options, defaultParameters) {
  var modelProperty = options.modelProperty

  defaultParameters.get = function(element, node) {
    var value = this.__lastInvalidValue

    delete this.__lastInvalidValue

    var properties = {}

    properties[modelProperty] = value !== undefined ? value : options.getProperty(element, node)

    return properties
  }

  defaultParameters.set = function(element, values, node) {
    var validationErrors = validate.apply(this, [element, values, node]),
      propertyValue = values[modelProperty]

    // make sure we do not update the id
    if (validationErrors && validationErrors[modelProperty]) {
      this.__lastInvalidValue = propertyValue

      return options.setProperty(element, {}, node)
    } else {
      var properties = {}

      properties[modelProperty] = propertyValue

      return options.setProperty(element, properties, node)
    }
  }

  var validate = (defaultParameters.validate = function(element, values, node) {
    var value = values[modelProperty] || this.__lastInvalidValue

    var property = {}
    property[modelProperty] = value

    return options.validate(element, property, node)
  })

  return textField(options, defaultParameters)
}

module.exports = validationAwareTextField
