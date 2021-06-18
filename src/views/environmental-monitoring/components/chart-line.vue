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
        { date: '2020-02-14 07:00:00', temperature: 17, humidity: 20 },
        { date: '2020-02-14 08:00:00', temperature: 10, humidity: 30 },
        { date: '2020-02-14 09:00:00', temperature: 3, humidity: 35 },
        { date: '2020-02-14 10:00:00', temperature: 3, humidity: 40 },
        { date: '2020-02-14 11:00:00', temperature: 18, humidity: 50 },
        { date: '2020-02-14 12:00:00', temperature: 20, humidity: 70 },
        { date: '2020-02-14 13:00:00', temperature: 25, humidity: 40 },
        { date: '2020-02-14 14:00:00', temperature: 23, humidity: 20 },
        { date: '2020-02-14 15:00:00', temperature: 7, humidity: 10 },
        { date: '2020-02-14 16:00:00', temperature: 3, humidity: 40 },
        { date: '2020-02-14 17:00:00', temperature: 18, humidity: 50 },
        { date: '2020-02-14 18:00:00', temperature: 20, humidity: 70 }
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
        temperature: {
          alias: '温度 ℃',
          min: 0,
          nice: true
        },
        humidity: {
          alias: '湿度 %',
          nice: true
        },
        count: {
          alias: '次数'
        }
      })

      chart.axis('humidity', {
        grid: null,
        title: {}
      })
      chart.axis('temperature', {
        title: {}
      })

      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })

      chart.line().position('date*temperature').color('#4FAAEB').shape('smooth')
      chart.line().position('date*humidity').color('#9AD681').shape('smooth')
      chart.render()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
