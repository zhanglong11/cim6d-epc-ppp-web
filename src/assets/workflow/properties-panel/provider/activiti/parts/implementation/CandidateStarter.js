'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var entryFactory = require('../../../../factory/EntryFactory')

var cmdHelper = require('../../../../helper/CmdHelper')

module.exports = function(element, bpmnFactory, options, translate) {
  var getBusinessObject = options.getBusinessObject

  var candidateStarterGroupsEntry = entryFactory.textField({
    id: 'candidateStarterGroups',
    label: translate('Candidate Starter Groups'),
    modelProperty: 'candidateStarterGroups',
    description: translate('Specify more than one group as a comma separated list.'),

    get: function(element, node) {
      var bo = getBusinessObject(element)
      var candidateStarterGroups = bo.get('activiti:candidateStarterGroups')

      return {
        candidateStarterGroups: candidateStarterGroups ? candidateStarterGroups : ''
      }
    },

    set: function(element, values) {
      var bo = getBusinessObject(element)
      return cmdHelper.updateBusinessObject(element, bo, {
        'activiti:candidateStarterGroups': values.candidateStarterGroups || undefined
      })
    }
  })

  var candidateStarterUsersEntry = entryFactory.textField({
    id: 'candidateStarterUsers',
    label: translate('Candidate Starter Users'),
    modelProperty: 'candidateStarterUsers',
    description: translate('Specify more than one user as a comma separated list.'),

    get: function(element, node) {
      var bo = getBusinessObject(element)
      var candidateStarterUsers = bo.get('activiti:candidateStarterUsers')

      return {
        candidateStarterUsers: candidateStarterUsers ? candidateStarterUsers : ''
      }
    },

    set: function(element, values) {
      var bo = getBusinessObject(element)
      return cmdHelper.updateBusinessObject(element, bo, {
        'activiti:candidateStarterUsers': values.candidateStarterUsers || undefined
      })
    }
  })

  return [candidateStarterGroupsEntry, candidateStarterUsersEntry]
}
