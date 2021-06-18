<template>
  <table v-if="computedTableData.length" class="table-2">
    <tr v-for="(row, rowIndex) in computedTableData" :key="rowIndex">
      <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
    </tr>
  </table>
</template>

<script>
import padEndArray from '../../utils/padEndArray'

export default {
  name: 'EvaluationIndexTable',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    tableData: {
      type: Array,
      default() {
        return [
          /* ['1.1', '全投税前IRR', '6.60%'],
          ['1.2', '全投税后IRR', '5.43%'],
          ['1.3', '全投资静态投资回收期（年）', 12.12],
          ['1.4', '全投资动态投资回收期（年）', 17.31],
          ['2', '项目资本金投资财务指标'],
          ['2.1', '资本金税前IRR', '7.28%'],
          ['2.2', '资本金税后IRR', '5.65%'],
          ['2.3', '资本金投资静态投资回收期（年）', 12.81],
          ['2.4', '资本金投资动态投资回收期（年）	', 17.28],
          ['3', 'SPV净现金流量平衡情况'],
          ['3.1', '资金缺口（万元）', -890.8246394]*/
        ]
      }
    }
  },
  data() {
    // 这里存放数据
    return {}
  },
  computed: {
    computedTableData() {
      return padEndArray(this.tableData)
    }
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
    border: 1px solid #ccc;
    padding: 0 10px;
  }
}
.el-row {
  .el-col {
    margin-bottom: 15px;
  }
}
.table-2 {
  margin: 10px 0 20px;
}
</style>
