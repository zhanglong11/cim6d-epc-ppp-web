<template>
  <el-dialog
    width="400px"
    :modal="true"
    top="10vh"
    title="请选择"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="treeView">
      <el-input v-model="filterText" placeholder="请输入" style="width: 180px; margin-right: 10px"> </el-input>
      <el-button type="primary" icon="el-icon-search" @click="$refs.tree.filter(filterText)">搜索</el-button>
      <el-button
        icon="el-icon-refresh-left"
        @click="
          () => {
            filterText = ''
            $refs.tree.filter('')
          }
        "
        >重置</el-button
      >
    </div>
    <el-tree
      ref="tree"
      class="filter-tree"
      node-key="id"
      :expand-on-click-node="false"
      :check-on-click-node="true"
      show-checkbox
      default-expand-all
      :data="treeData"
      :props="defaultProps"
      check-strictly
      :filter-node-method="filterNode"
      @check-change="checkChange"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '@/views/measureQuantity/api/measure'
import { toTreeData } from '@/utils/treeData'
export default {
  name: 'SelectTreeMonomer',
  props: {
    visible: {},
    targetType: {
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      uniqueValue: '',
      projectId: localStorage.getItem('projectId'),
      checkName: null,
      checkId: null,
      pid: null
    }
  },
  watch: {
    targetType: function (val) {
      this.refresh()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      console.log(this.targetType)
      // let res = await api.tree({})
      // this.treeData = toTree(res.data)
      this.getStandardLibraryList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    /*规范、测量项列表*/
    async getStandardLibraryList() {
      let res = await Api.getStandardLibraryList(this.projectId)
      this.treeData = toTreeData(res.data, 'id', 'pid', 'name', 'code')
      console.log(this.treeData)
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      // console.log('ids', this.uniqueValue[0])
      // console.log('ids', this.checkId)
      this.$emit('getTarget', { name: this.checkName, pid: this.pid, id: this.uniqueValue[0], length: this.length })
      this.$emit('update:visible', false)
    },
    handle(e, data) {
      if (data.engineeringDivide !== this.targetType) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    },
    //节点选择状态发生改变时
    checkChange(data, checkbox) {
      // this.checkName = data.label
      let label = this.$refs.tree.getCheckedNodes()[0].label || ''
      // console.log('标准', this.checkName, label)
      this.checkName = label
      this.pid = data.pid
      this.checkId = data.id
      this.length = data?.children?.length || 0
      if (checkbox) {
        this.$refs.tree.setCheckedKeys([data.id])
        this.uniqueValue = this.$refs.tree.getCheckedKeys()
      } else {
        this.uniqueValue = this.$refs.tree.getCheckedKeys()
        if (this.uniqueValue.length === 0) {
          this.uniqueValue = ''
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.filter-tree {
  /deep/.tree-item {
    &.active {
      color: #409eff;
    }
    &.disabled {
      width: 100%;
      cursor: not-allowed;
      color: #dcdfe6;
    }
  }
}
/deep/ .el-tree-node {
  .is-leaf + .el-checkbox .el-checkbox__inner {
    display: inline-block;
  }
  /deep/ .el-checkbox .el-checkbox__inner {
    display: none;
  }
}
</style>
