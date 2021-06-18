'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var cmdHelper = require('../../../../helper/CmdHelper'),
  entryFactory = require('../../../../factory/EntryFactory'),
  elementHelper = require('../../../../helper/ElementHelper'),
  extensionElementsHelper = require('../../../../helper/ExtensionElementsHelper')

var resultVariable = require('./ResultVariable')

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject
var is = require('bpmn-js/lib/util/ModelUtil').is

var forEach = require('lodash/forEach')

var attributeInfo = {
  bpmn: {
    element: 'calledElement',
    binding: 'activiti:calledElementBinding',
    version: 'activiti:calledElementVersion',
    versionTag: 'activiti:calledElementVersionTag',
    tenantId: 'activiti:calledElementTenantId'
  },

  cmmn: {
    element: 'activiti:caseRef',
    binding: 'activiti:caseBinding',
    version: 'activiti:caseVersion',
    tenantId: 'activiti:caseTenantId'
  },

  dmn: {
    element: 'activiti:decisionRef',
    binding: 'activiti:decisionRefBinding',
    version: 'activiti:decisionRefVersion',
    versionTag: 'activiti:decisionRefVersionTag',
    tenantId: 'activiti:decisionRefTenantId'
  }
}

var mapDecisionResultOptions = [
  {
    name: 'singleEntry (TypedValue)',
    value: 'singleEntry'
  },
  {
    name: 'singleResult (Map<String, Object>)',
    value: 'singleResult'
  },
  {
    name: 'collectEntries (List<Object>)',
    value: 'collectEntries'
  },
  {
    name: 'resultList (List<Map<String, Object>>)',
    value: 'resultList'
  }
]

var delegateVariableMappingOptions = [
  {
    name: 'variableMappingClass',
    value: 'variableMappingClass'
  },
  {
    name: 'variableMappingDelegateExpression',
    value: 'variableMappingDelegateExpression'
  }
]

function getActivitiInWithBusinessKey(element) {
  var activitiIn = [],
    bo = getBusinessObject(element)

  var activitiInParams = extensionElementsHelper.getExtensionElements(bo, 'activiti:In')
  if (activitiInParams) {
    forEach(activitiInParams, function (param) {
      if (param.businessKey !== undefined) {
        activitiIn.push(param)
      }
    })
  }
  return activitiIn
}

function setBusinessKey(element, text, bpmnFactory) {
  var commands = []

  var activitiInWithBusinessKey = getActivitiInWithBusinessKey(element)

  if (activitiInWithBusinessKey.length) {
    commands.push(
      cmdHelper.updateBusinessObject(element, activitiInWithBusinessKey[0], {
        businessKey: text
      })
    )
  } else {
    var bo = getBusinessObject(element),
      extensionElements = bo.extensionElements

    if (!extensionElements) {
      extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory)
      commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }))
    }

    var activitiIn = elementHelper.createElement('activiti:In', { businessKey: text }, extensionElements, bpmnFactory)

    commands.push(
      cmdHelper.addAndRemoveElementsFromList(
        element,
        extensionElements,
        'values',
        'extensionElements',
        [activitiIn],
        []
      )
    )
  }

  return commands
}

function deleteBusinessKey(element) {
  var activitiInExtensions = getActivitiInWithBusinessKey(element)
  var commands = []
  forEach(activitiInExtensions, function (elem) {
    commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, elem))
  })
  return commands
}

function isSupportedCallableType(type) {
  return ['bpmn', 'cmmn', 'dmn'].indexOf(type) !== -1
}

module.exports = function (element, bpmnFactory, options, translate) {
  var bindingOptions = [
    {
      name: translate('latest'),
      value: 'latest'
    },
    {
      name: translate('deployment'),
      value: 'deployment'
    },
    {
      name: translate('version'),
      value: 'version'
    },
    {
      name: translate('versionTag'),
      value: 'versionTag'
    }
  ]

  var getCallableType = options.getCallableType

  var entries = []

  function getAttribute(element, prop) {
    var type = getCallableType(element)
    return (attributeInfo[type] || {})[prop]
  }

  function getCallActivityBindingValue(element) {
    var type = getCallableType(element)
    var bo = getBusinessObject(element)
    var attr = (attributeInfo[type] || {}).binding
    return bo.get(attr)
  }

  function getDelegateVariableMappingType(element) {
    var bo = getBusinessObject(element)

    var boVariableMappingClass = bo.get('activiti:variableMappingClass'),
      boVariableMappingDelegateExpression = bo.get('activiti:variableMappingDelegateExpression')

    var delegateVariableMappingType = ''
    if (typeof boVariableMappingClass !== 'undefined') {
      delegateVariableMappingType = 'variableMappingClass'
    } else if (typeof boVariableMappingDelegateExpression !== 'undefined') {
      delegateVariableMappingType = 'variableMappingDelegateExpression'
    }

    return delegateVariableMappingType
  }

  entries.push(
    entryFactory.textField({
      id: 'callable-element-ref',
      dataValueLabel: 'callableElementLabel',
      modelProperty: 'callableElementRef',

      get: function (element, node) {
        var callableElementRef

        var attr = getAttribute(element, 'element')
        if (attr) {
          var bo = getBusinessObject(element)
          callableElementRef = bo.get(attr)
        }

        var label = ''
        var type = getCallableType(element)
        if (type === 'bpmn') {
          label = translate('Called Element')
        } else if (type === 'cmmn') {
          label = translate('Case Ref')
        } else if (type === 'dmn') {
          label = translate('Decision Ref')
        }

        return {
          callableElementRef: callableElementRef,
          callableElementLabel: label
        }
      },

      set: function (element, values, node) {
        var newCallableElementRef = values.callableElementRef
        var attr = getAttribute(element, 'element')

        var props = {}
        props[attr] = newCallableElementRef || ''

        return cmdHelper.updateProperties(element, props)
      },

      validate: function (element, values, node) {
        var elementRef = values.callableElementRef
        var type = getCallableType(element)
        return isSupportedCallableType(type) && !elementRef
          ? { callableElementRef: translate('Must provide a value') }
          : {}
      },

      hidden: function (element, node) {
        return !isSupportedCallableType(getCallableType(element))
      }
    })
  )

  entries.push(
    entryFactory.selectBox({
      id: 'callable-binding',
      label: translate('Binding'),
      selectOptions: function (element) {
        var type = getCallableType(element)
        var options

        if (type === 'cmmn') {
          options = bindingOptions.filter(function (bindingOption) {
            return bindingOption.value !== 'versionTag'
          })
        } else {
          options = bindingOptions
        }
        return options
      },
      modelProperty: 'callableBinding',

      get: function (element, node) {
        var callableBinding

        var attr = getAttribute(element, 'binding')
        if (attr) {
          var bo = getBusinessObject(element)
          callableBinding = bo.get(attr) || 'latest'
        }

        return {
          callableBinding: callableBinding
        }
      },

      set: function (element, values, node) {
        var binding = values.callableBinding
        var attr = getAttribute(element, 'binding'),
          attrVer = getAttribute(element, 'version'),
          attrVerTag = getAttribute(element, 'versionTag')

        var props = {}
        props[attr] = binding

        // set version and versionTag values always to undefined to delete the existing value
        props[attrVer] = undefined
        props[attrVerTag] = undefined

        return cmdHelper.updateProperties(element, props)
      },

      hidden: function (element, node) {
        return !isSupportedCallableType(getCallableType(element))
      }
    })
  )

  entries.push(
    entryFactory.textField({
      id: 'callable-version',
      label: translate('Version'),
      modelProperty: 'callableVersion',

      get: function (element, node) {
        var callableVersion

        var attr = getAttribute(element, 'version')
        if (attr) {
          var bo = getBusinessObject(element)
          callableVersion = bo.get(attr)
        }

        return {
          callableVersion: callableVersion
        }
      },

      set: function (element, values, node) {
        var version = values.callableVersion
        var attr = getAttribute(element, 'version')

        var props = {}
        props[attr] = version || undefined

        return cmdHelper.updateProperties(element, props)
      },

      validate: function (element, values, node) {
        var version = values.callableVersion

        var type = getCallableType(element)
        return (
          isSupportedCallableType(type) &&
          getCallActivityBindingValue(element) === 'version' &&
          (!version ? { callableVersion: translate('Must provide a value') } : {})
        )
      },

      hidden: function (element, node) {
        var type = getCallableType(element)
        return !isSupportedCallableType(type) || getCallActivityBindingValue(element) !== 'version'
      }
    })
  )

  entries.push(
    entryFactory.textField({
      id: 'callable-version-tag',
      label: translate('Version Tag'),
      modelProperty: 'versionTag',

      get: function (element, node) {
        var versionTag

        var attr = getAttribute(element, 'versionTag')

        if (attr) {
          var bo = getBusinessObject(element)

          versionTag = bo.get(attr)
        }

        return {
          versionTag: versionTag
        }
      },

      set: function (element, values, node) {
        var versionTag = values.versionTag

        var attr = getAttribute(element, 'versionTag')

        var props = {}

        props[attr] = versionTag || undefined

        return cmdHelper.updateProperties(element, props)
      },

      validate: function (element, values, node) {
        var versionTag = values.versionTag

        var type = getCallableType(element)

        return (
          isSupportedCallableType(type) &&
          getCallActivityBindingValue(element) === 'versionTag' &&
          (!versionTag ? { versionTag: translate('Must provide a value') } : {})
        )
      },

      hidden: function (element, node) {
        var type = getCallableType(element)

        return !isSupportedCallableType(type) || getCallActivityBindingValue(element) !== 'versionTag'
      }
    })
  )

  entries.push(
    entryFactory.textField({
      id: 'tenant-id',
      label: translate('Tenant Id'),
      modelProperty: 'tenantId',

      get: function (element, node) {
        var tenantId

        var attr = getAttribute(element, 'tenantId')
        if (attr) {
          var bo = getBusinessObject(element)
          tenantId = bo.get(attr)
        }

        return {
          tenantId: tenantId
        }
      },

      set: function (element, values, node) {
        var tenantId = values.tenantId
        var attr = getAttribute(element, 'tenantId')

        var props = {}
        props[attr] = tenantId || undefined

        return cmdHelper.updateProperties(element, props)
      },

      hidden: function (element, node) {
        var type = getCallableType(element)
        return !isSupportedCallableType(type)
      }
    })
  )

  if (is(getBusinessObject(element), 'bpmn:CallActivity')) {
    entries.push(
      entryFactory.checkbox({
        id: 'callable-business-key',
        label: translate('Business Key'),
        modelProperty: 'callableBusinessKey',

        get: function (element, node) {
          var activitiIn = getActivitiInWithBusinessKey(element)

          return {
            callableBusinessKey: !!(activitiIn && activitiIn.length > 0)
          }
        },

        set: function (element, values, node) {
          if (values.callableBusinessKey) {
            return setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
          } else {
            return deleteBusinessKey(element)
          }
        }
      })
    )
  }

  entries.push(
    entryFactory.textField({
      id: 'business-key-expression',
      label: translate('Business Key Expression'),
      modelProperty: 'businessKey',

      get: function (element, node) {
        var activitiInWithBusinessKey = getActivitiInWithBusinessKey(element)

        return {
          businessKey: activitiInWithBusinessKey.length
            ? activitiInWithBusinessKey[0].get('activiti:businessKey')
            : undefined
        }
      },

      set: function (element, values, node) {
        var businessKey = values.businessKey

        return setBusinessKey(element, businessKey, bpmnFactory)
      },

      validate: function (element, values, node) {
        var businessKey = values.businessKey

        return businessKey === '' ? { businessKey: translate('Must provide a value') } : {}
      },

      hidden: function (element, node) {
        return !getActivitiInWithBusinessKey(element).length
      }
    })
  )

  entries = entries.concat(
    resultVariable(
      element,
      bpmnFactory,
      {
        id: 'dmn-resultVariable',
        getBusinessObject: getBusinessObject,
        getImplementationType: getCallableType,
        hideResultVariable: function (element, node) {
          return getCallableType(element) !== 'dmn'
        }
      },
      translate
    )
  )

  entries.push(
    entryFactory.selectBox({
      id: 'dmn-map-decision-result',
      label: translate('Map Decision Result'),
      selectOptions: mapDecisionResultOptions,
      modelProperty: 'mapDecisionResult',

      get: function (element, node) {
        var bo = getBusinessObject(element)
        return {
          mapDecisionResult: bo.get('activiti:mapDecisionResult') || 'resultList'
        }
      },

      set: function (element, values, node) {
        return cmdHelper.updateProperties(element, {
          'activiti:mapDecisionResult': values.mapDecisionResult || 'resultList'
        })
      },

      hidden: function (element, node) {
        var bo = getBusinessObject(element)
        var resultVariable = bo.get('activiti:resultVariable')
        return !(getCallableType(element) === 'dmn' && typeof resultVariable !== 'undefined')
      }
    })
  )

  entries.push(
    entryFactory.selectBox({
      id: 'delegateVariableMappingType',
      label: translate('Delegate Variable Mapping'),
      selectOptions: delegateVariableMappingOptions,
      emptyParameter: true,
      modelProperty: 'delegateVariableMappingType',

      get: function (element, node) {
        return {
          delegateVariableMappingType: getDelegateVariableMappingType(element)
        }
      },

      set: function (element, values, node) {
        var delegateVariableMappingType = values.delegateVariableMappingType

        var props = {
          'activiti:variableMappingClass': undefined,
          'activiti:variableMappingDelegateExpression': undefined
        }

        if (delegateVariableMappingType === 'variableMappingClass') {
          props['activiti:variableMappingClass'] = ''
        } else if (delegateVariableMappingType === 'variableMappingDelegateExpression') {
          props['activiti:variableMappingDelegateExpression'] = ''
        }

        return cmdHelper.updateProperties(element, props)
      },

      hidden: function (element, node) {
        return getCallableType(element) !== 'bpmn'
      }
    })
  )

  entries.push(
    entryFactory.textField({
      id: 'delegateVariableMapping',
      dataValueLabel: 'delegateVariableMappingLabel',
      modelProperty: 'delegateVariableMapping',

      get: function (element, node) {
        var bo = getBusinessObject(element)

        var label = ''
        var delegateVariableMapping = undefined
        var type = getDelegateVariableMappingType(element)

        if (type === 'variableMappingClass') {
          label = translate('Class')
          delegateVariableMapping = bo.get('activiti:variableMappingClass')
        } else if (type === 'variableMappingDelegateExpression') {
          label = translate('Delegate Expression')
          delegateVariableMapping = bo.get('activiti:variableMappingDelegateExpression')
        }

        return {
          delegateVariableMapping: delegateVariableMapping,
          delegateVariableMappingLabel: label
        }
      },

      set: function (element, values, node) {
        var delegateVariableMapping = values.delegateVariableMapping

        var attr = 'activiti:' + getDelegateVariableMappingType(element)

        var props = {}
        props[attr] = delegateVariableMapping || undefined

        return cmdHelper.updateProperties(element, props)
      },

      validate: function (element, values, node) {
        var delegateVariableMapping = values.delegateVariableMapping
        return (
          getCallableType(element) === 'bpmn' &&
          (!delegateVariableMapping ? { delegateVariableMapping: translate('Must provide a value') } : {})
        )
      },

      hidden: function (element, node) {
        return !(getCallableType(element) === 'bpmn' && getDelegateVariableMappingType(element) !== '')
      }
    })
  )

  return entries
}