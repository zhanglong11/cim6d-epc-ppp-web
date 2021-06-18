'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var collectionAdd = require('diagram-js/lib/util/Collections').add,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject

var CategoryHelper = {}

module.exports = CategoryHelper

/**
 * Creates a new bpmn:CategoryValue inside a new bpmn:Category
 *
 * @param {ModdleElement} definitions
 * @param {BpmnFactory} bpmnFactory
 *
 * @return {ModdleElement} categoryValue.
 */
CategoryHelper.createCategoryValue = function(definitions, bpmnFactory) {
  var categoryValue = bpmnFactory.create('bpmn:CategoryValue'),
    category = bpmnFactory.create('bpmn:Category', {
      categoryValue: [categoryValue]
    })

  // add to correct place
  collectionAdd(definitions.get('rootElements'), category)
  getBusinessObject(category).$parent = definitions
  getBusinessObject(categoryValue).$parent = category

  return categoryValue
}
