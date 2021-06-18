<template>
  <table>
    <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
      <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'TotalInvestmentRecalculationData',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    // 这里存放数据
    return {}
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
table {
  td {
    border: 1px solid #aaa;
    padding: 0 10px;
  }
}
</style>
