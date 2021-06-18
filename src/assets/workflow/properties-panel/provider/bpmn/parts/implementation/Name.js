'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../../factory/EntryFactory')

/**
 * Create an entry to modify the name of an an element.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} options
 * @param  {string} options.id the id of the entry
 * @param  {string} options.label the label of the entry
 *
 * @return {Array<Object>} return an array containing
 *                         the entry to modify the name
 */
module.exports = function(element, options, translate) {
  options = options || {}
  var id = options.id || 'name',
    label = options.label || translate('Name'),
    modelProperty = options.modelProperty || 'name'

  var nameEntry = entryFactory.textBox({
    id: id,
    label: label,
    modelProperty: modelProperty,
    get: options.get,
    set: options.set
  })

  return [nameEntry]
}
