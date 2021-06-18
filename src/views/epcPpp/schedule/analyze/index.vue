<template>
  <div class="container no-padding">
    <div class="main-wrap">
      <el-tree
        :data="treeData"
        :expand-on-click-node="false"
        node-key="key"
        :default-expanded-keys="[moment().year() + '年']"
        :current-node-key="moment().year() + '年' + (moment().month() + 1) + '月'"
        highlight-current
        @node-click="handleNodeClick"
      ></el-tree>
      <div class="main">
        <component :is="viewMode" :year="activeNode.year" :month="activeNode.month"></component>
      </div>
    </div>
  </div>
</template>

<script>
import Year from './components/Year'
import Month from './components/Month'
import YearCompare from './components/YearCompare'

export default {
  name: 'ScheduleAnalyze',
  // import引入的组件需要注入到对象中才能使用
  components: { Year, Month, YearCompare },
  data() {
    // 这里存放数据
    return {
      // 左侧树的数据
      treeData: [
        {
          label: '进度分析',
          key: 'root',
          children: [
            {
              label: '年度、月度分析',
              key: 'root-2',
              children: [
                ...new Array(10).fill('').map((item, index) => ({
                  label: moment().year() - index + '年',
                  year: moment().year() - index,
                  type: 2,
                  key: moment().year() - index + '年',
                  children: new Array(12).fill('').map((item, index2) => ({
                    label: index2 + 1 + '月',
                    type: 3,
                    year: moment().year() - index,
                    month: index2,
                    key: moment().year() - index + '年' + (index2 + 1 + '月')
                  }))
                }))
              ]
            }
          ]
        }
      ],
      // Year Month YearCompare
      viewMode: 'Month',
      activeNode: {
        year: moment().year(),
        month: moment().month()
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新左侧树数据
    refresh() {
      this.$refs.table.refresh()
    },
    // 处理树节点点击
    handleNodeClick(node) {
      const hash = {
        1: 'YearCompare',
        2: 'Year',
        3: 'Month'
      }
      if (hash[node.type]) {
        this.viewMode = hash[node.type]
        this.activeNode = node
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.main-wrap {
  display: flex;
}
.el-tree {
  width: 240px;
  margin-right: 15px;
  padding: 10px;
  flex-shrink: 0;
  /deep/ .is-current > .el-tree-node__content {
    background-color: @main-color;
    color: #fff;
  }
}
.main {
  flex: 1;
  overflow: hidden;
}
</style>
