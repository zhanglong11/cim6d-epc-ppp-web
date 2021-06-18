<template>
  <HotTable v-if="tableData.length" class="main-table" :data="tableData" :settings="hotSettings"></HotTable>
</template>

<script>
import { HotTable } from '@handsontable/vue'

export default {
  name: 'ProjectCalculationTable',
  // import引入的组件需要注入到对象中才能使用
  components: { HotTable },
  props: {
    detail: {
      type: Object,
      default() {
        return {
          step1: {
            constructionTime: 3,
            runningPeriod: 16
          }
        }
      }
    },
    tableData: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      default: 1240
    }
  },
  data() {
    // 这里存放数据
    return {
      hotSettings: {
        editor: false,
        rowHeaders: false,
        fixedColumnsLeft: 3,
        colHeaders: [
          '序号',
          '项目',
          '金额',
          ..._.range(1, this.detail.step1.constructionTime + this.detail.step1.runningPeriod + 1)
        ],
        licenseKey: 'non-commercial-and-evaluation',
        language: 'zh-cn',
        height: this.height
      }
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
</style>
<style lang="less">
.main-table .htCore {
  tr:nth-child(35),
  tr:nth-child(43),
  tr:nth-child(51),
  tr:nth-child(52) {
    font-weight: bold;
    td:first-child {
      color: #e70b0b;
    }
    td:nth-child(2) {
      color: #e70b0b;
    }
  }
  @list: 1, 2, 3, 4, 7, 10, 11, 13, 14, 15, 16, 22, 23, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45,
    46, 47, 48, 49, 50;
  each(@list,{
    tr:nth-child(@{value}){
      font-weight: bold;
    }

  });
}
</style>
