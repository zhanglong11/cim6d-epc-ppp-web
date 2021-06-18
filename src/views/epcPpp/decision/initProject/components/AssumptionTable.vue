<template>
  <table>
    <tr v-for="(row, rowIndex) in computedTableData" :key="rowIndex">
      <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'AssumptionTable',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    tableData: {
      type: Array,
      default() {
        return [
          /*['序号', '项目', '数据', '增值税税率', '进项税', '无税投资原'],
        ['1', '项目总投资', 11, 12, 13, 10000, null],
        ['1.1', '建筑工程', 11, 14, 13, null],
        ['1.2', '安装工程', 15, 12, 13, null],
        ['1.3', '设备及工具、器具购买', 15, 12, 13, null],
        ['1.4', '工程建设其他费', 15, 12, 13, null],
        ['1.5', '预备费', 15, 12, 13, null],
        ['1.6', '建设期利息', 15, 12, 13, null],
        ['2', '折现率', 15, 12, 13, null],
        ['3', '投资回报率', 15, 12, 13, null],
        ['4', '合理利润率', 15, 12, 13, null],
        ['5', '贷款利率', 15, 12, 13, null],
        ['6', '还款方式', 15, 12, 13, null],
        ['7', '企业所得税', 15, 12, 13, null],
        ['8', '增值税税率', 15, 12, 13, null],
        ['8.1', '建筑业增值税率', 15, 12, 13, null],
        ['8.2', '现代服务业增值税率', 15, 12, 13, null],
        ['8.3', '货物增值税率', 15, 12, 13, null],
        ['9', '城市维护建设税', 15, 12, 13, null],
        ['10', '教育费附加', 15, 12, 13, null],
        ['11', '地方教育附加', 15, 12, 13, null],
        ['12', '基准收益率', 15, 12, 13, null],
        ['13', '资本金比例', 15, 12, 13, null],
        ['14', '社会资本股权占比', 15, 12, 13, null],
        ['15', '政府出资代表股权占比', 15, 12, 13, null],
        ['16', '建设期', 15, 12, 13, null],
        ['17', '运营期', 15, 12, 13, null]*/
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
      if (this.tableData.length === 0) return []
      const toFix = val => (!isNaN(val) && !_.isNil(val) ? _.round(+val, 2) : val)
      /* eslint-disable*/
      const seq = ['1', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '2', '3', '4', '5', '6', '7',
        '8', '8.1', '8.2', '8.3', '9', '10', '11', '12', '13', '14', '15', '16', '17']
      /* eslint-enable*/
      return [['序号', '项目', '数据', '增值税税率', '进项税', '无税投资原']].concat(
        this.tableData.map(e => [
          seq.shift(),
          e.investorProjectName,
          toFix(e.data),
          toFix(e.rateOfValueTax),
          toFix(e.inputTax),
          toFix(e.taxFreeInvestment)
        ])
      )
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
    border: 1px solid #aaa;
    padding: 0 10px;
  }
  tr:nth-child(n + 9) {
    td:nth-child(n + 4) {
      border: 1px solid #ddd;
    }
  }
}
</style>
