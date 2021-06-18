<template>
  <div class="tree-roll" :style="`height: ${height}px`">
    <el-tree
      ref="treeRef"
      show-checkbox
      node-key="id"
      class="filter-tree"
      :data="treeData"
      :render-after-expand="false"
      :props="defaultProps"
      :default-checked-keys="defaultCheckedKeys"
      :filter-node-method="filterNode"
      :default-expand-all="!isFloor"
      :default-expanded-keys="[treeData[0].id]"
      @check="checkChange"
    >
      <span slot-scope="{ node }" :title="node.label" style="font-size: 13px">{{ node.label }}</span>
    </el-tree>
  </div>
</template>

<script>
import { bimApi } from '../api/bim-api'
import treeForEach from '@/utils/treeForEach'
import toTree from '@/utils/toTree'
import axios from '@/utils/axios'
export default {
  name: 'TreeData',
  props: {
    type: String,
    // 是否显示楼层
    isFloor: {
      type: Boolean,
      default: false
    },
    // 默认高度
    height: {
      type: Number,
      default: 560
    },
    // 是否默认选中第一个单体
    isSelectFirst: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 默认展开
      defaultCheckedKeys: [],
      selectMonomer: [] // 显示的单体
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  created() {
    this.getProjectTreeData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取BIM树
    async getProjectTreeData() {
      let res = await bimApi.getProjectTreeData(this.projectId)
      let datas = res.data
      let selectMonomer = []
      datas.map(e => {
        e.id = e.viewId || e.bimResourceId
        e.parent = e.bimResourcePid
        e.label = e.bimResourceName
        e.viewId = e.viewId || e.bimResourceId
        if (e.type === 3) {
          e.singleFlag = true
        } else {
          e.singleFlag = false
        }
      })
      let copy = toTree(datas, 'parent')

      treeForEach(copy, e => {
        if (e.type === 3) {
          let isCheckFirst = selectMonomer.length === 0 && this.isSelectFirst
          if (this.isFloor) {
            this.getAppendTreeData(e, e.id, isCheckFirst)
          }
          if (isCheckFirst) {
            selectMonomer.push(e)
            this.defaultCheckedKeys.push(e.id)
          }
        }
      })
      // console.log('获取BIM树', copy)
      this.formatBimArray(selectMonomer)
      this.treeData = copy
    },
    // 获取楼层和房建数据
    async getAppendTreeData(data, id, isCheck) {
      let res = null
      if (this.type === 'space') {
        res = await bimApi.getFloorTreeData(id)
        res.forEach(e => (e.isFloor = true))
      } else if (this.type === 'special') {
        res = await bimApi.getSpecialTreeData(id)
      } else {
        res = await bimApi.getProjectFeatureTreeData(id)
      }
      treeForEach(res, e => {
        e.label = e.name
        e.modelId = e.modelId || id
        if (e.type === 2) {
          e.isRoom = true
        }
        if (isCheck) {
          this.defaultCheckedKeys.push(e.id)
        }
      })
      // console.log('获取楼层和房建数据', res, isCheck, this.defaultCheckedKeys)
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys(this.defaultCheckedKeys)
      })

      this.$set(data, 'children', res)
    },
    // 处理bim数据
    formatBimArray(array, isChange = false, guidArray) {
      let selectMonomer = []
      array.map(e => {
        selectMonomer.push({
          id: e.bimResourceId,
          modelName: e.bimResourceName,
          viewId: e.viewId,
          modelUrl: `${location.origin}${axios.gis.defaults.baseURL}/noToken/basic/commonFile/get/fdht/bim_${e.viewId}/3d.svf`
        })
      })
      this.selectMonomer = selectMonomer
      if (isChange) {
        // 改变选择
        this.$emit('checkChange', { bimArray: this.selectMonomer, guidArray })
      } else {
        // 初始化
        this.$emit('bimInit', this.selectMonomer)
      }
    },
    // 选择单体
    checkChange(data, { checkedNodes, halfCheckedNodes }) {
      // console.log(111, checkedNodes, halfCheckedNodes)
      let list = []
      let guidList = []
      checkedNodes.map(e => {
        if (e.singleFlag) {
          list.push(e)
        }
        if (e.isFloor || e.isRoom) {
          guidList.push(...e.componentGuids)
        }
      })
      halfCheckedNodes.map(e => {
        if (e.singleFlag) {
          list.push(e)
        }
        if (e.isFloor || e.isRoom) {
          guidList.push(...e.componentGuids)
        }
      })
      // console.log('----333------', guidList, _.uniqBy(guidList))
      this.formatBimArray(list, true, _.uniqBy(guidList))
    }
  }
}
</script>

<style scoped lang="less">
@import url('~@/styles/common');
.el-tree {
  overflow: hidden;
}
.tree-roll {
  overflow-y: auto;
  .scrollbar;
}
</style>
