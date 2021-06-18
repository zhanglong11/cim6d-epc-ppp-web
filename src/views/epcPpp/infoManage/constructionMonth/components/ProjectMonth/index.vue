<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="140px">
    <el-card shadow="never">
      <div slot="header" class="card-header">
        <span
          >本月完成情况
          <span style="font-size: 12px; font-weight: bold"
            >起始日期:{{ form.reportStartDate | ymd }}~{{ form.reportEndDate | ymd }}</span
          >
        </span>
      </div>
      <el-form-item label="本月计划工程进展">
        <ul class="listContainer form-input">
          <li v-for="(item, index) of taskList" :key="item.extraId">
            {{ index + 1 }},{{ item.synthesisTaskName || '-' }}
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="本月计划产值" prop="thisMonthPlanProduction">
        <el-input v-model.number="form.thisMonthPlanProduction" type="number" class="form-input" /> 万元
      </el-form-item>

      <!-- <el-form-item label="本月实际工程进展">
        <ul class="listContainer form-input">
          <li v-for="item of taskList" :key="'plan' + item.extraId" class="status">
            <span class="name">{{ item.taskName }}</span>
            <span class="statusBox"
              ><el-tag size="mini" :style="{ backgroundColor: backgroundColorList[item.status] }">{{
                $getLabel(taskStatusList, item.status)
              }}</el-tag></span
            >
          </li>
        </ul>
      </el-form-item>-->
      <el-form-item label="本月实际工程进展" prop="thisMonthActualProgress">
        <el-input v-model="form.thisMonthActualProgress" type="textarea" rows="4" class="form-input" />
      </el-form-item>
      <el-form-item label="本月实际产值" prop="thisMonthFinishProduction">
        <el-input v-model.number="form.thisMonthFinishProduction" type="number" class="form-input" /> 万元
      </el-form-item>
      <el-form-item label="本月完成率" prop="thisMonthFinishRate">
        <el-input v-model.number="form.thisMonthFinishRate" type="number" class="form-input" /> %</el-form-item
      >
      <el-form-item label="累计完成产值" prop="cumulativeFinishProduction">
        <el-input v-model.number="form.cumulativeFinishProduction" type="number" class="form-input" />
        万元</el-form-item
      >
    </el-card>

    <el-card shadow="never" style="margin-bottom: 60px">
      <div slot="header" class="card-header">
        <span>下月计划</span>
      </div>
      <el-form-item label="选择日期">
        <el-date-picker
          v-model="form.nextDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="form-input"
          value-format="yyyy-MM-dd 00:00:00"
          @change="handleChangeNextDate"
        />
      </el-form-item>
      <!--<el-form-item label="下月工程进展">
        <ul class="listContainer form-input">
          <li v-for="item of nextTaskList" :key="'nextPlan' + item.extraId" class="status">
            <span class="name">{{ item.taskName }}</span>
            <span class="statusBox"
              ><el-tag size="mini" :style="{ backgroundColor: backgroundColorList[item.status] }">{{
                $getLabel(taskStatusList, item.status)
              }}</el-tag></span
            >
          </li>
        </ul>
      </el-form-item>-->
      <el-form-item label="下月计划工程进展" prop="nextMonthPlanProgress">
        <el-input v-model="form.nextMonthPlanProgress" type="textarea" rows="4" class="form-input" />
      </el-form-item>
      <el-form-item label="下月计划产值" prop="nextMonthPlanProduction">
        <el-input v-model.number="form.nextMonthPlanProduction" type="number" class="form-input" /> 万元
      </el-form-item>
      <el-form-item label="计划完成率" prop="planFinishRate">
        <el-input v-model.number="form.planFinishRate" type="number" class="form-input" /> %</el-form-item
      >
    </el-card>
  </el-form>
</template>

<script>
import Api from '../../api'
export default {
  name: 'ProjectMonth',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {
        thisMonthActualProgress: '',
        nextMonthStartDate: '',
        nextMonthEndDate: '',
        nextDate: [],
        nextMonthPlanProgress: '',
        thisMonthPlanProgress: ''
      },
      rules: {
        thisMonthPlanProduction: [{ required: true, message: '本月计划产值必填' }],
        thisMonthFinishProduction: [{ required: true, message: '本月实际产值必填' }],
        cumulativeFinishProduction: [{ required: true, message: '累计产值必填' }]
      },
      taskList: [],
      backgroundColorList: ['#00cc00', '#6c5cb4', '#3211c7', '#4ed2e3', '#e82b47', '#f1ce23']
    }
  },
  computed: {
    //任务状态
    taskStatusList() {
      return (
        this.$getArgList('taskStatus') || [
          { value: 0, label: '未领取' },
          { value: 1, label: '已领取' },
          { value: 2, label: '未完成' },
          { value: 3, label: '超前完成' },
          { value: 4, label: '正常完成' },
          { value: 5, label: '滞后完成' }
        ]
      )
    }
  },
  watch: {
    'form.reportStartDate': {
      immediate: false,
      handler(newVal, oldVal) {
        let start = moment(newVal).startOf('month').subtract('month', -1).format('YYYY-MM-DD 00:00:00')
        let end = moment(newVal).endOf('month').subtract('month', -1).endOf('month').format('YYYY-MM-DD 23:59:59')
        if (oldVal) {
          this.form.nextMonthStartDate = start
          this.form.nextMonthEndDate = end
          this.form.nextDate = [new Date(start), new Date(end)]
          this.getSchedule(this.form.reportStartDate, this.form.reportEndDate)
          this.getPlanSchedule(this.form.reportStartDate, this.form.reportEndDate)
          this.getPlanSchedule(start, end, true)
        } else {
          if (!this.form.nextMonthPlanProgress) {
            this.form.nextMonthStartDate = start
            this.form.nextMonthEndDate = end
            this.form.nextDate = [new Date(start), new Date(end)]
            this.getPlanSchedule(start, end, true)
          }
          if (!this.form.thisMonthActualProgress) {
            this.getSchedule(this.form.reportStartDate, this.form.reportEndDate)
          }
          if (!this.form.thisMonthPlanProgress) {
            this.getPlanSchedule(this.form.reportStartDate, this.form.reportEndDate, false)
          }
        }
      }
    },
    'form.nextDate'(val) {
      if (val && val.length) {
        this.form.nextMonthStartDate = val[0]
        this.form.nextMonthEndDate = val[1]
      }
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //获取实际
    async getSchedule(startDate, endDate) {
      let res = await Api.getScheduleList({ startDate, endDate, dateType: 0, page: 1, rows: 9999 }).then(
        res => res.data.records || []
      )
      let strArr = ''
      res.forEach((item, index) => {
        let statusArr = this.$getLabel(this.taskStatusList, item.status)
        strArr += `${index + 1},${item.synthesisTaskName}(${statusArr})\n`
      })
      this.form.thisMonthActualProgress = strArr
    },
    //获取计划
    async getPlanSchedule(startDate, endDate, isNext = false) {
      let res = await Api.getScheduleList({ startDate, endDate, dateType: 1, page: 1, rows: 9999 }).then(
        res => res.data.records || []
      )
      let strArr = ''
      res.forEach((item, index) => {
        strArr += `${index + 1},${item.synthesisTaskName}\n`
      })
      if (isNext) {
        this.form.nextMonthPlanProgress = strArr
      } else {
        this.taskList = res
        this.form.thisMonthPlanProgress = strArr
      }
    },
    //下月日期范围改变时
    handleChangeNextDate(val) {
      if (val) {
        this.getPlanSchedule(val[0], val[1], true)
      }
    }
  }
}
</script>

<style scoped lang="less">
.listContainer {
  border: 1px #999 solid;
  padding: 10px;
  .status {
    .name {
    }
    .statusBox {
      margin-left: 10px;
      .el-tag {
        color: #fff;
      }
    }
  }
}
.el-card {
  margin-bottom: 10px;
}
.form-input {
  width: 500px;
}
</style>
