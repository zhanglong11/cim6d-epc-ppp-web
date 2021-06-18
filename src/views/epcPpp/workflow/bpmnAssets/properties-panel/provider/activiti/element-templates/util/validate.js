'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var Validator = require('../Validator')

/**
 * Validate the given template descriptors and
 * return a list of errors.
 *
 * @param {Array<TemplateDescriptor>} descriptors
 *
 * @return {Array<Error>}
 */
module.exports = function validate(descriptors) {
  return new Validator().addAll(descriptors).getErrors()
}
