import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg'
import { customElements, customConfig, hasLabelElements } from './config'

const HIGH_PRIORITY = 1500
let activeIds = []
let activeColor = ''

// 传入节点id数组
export const setActiveIds = option => {
  activeIds = option.listIds
  activeColor = option.activeColor
}

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY)

    this.bpmnRenderer = bpmnRenderer
  }

  canRender(element) {
    //return element
    // ignore labels
    return !element.labelTarget
  }

  drawShape(parentNode, element) {
    const id = element.id // 获取到类型
    if (activeIds.includes(id)) {
      //console.log('------------', id)
      element.businessObject.di.set('bioc:stroke', activeColor)
      const shape = this.bpmnRenderer.drawShape(parentNode, element)
      return shape
    }
    const shape = this.bpmnRenderer.drawShape(parentNode, element)
    return shape
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape)
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer']
