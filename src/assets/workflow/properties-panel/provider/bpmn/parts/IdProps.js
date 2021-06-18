'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../factory/EntryFactory'),
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  utils = require('../../../Utils'),
  cmdHelper = require('../../../helper/CmdHelper')

module.exports = function(group, element, translate, options) {
  var description = options && options.description

  // Id
  group.entries.push(
    entryFactory.validationAwareTextField({
      id: 'id',
      label: translate('Id'),
      description: description && translate(description),
      modelProperty: 'id',
      getProperty: function(element) {
        return getBusinessObject(element).id
      },
      setProperty: function(element, properties) {
        element = element.labelTarget || element

        return cmdHelper.updateProperties(element, properties)
      },
      validate: function(element, values) {
        var idValue = values.id

        var bo = getBusinessObject(element)

        var idError = utils.isIdValid(bo, idValue, translate)

        return idError ? { id: idError } : {}
      }
    })
  )
}
