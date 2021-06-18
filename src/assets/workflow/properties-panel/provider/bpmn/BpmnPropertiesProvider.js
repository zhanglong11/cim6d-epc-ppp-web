'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var inherits = require('inherits')

var PropertiesActivator = require('../../PropertiesActivator')

var processProps = require('./parts/ProcessProps'),
  eventProps = require('./parts/EventProps'),
  linkProps = require('./parts/LinkProps'),
  documentationProps = require('./parts/DocumentationProps'),
  idProps = require('./parts/IdProps'),
  nameProps = require('./parts/NameProps'),
  executableProps = require('./parts/ExecutableProps')

function createGeneralTabGroups(element, canvas, bpmnFactory, elementRegistry, translate) {
  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  }
  idProps(generalGroup, element, translate)
  nameProps(generalGroup, element, bpmnFactory, canvas, translate)
  processProps(generalGroup, element, translate)
  executableProps(generalGroup, element, translate)

  var detailsGroup = {
    id: 'details',
    label: translate('Details'),
    entries: []
  }
  linkProps(detailsGroup, element, translate)
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate)

  var documentationGroup = {
    id: 'documentation',
    label: translate('Documentation'),
    entries: []
  }

  documentationProps(documentationGroup, element, bpmnFactory, translate)

  return [generalGroup, detailsGroup, documentationGroup]
}

function BpmnPropertiesProvider(eventBus, canvas, bpmnFactory, elementRegistry, translate) {
  PropertiesActivator.call(this, eventBus)

  this.getTabs = function(element) {
    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(element, canvas, bpmnFactory, elementRegistry, translate)
    }

    return [generalTab]
  }
}

BpmnPropertiesProvider.$inject = ['eventBus', 'canvas', 'bpmnFactory', 'elementRegistry', 'translate']

inherits(BpmnPropertiesProvider, PropertiesActivator)

module.exports = BpmnPropertiesProvider
