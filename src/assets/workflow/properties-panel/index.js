/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
module.exports = {
  __depends__: [require('./cmd'), require('diagram-js/lib/i18n/translate').default],
  __init__: ['propertiesPanel'],
  propertiesPanel: ['type', require('./PropertiesPanel')]
}
