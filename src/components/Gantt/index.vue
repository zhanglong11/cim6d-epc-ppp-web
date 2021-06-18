<template>
  <div>
    <el-form style="margin-top: 15px; text-align: right" inline>
      <el-form-item v-if="baseLineCompare" label="参考基准" label-width="80px">
        <el-select v-model="activeBaseLine">
          <el-option :value="null" label="无"></el-option>
          <el-option v-for="e in baseLineList" :key="e.id" :value="e.id" :label="e.planName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视图" label-width="50px" style="margin-right: 0">
        <el-radio-group v-model="viewMode" size="mini">
          <el-radio-button :label="1">月</el-radio-button>
          <el-radio-button :label="2">周</el-radio-button>
          <el-radio-button :label="3">日</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!--/**
    任务名称：2868/修改bug
    开发人员：李建敏
    日期：2020-3月-7日
    任务类型：2、复制修改代码 （3行）
    **/-->
    <div
      ref="gantt"
      :style="{ height: Math.max(tasks.length * 40 + 70, 200) + 'px' }"
      style="max-height: 600px; margin-top: 0"
    ></div>
  </div>
</template>

<script>
// import '@/assets/js/dhtmlxgantt7.0.9'
import 'dhtmlx-gantt/codebase/dhtmlxgantt'
// import 'dhtmlx-gantt/codebase/locale/locale_cn.js'
export default {
  name: 'Gantt',
  props: {
    tasks: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    baseLineCompare: {
      type: Boolean,
      default: false
    },
    // 是否可编辑
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gantt: null,
      baseLineList: [],
      activeBaseLine: null,
      activeBaseLineTaskList: [],
      layerId: null,
      viewMode: 3,
      taskList: []
    }
  },
  watch: {
    tasks() {
      if (!this.gantt) {
        this.setupGanttChart()
      }
      this.updateTasks()
    },
    async activeBaseLine(id) {
      if (id) {
        await this.axios.schedule.get('schedule/plan/taskList/' + id).then(res => {
          this.activeBaseLineTaskList = res.data
        })
      }
      this.render()
    },
    viewMode() {
      this.setScale()
    }
  },
  created() {
    this.axios.design.get('schedule/plan/listBase/' + localStorage.getItem('projectId')).then(res => {
      this.baseLineList = res.data
    })
  },
  methods: {
    setupGanttChart() {
      gantt.config.xml_date = '%Y-%m-%d %H:%i'
      gantt.config.day_date = '%M %d日 %D'
      gantt.config.default_date = '%Y年 %M %d日'
      gantt.config.month_date = '%Y年 %M'
      console.log(222, this.isEdit)
      gantt.config.readonly = !this.isEdit // 只读
      gantt.config.open_tree_initially = true // 展开全部
      gantt.locale = {
        date: {
          month_full: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月'
          ],
          month_short: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          day_full: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
          day_short: ['日', '一', '二', '三', '四', '五', '六']
        },
        labels: {
          new_task: '新任務',
          dhx_cal_today_button: '今天',
          day_tab: '日',
          week_tab: '周',
          month_tab: '月',
          new_event: '新建日程',
          icon_save: '保存',
          icon_cancel: '关闭',
          icon_details: '详细',
          icon_edit: '编辑',
          icon_delete: '删除',
          confirm_closing: '请确认是否撤销修改!',
          confirm_deleting: '是否删除日程?',
          section_description: '描述',
          section_time: '时间范围',
          section_type: '类型',
          column_wbs: '工作分解结构',
          column_text: '任务名称',
          column_start_date: '开始时间',
          column_duration: '工期（天）',
          column_add: '',
          link: '关联',
          confirm_link_deleting: '将被删除',
          link_start: ' (开始)',
          link_end: ' (结束)',
          type_task: '任务',
          type_project: '项目',
          type_milestone: '里程碑',
          minutes: '分钟',
          hours: '小时',
          days: '天',
          weeks: '周',
          months: '月',
          years: '年',
          message_ok: 'OK',
          message_cancel: '关闭',
          section_constraint: 'Constraint',
          constraint_type: 'Constraint type',
          constraint_date: 'Constraint date',
          asap: 'As Soon As Possible',
          alap: 'As Late As Possible',
          snet: 'Start No Earlier Than',
          snlt: 'Start No Later Than',
          fnet: 'Finish No Earlier Than',
          fnlt: 'Finish No Later Than',
          mso: 'Must Start On',
          mfo: 'Must Finish On',
          resources_filter_placeholder: 'type to filter',
          resources_filter_label: 'hide empty'
        }
      }
      gantt.init(this.$refs.gantt)
      gantt.parse({
        data: [
          {
            id: 1,
            text: 'Project #1',
            start_date: '2019-08-01 00:00:00',
            duration: null,
            parent: 0,
            progress: 0
          },
          { id: 2, text: 'Task #1', start_date: '2019-08-01 00:00:00', duration: 5, parent: 1, progress: 1 },
          { id: 3, text: 'Task #2', start_date: '2019-08-06 00:00:00', duration: 2, parent: 1, progress: 0.5 },
          {
            id: 4,
            text: 'Task #3',
            start_date: '2019-08-01 00:00:00',
            duration: null,
            parent: 1,
            progress: 0.8
          },
          { id: 5, text: 'Task #3.1', start_date: '2019-08-09 00:00:00', duration: 2, parent: 4, progress: 0.2 },
          { id: 6, text: 'Task #3.2', start_date: '2019-08-11 00:00:00', duration: 1, parent: 4, progress: 0 }
        ],
        links: [
          { id: 1, source: 2, target: 3, type: '0' },
          { id: 2, source: 3, target: 4, type: '0' },
          { id: 3, source: 5, target: 6, type: '0' }
        ]
      })
      return
      gantt.config.scale_height = 50
      gantt.config.task_height = 16
      gantt.config.row_height = 40
      gantt.config.min_column_width = 40
      gantt.config.show_grid = false
      gantt.config.show_task_cells = false
      gantt.config.readonly = true
      gantt.config.columns = []
      gantt.init(this.$refs.gantt)
      this.setScale()
      this.render()
      gantt.attachEvent('onTaskDblClick', id => {
        return false
      })
      gantt.attachEvent('onTaskClick', id => {
        this.$emit('taskClick', id)
      })
    },
    render() {
      if (this.layerId) {
        gantt.removeTaskLayer(this.layerId)
      }
      this.layerId = gantt.addTaskLayer(task => {
        if (!this.activeBaseLine) {
          if (task.actual_start && task.actual_end) {
            let sizes = gantt.getTaskPosition(task, task.actual_start, task.actual_end)
            let el = document.createElement('div')
            el.className = 'baseline'
            el.style.left = sizes.left + 'px'
            el.style.width = sizes.width + 'px'
            el.style.top = sizes.top + gantt.config.task_height + 13 + 'px'
            el.style.height = 14 + 'px'
            el.innerHTML = `
            <div class="gantt_task_content" style="line-height: 14px;">
            <span style="z-index:11;color:#fff;font-weight: bold;">实际</span>
            <span style="display: block;
            position: absolute;
            height: 100%;
            width: ${task.progress}%;
            background-color: #fe8c00;
            top: 0;
            z-index:10">
            <span style="position: absolute;left: 100%;margin-left: 5px;">${task.progress}%</span>
            </span>
            </div>`
            el.style.pointerEvents = 'none'
            return el
          }
        } else {
          const baseLineTask = _.find(this.activeBaseLineTaskList, { taskUniqueId: +task.id })
          if (baseLineTask) {
            let sizes = gantt.getTaskPosition(
              task,
              moment(baseLineTask.planStartTime).toDate(),
              moment(baseLineTask.planEndTime).toDate()
            )
            let el = document.createElement('div')
            el.className = 'baseline'
            el.style.left = sizes.left + 'px'
            el.style.width = sizes.width + 'px'
            el.style.top = sizes.top + gantt.config.task_height + 13 + 'px'
            el.style.height = 14 + 'px'
            el.innerHTML = `<div class="gantt_task_content" style="line-height: 14px;">基准</div>`
            el.style.pointerEvents = 'none'
            return el
          }
        }

        return false
      })
      gantt.render()
    },
    updateTasks() {
      gantt.clearAll()
      let links = []
      let taskList = []
      let hideDuration = []
      this.tasks.forEach(e => {
        e.dependencies.forEach(f => {
          links.push({ id: _.uniqueId(), source: f, target: e.id, type: '0' })
        })
        if (!hideDuration.includes(e.parent)) {
          hideDuration.push(e.parent)
        }
        taskList.push(e)
      })
      taskList.map(e => {
        // 处理有子节点的数据工期和开始时间为空
        if (hideDuration.includes(e.id)) {
          e.duration = null
          e.start_date = null
        }
      })
      this.taskList = taskList
      console.log('data', this.taskList)
      console.log('links', links)

      gantt.parse({
        data: this.taskList,
        links
      })
      // 在用户完成拖动并释放鼠标按钮之后但在应用更改之前触发
      gantt.attachEvent('onBeforeTaskChanged', (id, mode, task) => {
        console.log('onBeforeTaskChanged', id, mode, task)
        return true
      })
    },
    setScale() {
      gantt.config.scales = [
        [{ unit: 'month', step: 1, format: '%Y年%M' }],
        [{ unit: 'week', step: 1, format: '%Y年%M%d日', width: 200 }],
        [
          { unit: 'week', step: 1, format: '%F, %Y' },
          { unit: 'day', step: 1, format: '%j, %D' }
        ]
      ][this.viewMode - 1]
      gantt.config.min_column_width = [60, 100, 40][this.viewMode - 1]
      gantt.render()
    }
  }
}
</script>

<style lang="less">
@import '~dhtmlx-gantt/codebase/dhtmlxgantt.css';
</style>
