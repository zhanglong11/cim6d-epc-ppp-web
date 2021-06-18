'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../factory/EntryFactory'),
  cmdHelper = require('../../../helper/CmdHelper'),
  is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject

module.exports = function(group, element, translate) {
  var bo = getBusinessObject(element)

  if (!bo) {
    return
  }

  if (is(element, 'bpmn:Process') || (is(element, 'bpmn:Participant') && bo.get('processRef'))) {
    var versionTagEntry = entryFactory.textField({
      id: 'versionTag',
      label: translate('Version Tag'),
      modelProperty: 'versionTag'
    })

    // in participants we have to change the default behavior of set and get
    if (is(element, 'bpmn:Participant')) {
      versionTagEntry.get = function(element) {
        var processBo = bo.get('processRef')

        return {
          versionTag: processBo.get('activiti:versionTag')
        }
      }

      versionTagEntry.set = function(element, values) {
        var processBo = bo.get('processRef')

        return cmdHelper.updateBusinessObject(element, processBo, {
          'activiti:versionTag': values.versionTag || undefined
        })
      }
    }

    group.entries.push(versionTagEntry)
  }
}
