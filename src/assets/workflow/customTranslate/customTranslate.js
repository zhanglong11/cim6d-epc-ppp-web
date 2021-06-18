/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
import translations from './translationsGerman'
export default function customTranslate(template, replacements) {
  replacements = replacements || {}
  template = translations[template] || template
  return template.replace(/{([^}]+)}/g, function(_, key) {
    var str = replacements[key]
    if (translations[replacements[key]] != null && translations[replacements[key]] != 'undefined') {
      str = translations[replacements[key]]
    }
    return str || '{' + key + '}'
  })
}
