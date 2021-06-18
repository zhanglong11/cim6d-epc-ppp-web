<template>
  <div class="container no-padding fixedHeight">
    <div class="innerContainer white">
      <div class="left">
        <el-tree :data="treeData" node-key="id" default-expand-all @node-click="handleClick"> </el-tree>
      </div>
      <div v-if="selectTreeNode" class="right">
        <div class="chartContainer">
          <div class="leftChart">
            <template v-if="selectTreeNode.type === 0">
              <div class="chart widthChart">
                <v-chart :options="yearsOptions" width="1000" />
              </div>
              <p class="alignCenter">质量问题对比分析折线图</p>
            </template>
            <template v-if="selectTreeNode.type === 1">
              <div class="chart">
                <v-chart :key="'charts' + selectTreeNode.type" :options="yearOptions" />
              </div>
              <p class="alignCenter">{{ selectTreeNode.label }}质量问题分析柱状图</p>
            </template>
            <template v-if="selectTreeNode.type === 2">
              <div class="chart">
                <v-chart :key="'charts' + selectTreeNode.type" :options="monthOptions" />
              </div>
              <p class="alignCenter">{{ selectTreeNode.label }}质量问题分析柱状图</p>
            </template>
          </div>
          <div v-if="[1, 2].includes(selectTreeNode.type)" class="rightCharts">
            <div class="chart">
              <v-chart :key="'charts' + selectTreeNode.type" :options="typeOptions" class="aa" />
            </div>
            <p class="alignCenter">{{ selectTreeNode.label }}不同种类的质量问题数量占比统计</p>
          </div>
        </div>
        <div class="tableContainer">
          <template v-if="selectTreeNode.type === 0">
            <div class="table">
              <vxe-table key="table1" :data="tableData" auto-resize show-footer :footer-method="footerMethod">
                <vxe-table-column field="year" title="序号" width="120">
                  <div slot="header" class="firstTh"><span>年度</span><span>月份</span></div>
                </vxe-table-column>
                <vxe-table-column field="january" title="1月" min-width="80"></vxe-table-column>
                <vxe-table-column field="february" title="2月" min-width="80"></vxe-table-column>
                <vxe-table-column field="march" title="3月" min-width="80"></vxe-table-column>
                <vxe-table-column field="april" title="4月" min-width="80"></vxe-table-column>
                <vxe-table-column field="may" title="5月" min-width="80"></vxe-table-column>
                <vxe-table-column field="june" title="6月" min-width="80"></vxe-table-column>
                <vxe-table-column field="july" title="7月" min-width="80"></vxe-table-column>
                <vxe-table-column field="august" title="8月" min-width="80"></vxe-table-column>
                <vxe-table-column field="september" title="9月" min-width="80"></vxe-table-column>
                <vxe-table-column field="october" title="10月" min-width="80"></vxe-table-column>
                <vxe-table-column field="november" title="11月" min-width="80"></vxe-table-column>
                <vxe-table-column field="december" title="12月" min-width="80"></vxe-table-column>
                <vxe-table-column field="total" title="总计" min-width="80"></vxe-table-column>
              </vxe-table>
            </div>
            <p class="alignCenter">质量问题数据对比分析表</p>
          </template>
          <template v-if="selectTreeNode.type === 1">
            <div class="table">
              <vxe-table key="table2" :data="tableDataYear" auto-resize show-footer :footer-method="footerMethodYear">
                <vxe-table-column field="year" title="序号" width="120">
                  <div slot="header" class="firstTh"><span>项目名称</span><span>月份</span></div>
                  <template #default="{ $rowIndex }">
                    {{ ['质量问题', '按期整改', '未按期整改'][$rowIndex] }}
                  </template>
                </vxe-table-column>
                <vxe-table-column field="january" title="1月" min-width="80"></vxe-table-column>
                <vxe-table-column field="february" title="2月" min-width="80"></vxe-table-column>
                <vxe-table-column field="march" title="3月" min-width="80"></vxe-table-column>
                <vxe-table-column field="april" title="4月" min-width="80"></vxe-table-column>
                <vxe-table-column field="may" title="5月" min-width="80"></vxe-table-column>
                <vxe-table-column field="june" title="6月" min-width="80"></vxe-table-column>
                <vxe-table-column field="july" title="7月" min-width="80"></vxe-table-column>
                <vxe-table-column field="august" title="8月" min-width="80"></vxe-table-column>
                <vxe-table-column field="september" title="9月" min-width="80"></vxe-table-column>
                <vxe-table-column field="october" title="10月" min-width="80"></vxe-table-column>
                <vxe-table-column field="november" title="11月" min-width="80"></vxe-table-column>
                <vxe-table-column field="december" title="12月" min-width="80"></vxe-table-column>
                <vxe-table-column field="total" title="总计" min-width="80"></vxe-table-column>
              </vxe-table>
            </div>
            <p class="alignCenter">{{ selectTreeNode.label }}质量问题数据对比分析表</p>
          </template>
          <template v-if="selectTreeNode.type === 2">
            <div class="table">
              <el-form ref="form" inline :model="filterForm">
                <el-form-item>
                  <el-input v-model="filterForm.personName" style="width: 200px" placeholder="发现人/取消人" />
                </el-form-item>
                <el-form-item label="是否按期整改">
                  <el-select v-model="filterForm.isPunctualityRectification" clearable placeholder="是否按期整改">
                    <el-option :value="1" label="是"> </el-option>
                    <el-option :value="2" label="否"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工程类型">
                  <el-select v-model="filterForm.engineeringCategory" clearable placeholder="工程类型">
                    <el-option
                      v-for="item in engineeringTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="问题类型">
                  <el-select v-model="filterForm.issueType" clearable placeholder="问题类型">
                    <el-option
                      v-for="item in qualityQuestionTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="filterForm.status" clearable placeholder="请选择状态">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
                  </el-button-group>
                </el-form-item>
              </el-form>
              <Grid ref="table" :request="request" :filter-form.sync="filterForm" autoSearch>
                <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
                <vxe-table-column field="locationName" title="问题部位" width="200"></vxe-table-column>
                <vxe-table-column
                  field="engineeringCategory"
                  title="工程类别"
                  width="120"
                  :formatter="({ cellValue }) => $getLabel(engineeringTypeList, cellValue)"
                >
                </vxe-table-column>
                <vxe-table-column field="issueType" title="问题类型" width="200">
                  <template #default="{ row }">
                    {{ $getLabel($getArgList(row.engineeringCategory + '_qualityIssueType'), row.issueType) }}
                  </template>
                </vxe-table-column>
                <vxe-table-column field="description" title="问题描述" min-width="150"></vxe-table-column>
                <vxe-table-column field="discoveryPersonName" title="发现人" width="100"></vxe-table-column>
                <vxe-table-column field="discoveryDate" title="发现日期" width="120" formatter="ymd"></vxe-table-column>
                <vxe-table-column field="cancelPersonName" title="取消人" width="100"></vxe-table-column>
                <vxe-table-column field="cancelDate" title="取消日期" width="120" formatter="ymd"></vxe-table-column>
                <vxe-table-column
                  field="rectificationDate"
                  title="整改期限"
                  width="120"
                  formatter="ymd"
                ></vxe-table-column>
                <vxe-table-column field="isPunctualityRectification" title="是否按期整改" width="120">
                  <template #default="{ row }">
                    {{ row.isPunctualityRectification === 1 ? '是' : '否' }}
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="status"
                  title="状态"
                  width="100"
                  :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
                ></vxe-table-column>
              </Grid>
            </div>
            <p class="alignCenter">{{ selectTreeNode.label }}质量问题数据对比分析表</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from './api'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import statusList from './lib/statusList'
export default {
  name: 'QualityQuestionAnalysis',
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      statusList,
      treeData: [],
      selectTreeNode: null,
      tableData: [],
      yearsOptions: {},
      yearOptions: {},
      typeOptions: {},
      tableDataYear: [], //选择年度的表格数据
      monthOptions: {}, //选择月份是的图标数据
      filterForm: { issueType: '', beginDate: null, endDate: null, projectId: localStorage.getItem('projectId') },
      request(body) {
        return Api.getList(body)
      }
    }
  },
  computed: {
    //工程类型
    engineeringTypeList() {
      return this.$getArgList('epcPPPEngineeringType') || []
    },
    //问题类型
    qualityQuestionTypeList() {
      return this.$getArgList(this.filterForm.engineeringCategory + '_qualityIssueType')
    }
  },
  watch: {
    selectTreeNode: {
      deep: true,
      handler(val) {
        //获取一年的数据
        if (val.type === 1) {
          this.getDataByYear()
          this.getIssueTypeByYear()
        }
        if (val.type === 2) {
          this.getDataByMonth()
          this.getIssueTypeByMonth()
          this.filterForm = {
            ...this.filterForm,
            beginDate: moment(val.value.split('/').join('-')).startOf('month').format('YYYY-MM-DD 00:00:00'),
            endDate: moment(val.value.split('/').join('-')).endOf('month').format('YYYY-MM-DD 23:59:59')
          }
        }
      }
    },
    'filterForm.engineeringCategory'(val) {
      this.filterForm.issueType = ''
    }
  },
  created() {
    this.getTreeData()
    this.getYearContrast()
  },
  mounted() {},
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    //获取树形数据
    async getTreeData() {
      //type 1:年,2月, 0:年度分析
      let res = await Api.getYear()
      let year =
        (res.data &&
          res.data.map(item => {
            return {
              label: item.year + '年',
              value: item.year,
              type: 1
            }
          })) ||
        []
      let monthArr = []
      for (let i = 0; i < year.length; i++) {
        let res = await Api.getMonth({ year: year[i].value })
        let init =
          res.data &&
          res.data.map(j => {
            return {
              label: year[i].label + j.month + '月',
              value: year[i].value + '/' + j.month,
              type: 2
            }
          })
        monthArr = [...monthArr, ...init]
      }
      this.treeData = [
        {
          value: 'root',
          label: '质量问题分析',
          children: [
            /*{
              value: 'years',
              label: '年度对比分析',
              type: 0
            },*/
            {
              value: 'year',
              label: '年度分析',
              children: year
            },
            {
              value: 'month',
              label: '月度分析',
              children: monthArr
            }
          ]
        }
      ]
    },
    //获取年度对比分析
    async getYearContrast() {
      let res = await Api.getYearContrast()
      let thisYear = res.data.thisYear || []
      let lastYear = res.data.lastYear || []
      let thisYearInit = {
        year: thisYear?.[0]?.year || moment().format('YYYY'),
        january: _.find(thisYear, { month: '1' })?.data || 0,
        february: _.find(thisYear, { month: '2' })?.data || 0,
        march: _.find(thisYear, { month: '3' })?.data || 0,
        april: _.find(thisYear, { month: '4' })?.data || 0,
        may: _.find(thisYear, { month: '5' })?.data || 0,
        june: _.find(thisYear, { month: '6' })?.data || 0,
        july: _.find(thisYear, { month: '7' })?.data || 0,
        august: _.find(thisYear, { month: '8' })?.data || 0,
        september: _.find(thisYear, { month: '9' })?.data || 0,
        october: _.find(thisYear, { month: '10' })?.data || 0,
        november: _.find(thisYear, { month: '11' })?.data || 0,
        december: _.find(thisYear, { month: '12' })?.data || 0
      }
      let thisTotal = 0
      Object.keys(thisYearInit).map(item => {
        if (item !== 'year') {
          thisTotal += thisYearInit[item] - 0
        }
      })
      thisYearInit.total = thisTotal
      let lastYearInit = {
        year: lastYear?.[0]?.year || moment().format('YYYY') - 1,
        january: _.find(lastYear, { month: '1' })?.data || 0,
        february: _.find(lastYear, { month: '2' })?.data || 0,
        march: _.find(lastYear, { month: '3' })?.data || 0,
        april: _.find(lastYear, { month: '4' })?.data || 0,
        may: _.find(lastYear, { month: '5' })?.data || 0,
        june: _.find(lastYear, { month: '6' })?.data || 0,
        july: _.find(lastYear, { month: '7' })?.data || 0,
        august: _.find(lastYear, { month: '8' })?.data || 0,
        september: _.find(lastYear, { month: '9' })?.data || 0,
        october: _.find(lastYear, { month: '10' })?.data || 0,
        november: _.find(lastYear, { month: '11' })?.data || 0,
        december: _.find(lastYear, { month: '12' })?.data || 0
      }
      let lastTotal = 0
      Object.keys(lastYearInit).map(item => {
        if (item !== 'year') {
          lastTotal += lastYearInit[item] - 0
        }
      })
      lastYearInit.total = lastTotal
      this.tableData = [thisYearInit, lastYearInit]
      let thisYearData = Object.values(thisYearInit).splice(1)
      let thisYearLabel = Object.values(thisYearInit).splice(0, 1)
      let lastYearData = Object.values(lastYearInit).splice(1)
      let lastYearLabel = Object.values(lastYearInit).splice(0, 1)
      this.yearsOptions = {
        title: {
          text: '数量'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [lastYearLabel[0], thisYearLabel[0]]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            name: lastYearLabel[0],
            type: 'line',
            stack: '总量',
            data: lastYearData
          },
          {
            name: thisYearLabel[0],
            type: 'line',
            stack: '总量',
            data: thisYearData
          }
        ]
      }
    },
    //年度分析表尾合计
    footerMethod({ columns, data }) {
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return '同比增加'
          } else {
            return data[0]?.[column.property] - data[1]?.[column.property]
          }
        })
      ]
      return footerData
    },
    //点击节点
    handleClick(data, node) {
      this.selectTreeNode = data
      this.selectTreeId = data.value
    },
    //根据年获取质量问题分析
    async getDataByYear() {
      let res = await Api.getYearAnalysis({ year: this.selectTreeNode.value })
      let obj = {
        1: [],
        2: [],
        3: []
      }
      res.data &&
        res.data.map(item => {
          obj[item.projectType] = [
            item.january || 0,
            item.february || 0,
            item.march || 0,
            item.april || 0,
            item.may || 0,
            item.june || 0,
            item.july || 0,
            item.august || 0,
            item.september || 0,
            item.october || 0,
            item.november || 0,
            item.december || 0
          ]
        })
      this.yearOptions = {
        color: ['#ffff00', '#66ff00', '#ff0000'],
        title: {
          text: '数量'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['质量问题', '按期整改', '未按期整改']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            name: '质量问题',
            type: 'bar',
            barGap: '30%',
            barWidth: 7,
            data: obj[1]
          },
          {
            name: '按期整改',
            type: 'bar',
            barWidth: 7,
            data: obj[2]
          },
          {
            name: '未按期整改',
            type: 'bar',
            barWidth: 7,
            data: obj[3]
          }
        ]
      }
      this.tableDataYear = [
        { ...(_.find(res.data, { projectType: 1 }) || []), total: _.sum(obj[1]) },
        { ...(_.find(res.data, { projectType: 2 }) || []), total: _.sum(obj[2]) },
        { ...(_.find(res.data, { projectType: 3 }) || []), total: _.sum(obj[3]) }
      ]
    },
    //根据年获取质量问题类型
    async getIssueTypeByYear() {
      let res = await Api.getIssueTypeByYear({ year: this.selectTreeNode.value })
      let labelArr =
        res.data && res.data.map(item => this.$getLabel(this.engineeringTypeList, item.engineeringCategory))
      let valueArr =
        res.data &&
        res.data.map(item => {
          return {
            value: item.count,
            name: this.$getLabel(this.engineeringTypeList, item.engineeringCategory)
          }
        })
      this.typeOptions = {
        title: {
          text: '质量问题类别',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: labelArr
        },
        series: [
          {
            name: '类型',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: valueArr,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    //选择每个年度分析表尾合计
    footerMethodYear({ columns, data }) {
      let arr = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
      ]
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return '环比增加'
          } else {
            if (_columnIndex === 1 || column.property === 'total') {
              return '/'
            } else {
              return data[0]?.[column.property] - data[0]?.[arr[arr.indexOf(column.property) - 1]]
            }
          }
        })
      ]
      return footerData
    },
    //根据月份获取质量问题分析
    async getDataByMonth() {
      let res = await Api.getMonthAnalysis({
        year: this.selectTreeNode.value.split('/')[0],
        month: this.selectTreeNode.value.split('/')[1]
      })
      let obj = {
        0: [],
        1: []
      }
      res.data &&
        res.data.map(item => {
          obj[item.rectify] = [
            item.oneWeek || 0,
            item.twoWeek || 0,
            item.threeWeek || 0,
            item.fourWeek || 0,
            item.fiveWeek || 0,
            item.sixWeek || 0
          ]
        })
      this.monthOptions = {
        color: ['#66ff00', '#ff0000'],
        title: {
          text: '数量'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['按期整改', '未按期整改']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          data: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周']
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            name: '按期整改',
            type: 'bar',
            barWidth: 10,
            data: obj['1']
          },
          {
            name: '未按期整改',
            type: 'bar',
            barWidth: 10,
            data: obj['0']
          }
        ]
      }
    },
    //根据月份获取质量问题类型
    async getIssueTypeByMonth() {
      let res = await Api.getIssueTypeByYear({
        year: this.selectTreeNode.value.split('/')[0],
        month: this.selectTreeNode.value.split('/')[1]
      })
      let labelArr =
        res.data && res.data.map(item => this.$getLabel(this.engineeringTypeList, item.engineeringCategory))
      let valueArr =
        res.data &&
        res.data.map(item => {
          return {
            value: item.count,
            name: this.$getLabel(this.engineeringTypeList, item.engineeringCategory)
          }
        })
      this.typeOptions = {
        title: {
          text: '质量问题类别',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: labelArr
        },
        series: [
          {
            name: '类型',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: valueArr,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  }
}
</script>
<style lang="less" scoped>
.innerContainer {
  display: flex;
  .left {
    width: 300px;
    overflow: auto;
  }
  .right {
    overflow: auto;
    flex: 1;
    padding: 10px;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    .chart {
      width: 600px;
      &.widthChart {
        width: 1000px;
      }
    }
    .chartContainer {
      //height: 500px;
      display: flex;
      .leftChart {
        flex: 1;
      }
      .rightCharts {
        max-width: 600px;
        .aa {
          width: 100% !important;
        }
      }
      p {
        height: 40px;
      }
    }
    .tableContainer {
      margin-top: 20px;
      flex: 1;
      .table {
        min-height: 100px;
        .firstTh {
          position: relative;
          height: 25px;
          &:after {
            content: '';
            position: absolute;
            display: block;
            background-color: #c8c8c8;
            height: 150px;
            width: 1px;
            top: 0;
            -webkit-transform: rotateY(-90deg);
            transform: rotate(-252deg) translate(-75px, -25px);
          }
          span {
            &:first-child {
              position: absolute;
              bottom: -7px;
              left: 0px;
            }
            &:last-child {
              position: absolute;
              top: -7px;
              right: 0px;
            }
          }
        }
      }
      p {
        height: 40px;
      }
    }
  }
}
/deep/ .el-tree {
  .el-tree-node {
    &.is-current {
      & > .el-tree-node__content {
        background-color: #00a6ff !important;
      }
    }
  }
}
.alignCenter {
  text-align: center;
}
</style>
