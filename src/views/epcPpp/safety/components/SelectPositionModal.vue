<template>
  <el-dialog title="选择位置" width="800px" :visible="visible" @close="$emit('update:visible', false)">
    <el-tree :data="treeData" node-key="id" default-expand-all @node-click="handleClick"> </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  name: 'SelectPositionModal',
  props: ['visible'],
  data() {
    return {
      treeData: [],
      selectTreeNode: null,
      selectTreeId: ''
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      this.treeData = [
        {
          label: '一级 1',
          id: 1,
          children: [
            {
              label: '二级 1-1',
              id: 11,
              children: [
                {
                  id: 111,
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          id: 2,

          children: [
            {
              label: '二级 2-1',
              id: 21,

              children: [
                {
                  id: 211,
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              id: 212,
              children: [
                {
                  label: '三级 2-2-1',
                  id: 231
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        }
      ]
    },
    //点击节点
    handleClick(data, node) {
      this.selectTreeNode = data
      this.selectTreeId = data.id
    },
    handleSubmit() {
      if (this.selectTreeId) {
        this.$emit('submit', this.selectTreeNode)
      } else {
        this.$message.error('请选择一个位置')
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog__header {
  border-bottom: 1px #999 solid;
}
/deep/ .el-tree {
  .el-tree-node {
    &.is-current {
      & > .el-tree-node__content {
        background-color: #00a6ff !important;
      }
    }
  }
}
</style>
