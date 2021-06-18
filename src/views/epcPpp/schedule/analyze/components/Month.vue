<template>
  <div class="month-main">
    <div class="chart-wrap">
      <v-chart :options="options1"></v-chart>
      <v-chart :options="options2"></v-chart>
    </div>
    <div class="grid-wrap">
      <div class="tooltips">
        <el-form inline>
          <el-form-item label="领取单位">
            <SelectCompany
              :id.sync="filterForm.receivePersonCompanyId"
              v-model="filterForm.receivePersonCompany"
              style="width: 200px"
              :multiple="false"
            ></SelectCompany>
          </el-form-item>
          <el-form-item label="是否延期">
            <el-select v-model="filterForm.status">
              <el-option label="超前" :value="3"></el-option>
              <el-option label="正常" :value="4"></el-option>
              <el-option label="延期" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="filterForm.keyWord"
              placeholder="进度名称/领取人"
              suffix-icon="el-icon-search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="() => $refs.table.reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
      <Grid
        ref="table"
        :request="request"
        :row-class-name="({ row }) => ['', '', '', 'ahead', '', 'exceed'][row.status]"
        :filter-form.sync="filterForm"
        :immediate="false"
      >
        <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
        <vxe-table-column title="任务名称" field="taskName"></vxe-table-column>
        <vxe-table-column title="领取人" field="receivePersonName"></vxe-table-column>
        <vxe-table-column title="领取单位" field="receivePersonCompanyName"></vxe-table-column>
        <vxe-table-column title="计划开始时间" field="planStartDate"></vxe-table-column>
        <vxe-table-column title="计划结束时间" field="planEndDate"></vxe-table-column>
        <vxe-table-column title="实际开始时间" field="actualStartDate"></vxe-table-column>
        <vxe-table-column title="实际结束时间" field="actualEndDate"></vxe-table-column>
        <vxe-table-column title="滞后/超前（天）" field="advanceOrDelayDays"></vxe-table-column>
        <vxe-table-column
          title="任务状态"
          field="status"
          :formatter="({ cellValue }) => [null, null, null, '超前完成', '正常完成', '滞后完成'][cellValue]"
        ></vxe-table-column>
      </Grid>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import SelectCompany from '@/views/epcPpp/ccp/components/SelectCompany'
export default {
  name: 'Month',
  // import引入的组件需要注入到对象中才能使用
  components: { SelectCompany },
  props: {
    year: {
      type: Number
    },
    month: {
      type: Number
    }
  },
  data() {
    // 这里存放数据
    return {
      options1: {
        title: {
          text: `${this.year}年${this.month + 1}月份进度分析柱状图`,
          top: 'bottom',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#555'
          }
        },
        color: ['#feb64d', '#5bc49f', '#fb6e6c'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['正常完成数量', '超前完成数量', '滞后完成数量']
        },
        xAxis: [
          {
            type: 'category',
            name: this.month + 1 + '月',
            axisTick: { show: false },
            data: ['第一周', '第二周', '第三周', '第四周']
          }
        ],
        yAxis: [
          {
            name: '数量',
            type: 'value'
          }
        ],
        series: []
      },
      // 不同状态完成进度数量
      options2: {
        title: {
          text: `${this.year}年${this.month + 1}月不同状态任务完成数量占比统计`,
          top: 'bottom',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#555'
          }
        },
        legend: {
          data: ['正常完成', '超前完成', '滞后完成']
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#feb64d', '#5bc49f', '#fb6e6c', '#ffdc5c', '#ff9f7f', '#38a1da'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [],
            label: {
              formatter: '{b} \n占比({d}%)'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 表格筛选条件
      filterForm: {},
      // 表格数据请求
      request: body => {
        return api.getScheduleAnalyzeList({
          ...body,
          startDate: this.date.startOf('month').format('YYYY-MM-DD 00:00:00'),
          endDate: this.date.endOf('month').format('YYYY-MM-DD 23:59:59')
        })
      }
    }
  },
  computed: {
    date() {
      return moment().year(this.year).month(this.month)
    }
  },
  watch: {
    date() {
      this.options1.title.text = `${this.year}年${this.month + 1}月份进度分析柱状图`
      this.options2.title.text = `${this.year}年${this.month + 1}月不同状态任务完成数量占比统计`
      this.getChartData()
      this.$refs.table.pagination.page = 1
      this.refresh()
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {
    this.getChartData()
    this.refresh()
  },
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      this.$refs.table.refresh()
    },
    // 获取图表中的数据
    getChartData() {
      api
        .getPeriodAnalyze({
          cycleType: 0,
          start: this.date.startOf('month').format('YYYY-MM-DD 00:00:00'),
          end: this.date.endOf('month').format('YYYY-MM-DD 23:59:59')
        })
        .then(res => {
          let data = _.values(res.data)
          this.options1.xAxis[0].name = this.month + 1 + '月'
          this.options1.xAxis[0].data = ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周'].slice(
            0,
            data.length
          )
          this.options1.series = [
            {
              name: '正常完成数量',
              type: 'bar',
              data: _.map(data, 'normalFinishedNum')
            },
            {
              name: '超前完成数量',
              type: 'bar',
              data: _.map(data, 'advanceFinishedNum')
            },
            {
              name: '滞后完成数量',
              type: 'bar',
              data: _.map(data, 'delayFinishedNum')
            }
          ]
          this.options2.series[0].data = [
            { value: _.sumBy(data, 'normalFinishedNum'), name: '正常完成' },
            { value: _.sumBy(data, 'advanceFinishedNum'), name: '超前完成' },
            { value: _.sumBy(data, 'delayFinishedNum'), name: '滞后完成' }
          ]
        })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.chart-wrap {
  background-color: #fff;
  display: flex;
  padding: 20px;
  .echarts {
    height: 350px;
  }
}
.grid-wrap {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
}
div {
  /deep/ .exceed .vxe-cell {
    color: red;
  }
  /deep/ .ahead .vxe-cell {
    color: green;
  }
}
</style>
