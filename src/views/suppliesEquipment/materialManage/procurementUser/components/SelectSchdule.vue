<template>
  <el-dialog
    width="75%"
    :modal="true"
    top="10vh"
    title="请选择"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="main">
      <div
        class="task-list-wrap"
        :class="{
          'full-height': !$route.meta.showAffectManage && !([2, 3].includes(form.status) && $route.meta.showAudit)
        }"
      >
        <div class="aside">
          <el-tree
            highlight-current
            :expand-on-click-node="false"
            :data="treeData"
            default-expand-all
            @current-change="data => (activeNode = data)"
          ></el-tree>
        </div>
        <div class="task-list">
          <vxe-table
            ref="table"
            max-height="800px"
            highlightHoverRow
            highlightCurrentRow
            resizable
            :tree-config="{ expandAll: true }"
            :checkbox-config="{ labelField: 'wbsCode', highlight: true }"
            :data="computedListWithFilter"
            row-id="taskUniqueId"
            @current-change="({ row }) => (activeRow = row)"
          >
            <vxe-table-column title="序号" type="checkbox" width="120px"></vxe-table-column>
            <vxe-table-column title="任务编号" field="wbsCode" width="110px" tree-node></vxe-table-column>
            <vxe-table-column title="任务名称" field="name" min-width="180px"></vxe-table-column>
            <vxe-table-column
              width="100px"
              title="计划开始时间"
              :formatter="['toDateString', 'yyyy-MM-dd']"
              field="planStartTime"
            ></vxe-table-column>
            <vxe-table-column
              width="100px"
              title="计划结束时间"
              :formatter="['toDateString', 'yyyy-MM-dd']"
              field="planEndTime"
            ></vxe-table-column>
            <vxe-table-column title="工期(天)" width="70px" field="planDuration"></vxe-table-column>
            <vxe-table-column
              width="100px"
              title="实际开始时间"
              :formatter="['toDateString', 'yyyy-MM-dd']"
              field="actualStartTime"
            ></vxe-table-column>
            <vxe-table-column
              width="100px"
              title="实际结束时间"
              :formatter="['toDateString', 'yyyy-MM-dd']"
              field="actualEndTime"
            ></vxe-table-column>
            <vxe-table-column title="实际工期(天)" width="100px" field="realityDuration"></vxe-table-column>
            <vxe-table-column
              title="里程碑"
              width="80px"
              field="type"
              :formatter="({ cellValue }) => (cellValue === 2 ? '√' : '')"
            ></vxe-table-column>
            <vxe-table-column
              title="验收状态"
              width="80px"
              field="type"
              :formatter="({ cellValue }) => (cellValue === 2 ? '√' : '')"
            ></vxe-table-column>
            <vxe-table-column
              title="当前进度"
              width="100px"
              field="actualProgress"
              :formatter="({ cellValue }) => (cellValue ? cellValue * 100 + '%' : '')"
            ></vxe-table-column>
            <vxe-table-column title="任务状态" width="100px" field="statusText"></vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </div>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>
<script>
import { processProgressApi } from '@/api/process-progress'
import _ from 'lodash'
import toTree from '@/utils/toTree'
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
import toFlat from '@/utils/toFlat'
export default {
  name: 'SelectSchdule',
  props: {
    visible: {},
    targetType: {
      default: null
    }
  },
  data() {
    return {
      originList: [],
      debugEventLog: [],
      checkName: '',
      checkId: '',
      form: {},
      q: '', //关键字搜索树状图
      debounceQ: '',
      list: [], //工序的具体信息，用来展示表格数据
      activeNode: null,
      activeProcedureId: this.$route.query.id
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },

    computedList() {
      let data = this.list
      let list = toTree(data, 'parentTaskUniqueId', 'planStartTime', 'taskUniqueId', true)
      treeForEach(list, (item, parent, index) => {
        if (!parent) {
          item.wbsCode = index + 1
        } else {
          item.wbsCode = parent.wbsCode + '.' + (index + 1)
        }
        let PS = item.planStartTime.slice(0, 10)
        let PE = item.planEndTime.slice(0, 10)
        let today = moment().format('YYYY-MM-DD')
        if ([1, 2].includes(item.status)) {
          let AS = item.actualStartTime.slice(0, 10)
          if (item.status === 1) {
            if (AS > PS) {
              item.statusText = '延期开始'
            } else if (AS < PS) {
              item.statusText = '提前开始'
            } else {
              item.statusText = '正常开始'
            }
          } else if (item.status === 2) {
            let AE = item.actualEndTime.slice(0, 10)
            if (AE < PE) {
              item.statusText = '提前结束'
            } else if (AE > PE) {
              item.statusText = '延期结束'
            } else {
              item.statusText = '正常结束'
            }
          }
        } else {
          if (today > PS) {
            item.statusText = '已延期'
          } else {
            item.statusText = '未开始'
          }
        }
      })
      return _.cloneDeep(list)
    },
    computedListWithFilter() {
      let list = this.computedList
      if (this.activeNode) {
        const { year, month } = this.activeNode
        if (_.isNumber(month)) {
          list = treeFilter(list, e => {
            return moment()
              .year(year)
              .month(month)
              .isBetween(moment(e.planStartTime), moment(e.planEndTime), 'month', '[]')
          })
        } else if (year) {
          list = treeFilter(list, e => {
            return moment().year(year).isBetween(moment(e.planStartTime), moment(e.planEndTime), 'year', '[]')
          })
        }
      }
      return list
    },
    treeData() {
      let yearList = []
      // 计算年月集合
      function c(start, end) {
        const startYear = moment(start).year()
        const startMonth = moment(start).month()
        const endYear = moment(end).year()
        const endMonth = moment(end).month()
        let currentYear = startYear
        let currentMonth = startMonth
        while (!(currentYear > endYear || (currentYear === endYear && currentMonth > endMonth))) {
          let targetYear = _.find(yearList, { year: currentYear })
          if (targetYear) {
            if (!targetYear.children.includes(currentMonth)) {
              targetYear.children.push(currentMonth)
            }
          } else {
            yearList.push({
              year: currentYear,
              children: [currentMonth]
            })
          }
          if (currentMonth + 1 === 12) {
            currentYear += 1
            currentMonth = 0
          } else {
            currentMonth += 1
          }
        }
      }
      _.sortBy(this.originList, 'planStartTime').forEach(e => {
        c(e.planStartTime, e.planEndTime)
      })
      yearList.forEach(e => {
        e.label = e.year + '年进度计划'
        e.children = e.children.map(month => ({
          label: e.year + '年' + (month + 1) + '月计划',
          year: e.year,
          month
        }))
      })
      return [
        {
          label: this.form.planName || '当前计划',
          children: yearList
        }
      ]
    }
  },
  watch: {
    activeProcedureId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.refresh()
        }
      }
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = {}
      if (this.$route.params.id) {
        res = await this.axios.schedule.get('construct/plan/detail/' + this.$route.params.id)
        this.planId = this.$route.params.id
      } else {
        res = await this.axios.schedule.get('construct/plan/taskList/' + localStorage.getItem('projectId'))
      }
      if (res.data) {
        this.originList = _.cloneDeep(res.data.taskList)
        this.list = res.data.taskList
        if (this.$route.params.id) {
          this.effectList = res.data.effectList || []
          this.form = res.data
        }
      }
    },
    loadData() {
      this.$refs.table.loadData(this.list)
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },

    submit() {
      let checked = this.$refs.table.getCheckboxRecords()
      let checkName = checked.map(item => item.name)
      let checkId = checked.map(item => item.id)
      if (checkName.length) {
        this.$emit('getTarget', {
          label: checkName.join(','),
          id: checkId.join(',')
        })
        this.$emit('update:visible', false)
      } else {
        this.$message.info('请选择进度')
        return
      }
    },

    handleSearch: _.debounce(function (val) {
      this.debounceQ = val
    }, 300)
  }
}
</script>

<style scoped lang="less">
div.main {
  background-color: #f0f2f5;
  padding: 0;
  .task-list-wrap {
    display: flex;
    &.full-height {
      min-height: calc(100vh - 120px);
    }
    .aside {
      width: 240px;
      margin-right: 10px;
      padding: 20px;
      background-color: #fff;
    }
    .task-list {
      width: calc(100% - 240px);
      padding: 20px;
      background-color: #fff;
    }
  }
  .audit-status {
    display: inline-block;
    vertical-align: middle;
    font-size: 18px;
    margin-bottom: 17px;
    margin-left: 15px;
    font-weight: bold;
    span:first-child {
      color: #8f8f8f;
    }
    span:last-child {
      color: #606060;
    }
  }
}
.add-row {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
  font-size: 14px;
  line-height: 30px;
  border: 1px dashed #ddd;
  margin-top: -1px;
  i {
    margin-right: 8px;
  }
  text-align: center;
}
.main-footer {
  text-align: right;
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: calc(100% - 40px);
  background-color: #fff;
  margin-top: 15px;
  padding: 10px;
}
</style>
