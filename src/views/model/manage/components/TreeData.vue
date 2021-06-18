<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-input v-model="filterText" placeholder="请输入" style="width: 120px; margin-right: 10px"> </el-input>
      <el-button type="primary" icon="el-icon-search" @click="$refs.tree.filter(filterText)">搜索</el-button>
      <el-button
        @click="
          () => {
            filterText = ''
            $refs.tree.filter('')
          }
        "
        >重置</el-button
      >
    </div>
    <!-- bug#1708 默认不打开树 申豪强 2020-04-20 -->
    <el-tree
      ref="tree"
      show-checkbox
      node-key="id"
      class="filter-tree"
      :data="treeData"
      :render-after-expand="false"
      :props="defaultProps"
      :default-checked-keys="defaultCheckedKeys"
      :filter-node-method="filterNode"
      @check="handleCheckChange"
    >
    </el-tree>
  </div>
</template>

<script>
import Api from '@/api/model/tree'
import treeForEach from '@/utils/treeForEach'
import axios from 'axios'
export default {
  name: 'TreeData',
  props: {
    type: String
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 默认展开
      defaultCheckedKeys: []
    }
  },
  created() {
    this.getProjectTreeData()
  },
  mounted() {},
  methods: {
    /*
     * @任务编号: 2522 || 树与模型交互:左侧树获取选中数据，上下树取交集显示
     * @开发人员:申豪强
     * @日期:2020-03-20
     * @任务类型: 新代码
     */
    async getAppendTreeData(data, id) {
      let res = null
      if (this.type === 'space') {
        res = await Api.getFloorTreeData(id)
        res.forEach(e => (e.isFloor = true))
      } else if (this.type === 'special') {
        res = await Api.getSpecialTreeData(id)
      } else {
        res = await Api.getProjectFeatureTreeData(id)
      }
      treeForEach(res, e => {
        e.label = e.name
        e.modelId = e.modelId || id
      })
      this.$set(data, 'children', res)
    },
    // bug#1580 当bimResourceId没有值的时候，不应该再请求 申豪强 2020-04-14
    handleNodeClick(data, node) {
      if (!data.bimResourceId) return
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.getAppendTreeData(data, data.bimResourceId)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取
    async getProjectTreeData() {
      let res = await Api.getProjectTreeData(this.projectId)

      let copy = JSON.parse(JSON.stringify(res.data))
      // treeForEach(copy, e => {
      //   this.defaultCheckedKeys.push(e.id)
      // })
      treeForEach(copy, e => {
        e.id = e.bimResourceId
        e.label = e.bimResourceName
        if (e.type === 3) {
          e.singleFlag = true
          // bug#1708 模型树默认进来加载全部 申豪强 2020-04-17
          // this.$set(e, 'children', [])
          this.getAppendTreeData(e, e.bimResourceId)
        } else {
          e.singleFlag = false
        }
      })
      this.treeData = copy
    },
    handleCheckChange(data, { checkedNodes, halfCheckedNodes }) {
      this.$emit('handleCheckChange', checkedNodes.concat(halfCheckedNodes))
    }
  }
}
</script>

<style scoped lang="less"></style>
