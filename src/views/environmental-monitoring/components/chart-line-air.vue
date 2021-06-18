<template>
  <div id="chartLine"></div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-28
 * @Last Modified by: gengweigang
 */
import { Chart } from '@antv/g2'
export default {
  components: {},
  data() {
    //这里存放数据
    return {}
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initChart()
  },
  //方法集合
  methods: {
    // 初始化图表
    initChart() {
      const data = [
        { date: '2020-02-14 07:00:00', AQI: 4, PM25: 7, PM10: 5 },
        { date: '2020-02-14 08:00:00', AQI: 5, PM25: 10, PM10: 4 },
        { date: '2020-02-14 09:00:00', AQI: 10, PM25: 15, PM10: 8 },
        { date: '2020-02-14 10:00:00', AQI: 15, PM25: 5, PM10: 12 },
        { date: '2020-02-14 11:00:00', AQI: 6, PM25: 7, PM10: 15 },
        { date: '2020-02-14 12:00:00', AQI: 12, PM25: 10, PM10: 25 },
        { date: '2020-02-14 13:00:00', AQI: 20, PM25: 15, PM10: 20 },
        { date: '2020-02-14 14:00:00', AQI: 25, PM25: 2, PM10: 10 },
        { date: '2020-02-14 15:00:00', AQI: 5, PM25: 20, PM10: 8 },
        { date: '2020-02-14 16:00:00', AQI: 10, PM25: 25, PM10: 20 },
        { date: '2020-02-14 17:00:00', AQI: 15, PM25: 32, PM10: 30 },
        { date: '2020-02-14 18:00:00', AQI: 13, PM25: 7, PM10: 25 }
      ]

      const chart = new Chart({
        container: 'chartLine',
        autoFit: true,
        height: 500
      })

      chart.data(data)
      chart.scale({
        date: {
          alias: '日期',
          type: 'category'
        },
        AQI: {
          nice: true
        },
        PM25: {
          nice: true
        },
        PM10: {
          nice: true
        }
      })

      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })

      chart.line().position('date*AQI').color('#4FAAEB').shape('smooth')

      chart.line().position('date*PM25').color('#9AD681').shape('smooth')

      chart.line().position('date*PM10').color('#FF9900').shape('smooth')

      chart.render()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
