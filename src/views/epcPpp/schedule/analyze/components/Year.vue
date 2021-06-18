<template>
  <div class="year-main">
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <v-chart :options="options1"></v-chart>
          <vxe-table ref="table1" :data="data1" size="mini">
            <vxe-table-column field="name" width="120px">
              <template slot="header">{{ year }}年</template>
            </vxe-table-column>
            <vxe-table-column title="1月" field="data[0]"></vxe-table-column>
            <vxe-table-column title="2月" field="data[1]"></vxe-table-column>
            <vxe-table-column title="3月" field="data[2]"></vxe-table-column>
            <vxe-table-column title="4月" field="data[3]"></vxe-table-column>
            <vxe-table-column title="5月" field="data[4]"></vxe-table-column>
            <vxe-table-column title="6月" field="data[5]"></vxe-table-column>
            <vxe-table-column title="7月" field="data[6]"></vxe-table-column>
            <vxe-table-column title="8月" field="data[7]"></vxe-table-column>
            <vxe-table-column title="9月" field="data[8]"></vxe-table-column>
            <vxe-table-column title="10月" field="data[9]"></vxe-table-column>
            <vxe-table-column title="11月" field="data[10]"></vxe-table-column>
            <vxe-table-column title="12月" field="data[11]"></vxe-table-column>
            <vxe-table-column title="总计" field="total"></vxe-table-column>
          </vxe-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <v-chart :options="options2"></v-chart>
          <vxe-table ref="table2" :data="data2" size="mini" :span-method="colspanMethod">
            <vxe-table-column field="companyName" :show-overflow="false"></vxe-table-column>
            <vxe-table-column field="name" width="120px">
              <template slot="header">{{ year }}年</template>
            </vxe-table-column>
            <vxe-table-column title="1月" field="data[0]"></vxe-table-column>
            <vxe-table-column title="2月" field="data[1]"></vxe-table-column>
            <vxe-table-column title="3月" field="data[2]"></vxe-table-column>
            <vxe-table-column title="4月" field="data[3]"></vxe-table-column>
            <vxe-table-column title="5月" field="data[4]"></vxe-table-column>
            <vxe-table-column title="6月" field="data[5]"></vxe-table-column>
            <vxe-table-column title="7月" field="data[6]"></vxe-table-column>
            <vxe-table-column title="8月" field="data[7]"></vxe-table-column>
            <vxe-table-column title="9月" field="data[8]"></vxe-table-column>
            <vxe-table-column title="10月" field="data[9]"></vxe-table-column>
            <vxe-table-column title="11月" field="data[10]"></vxe-table-column>
            <vxe-table-column title="12月" field="data[11]"></vxe-table-column>
            <vxe-table-column title="总计" field="total"></vxe-table-column>
          </vxe-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../../api'

export default {
  name: 'Year',
  // import引入的组件需要注入到对象中才能使用
  components: {},
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
          text: moment().year() + '年度分析柱状图',
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
          data: ['正常完成数量', '超前完成数量', '滞后延期数量']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
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
      // 不同单位完成进度数量
      options2: {
        title: {
          text: moment().year() + '年不同单位完成进度数量占比统计',
          top: 'bottom',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#555'
          }
        },
        legend: {
          data: ['正常完成', '超前完成', '滞后延期']
        },
        xAxis: [
          {
            name: '单位名称',
            type: 'category',
            axisTick: { show: false },
            data: []
          }
        ],
        yAxis: [
          {
            name: '数量',
            type: 'value'
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        color: ['#feb64d', '#5bc49f', '#fb6e6c', '#ffdc5c', '#ff9f7f', '#38a1da'],
        series: []
      },
      // 年进度总数据对比分析表
      data1: [],
      // 年各单位完成情况分析表
      data2: []
    }
  },
  watch: {
    year() {
      this.options1.title.text = this.year + `年度进度分析柱状图`
      this.options2.title.text = this.year + `年不同单位完成进度数量占比统计`
      this.refresh()
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      api
        .getPeriodAnalyze({
          cycleType: 1,
          start: moment().year(this.year).startOf('year').format('YYYY-MM-DD 00:00:00'),
          end: moment().year(this.year).endOf('year').format('YYYY-MM-DD 23:59:59')
        })
        .then(res => {
          let arr = []
          for (let i = 1; i < 13; i++) {
            arr.push(res.data[i])
          }
          this.data1 = [
            {
              name: '正常完成数量',
              data: _.map(arr, 'normalFinishedNum'),
              total: _.sumBy(arr, 'normalFinishedNum')
            },
            {
              name: '超前完成数量',
              data: _.map(arr, 'advanceFinishedNum'),
              total: _.sumBy(arr, 'advanceFinishedNum')
            },
            {
              name: '超前 (天)',
              data: _.map(arr, 'advanceDayNum'),
              total: _.sumBy(arr, 'advanceDayNum')
            },
            {
              name: '滞后延期数量',
              data: _.map(arr, 'delayFinishedNum'),
              total: _.sumBy(arr, 'delayFinishedNum')
            },
            {
              name: '滞后 (天)',
              data: _.map(arr, 'delayDayNum'),
              total: _.sumBy(arr, 'delayDayNum')
            }
          ]
          this.options1.xAxis[0].name = this.year + '年'
          this.options1.series = [
            {
              name: '正常完成数量',
              type: 'bar',
              data: _.map(arr, 'normalFinishedNum')
            },
            {
              name: '超前完成数量',
              type: 'bar',
              data: _.map(arr, 'advanceFinishedNum')
            },
            {
              name: '滞后延期数量',
              type: 'bar',
              data: _.map(arr, 'delayFinishedNum')
            }
          ]
        })
      api
        .getCompanyPeriodAnalyze({
          cycleType: 1,
          start: moment().year(this.year).startOf('year').format('YYYY-MM-DD 00:00:00'),
          end: moment().year(this.year).endOf('year').format('YYYY-MM-DD 23:59:59')
        })
        .then(res => {
          let prettyDataHash = _.mapValues(res.data, (v, k) => {
            let arr = []
            for (let i = 1; i < 13; i++) {
              arr.push(v[i])
            }
            return [
              {
                companyName: k,
                name: '正常完成数量',
                data: _.map(arr, 'normalFinishedNum'),
                total: _.sumBy(arr, 'normalFinishedNum')
              },
              {
                companyName: k,
                name: '超前完成数量',
                data: _.map(arr, 'advanceFinishedNum'),
                total: _.sumBy(arr, 'advanceFinishedNum')
              },
              {
                name: '超前 (天)',
                data: _.map(arr, 'advanceDayNum'),
                total: _.sumBy(arr, 'advanceDayNum')
              },
              {
                companyName: k,
                name: '滞后延期数量',
                data: _.map(arr, 'delayFinishedNum'),
                total: _.sumBy(arr, 'delayFinishedNum')
              },
              {
                name: '滞后 (天)',
                data: _.map(arr, 'delayDayNum'),
                total: _.sumBy(arr, 'delayDayNum')
              }
            ]
          })
          let prettyDataArray = _.values(prettyDataHash)
          this.data2 = _.flatten(prettyDataArray)
          this.options2.xAxis[0].data = _.map(prettyDataArray, '0.companyName')
          this.options2.series = [
            {
              name: '正常完成',
              type: 'bar',
              data: _.map(prettyDataArray, '0.total')
            },
            {
              name: '超前完成',
              type: 'bar',
              data: _.map(prettyDataArray, '1.total')
            },
            {
              name: '滞后延期',
              type: 'bar',
              data: _.map(prettyDataArray, '3.total')
            }
          ]
        })
    },
    // 单元格合并方法
    colspanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 5 === 0) {
          return { rowspan: 5, colspan: 1 }
        } else {
          return {
            rowspan: 0,
            colspan: 1
          }
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.el-row {
  .el-col {
    > div {
      padding: 15px;
      background-color: #fff;
      display: flex;
      align-items: center;
      flex-direction: column;
      .vxe-table {
        margin-top: 30px;
        width: 100%;
      }
    }
  }
}
.echarts {
  width: 100%;
}
.table-header-split {
  height: 35px;
  width: 95px;
  position: relative;
  span {
    &:first-child {
      position: absolute;
      bottom: -2px;
      left: 0;
    }
    &:last-child {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
<style>
.tilt-line:after {
  width: 100%;
  height: 100%;
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='47'><path d='M 0 0 l 120 47' stroke='rgb(200, 200, 200)' stroke-width='1px'></path><rect fill='url(%23gradient)' x='0' y='0' width='100%' height='100%'/></svg>")
    no-repeat center;
}
</style>
