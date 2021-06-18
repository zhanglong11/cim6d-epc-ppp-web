<template>
  <div>
    <HotTable :class="'highlight-' + highlightYear" :data="tableData" :settings="hotSettings"></HotTable>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import 'handsontable/languages/zh-CN'

/**
 * 根据输入的year值，渲染一个对应单元格的表格进行填写
 */
export default {
  name: 'YearTable',
  // import引入的组件需要注入到对象中才能使用
  components: { HotTable },
  props: {
    // 总的年数量 建设期+维护期
    year: {
      default: 1,
      type: Number
    },
    // 高亮的年数量 建设期
    highlightYear: {
      default: null,
      type: Number
    },
    value: {
      required: true,
      type: Array
    },
    //是否可编辑
    edit: {
      default: false,
      type: Boolean
    }
  },
  data() {
    // 这里存放数据
    return {
      /*eslint-disable*/
      tableData: [
        /*[1,2,3,4,5,6,7,8,9],
        [],
        [10,11,12,13,14,15,16,17,18],
        [],*/
      ],
      /*eslint-enable*/
      hotSettings: {
        licenseKey: 'non-commercial-and-evaluation',
        language: 'zh-cn',
        height: () => {
          return this.tableData.length * 24
        },
        columns: new Array(9).fill('').map(() => ({
          type: 'numeric',
          readOnly: !this.edit
        })),
        cells: (row, column, prop) => {
          const cellProperties = {}
          if (row % 2 === 0) {
            cellProperties.readOnly = true
          }
          if (row === this.tableData.length - 1 && column > _.nth(this.tableData, -2).length - 1) {
            cellProperties.readOnly = true
          }
          if (row % 2 === 0 && (row / 2) * 9 + column < this.highlightYear) {
            cellProperties.className = 'highlight'
          }
          return cellProperties
        }
      }
    }
  },
  watch: {
    value: 'refresh'
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
      let tableData = []
      for (let i = 1; i <= this.year; i += 9) {
        const range = [i, this.year - i >= 8 ? i + 9 : this.year + 1]
        tableData.push(_.range(...range))
        tableData.push(_.slice(this.value, ...range))
      }
      this.tableData = tableData
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>
<style lang="less">
tr:nth-child(odd) .htDimmed {
  background-color: #f0f0f0 !important;
  text-align: center;
  &.highlight {
    background-color: #feed01 !important;
  }
}
</style>
