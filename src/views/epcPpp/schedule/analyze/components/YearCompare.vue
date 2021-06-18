<template>
  <div class="year-compare-main">
    <div class="main-warp">
      <v-chart :options="options" />
      <vxe-table ref="table1" :data="data" size="mini">
        <vxe-table-column title="项目名称" field="name" width="120px" header-class-name="tilt-line">
          <div slot="header" class="table-header-split">
            <span>年度</span>
            <span>月份</span>
          </div>
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
  </div>
</template>

<script>
import api from '../../api'
export default {
  name: 'YearCompare',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      // 图表配置
      options: {
        title: {
          text: '进度完成数量分析折线图',
          top: 'bottom',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#555'
          }
        },
        grid: {
          left: '50px'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 'right',
          top: 'center',
          orient: 'vertical'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: true
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          splitLine: {
            show: false
          },
          type: 'value',
          name: '数量'
        },
        series: []
      },
      // 表格数据
      data: []
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
      return api
        .getYearCompareAnalyze({
          cycleType: 1,
          start: moment().startOf('year').format('YYYY-MM-DD 00:00:00'),
          end: moment().endOf('year').format('YYYY-MM-DD 23:59:59')
        })
        .then(res => {
          this.options.series = [
            {
              name: moment().year() + '年',
              type: 'line',
              stack: '总量',
              data: _.chain(res.data)
                .get(moment().year())
                .values()
                .map(item =>
                  _.chain(item)
                    .pick(['advanceFinishedNum', 'delayFinishedNum', 'normalFinishedNum'])
                    .values()
                    .sum()
                    .value()
                )
                .value()
            },
            {
              name: moment().year() - 1 + '年',
              type: 'line',
              stack: '总量',
              data: _.chain(res.data)
                .get(moment().year() - 1)
                .values()
                .map(item =>
                  _.chain(item)
                    .pick(['advanceFinishedNum', 'delayFinishedNum', 'normalFinishedNum'])
                    .values()
                    .sum()
                    .value()
                )
                .value()
            }
          ]
          this.data = [
            {
              name: moment().year() + '年',
              data: _.chain(res.data)
                .get(moment().year())
                .values()
                .map(item =>
                  _.chain(item)
                    .pick(['advanceFinishedNum', 'delayFinishedNum', 'normalFinishedNum'])
                    .values()
                    .sum()
                    .value()
                )
                .value()
            },
            {
              name: moment().year() - 1 + '年',
              data: _.chain(res.data)
                .get(moment().year() - 1)
                .values()
                .map(item =>
                  _.chain(item)
                    .pick(['advanceFinishedNum', 'delayFinishedNum', 'normalFinishedNum'])
                    .values()
                    .sum()
                    .value()
                )
                .value()
            }
          ]
          this.data[0].total = _.sum(this.data[0].data)
          this.data[1].total = _.sum(this.data[1].data)
          this.data.push({
            name: '同比增加',
            data: _.zipWith(this.data[0].data, this.data[1].data, (a, b) =>
              _.isNumber(a) && _.isNumber(b) ? a - b : '/'
            ),
            total: '/'
          })
        })
    },
    //年度分析表尾合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return '同比增加'
          } else {
            return data[0]?.[column.property] - data[1]?.[column.property]
          }
        })
      ]
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.year-compare-main {
  background-color: #fff;
  .main-warp {
    max-width: 1000px;
    padding: 0 30px;
  }
}
.echarts {
  width: 100%;
  margin-bottom: 30px;
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
