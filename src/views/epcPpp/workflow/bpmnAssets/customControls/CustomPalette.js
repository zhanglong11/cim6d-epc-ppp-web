/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
export default class CustomPalette {
  constructor(create, elementFactory, palette, translate) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    palette.registerProvider(this)
  }

  getPaletteEntries(element) {
    const { create, elementFactory, translate } = this

    function createServiceTask(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:UserTask' })
      create.start(event, shape)
    }
    function createCallActivity(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:CallActivity' })
      create.start(event, shape)
    }

    return {
      'create.user-task': {
        group: 'activity',
        className: 'bpmn-icon-user-task',
        title: translate('Create UserTask'),
        action: {
          dragstart: createServiceTask,
          click: createServiceTask
        }
      },
      'create.call-activity': {
        group: 'activity',
        className: 'bpmn-icon-call-activity',
        title: translate('Create CallActivity'),
        action: {
          dragstart: createCallActivity,
          click: createCallActivity
        }
      }
    }
  }
}

CustomPalette.$inject = ['create', 'elementFactory', 'palette', 'translate']
