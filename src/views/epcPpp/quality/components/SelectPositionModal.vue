<template>
  <el-dialog title="选择位置" width="800px" :visible="visible" @close="$emit('update:visible', false)">
    <div class="tree-roll">
      <el-tree
        ref="treeRef"
        class="custom-tree"
        :data="treeData"
        node-key="id"
        show-checkbox
        default-expand-all
        check-on-click-node
        @check-change="changeCheck"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node" :class="{ 'is-disabled': data.disabled }">
          <span>{{ node.label }}</span>
          <span v-if="data.disabled" class="el-icon-warning" style="margin-left: 6px"></span>
        </span>
      </el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
import toTree from '@/utils/toTree'
export default {
  name: 'SelectPositionModal',
  props: ['visible', 'defaultId'],
  data() {
    return {
      treeData: [],
      selectTreeNode: null,
      selectTreeId: ''
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    // 查询项目下的所有楼层结构
    async refresh() {
      let params = {
        projectId: this.projectId
      }
      let result = await Api.queryFloorList(params)
      let datas = result.data
      datas.map(e => {
        e.label = e.title
        e.disabled = !e.viewId || e.type !== 5
      })
      let list = toTree(datas, 'pid', '', 'id', true, true)
      this.treeData = list
      if (this.defaultId) {
        // 默认选中
        this.$refs.treeRef.setCheckedKeys([this.defaultId])
      }
    },
    //点击节点
    changeCheck(e, f, g) {
      if (f) {
        this.$refs.treeRef.setCheckedKeys([e.id])
        this.selectTreeId = e.viewId
        this.selectTreeNode = e
      }
    },
    // 保存
    save() {
      if (this.selectTreeId) {
        this.$emit('submit', this.selectTreeNode)
      } else {
        this.$message.error('请选择问题部位')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/styles/common');
.tree-roll {
  height: 600px;
  overflow-y: auto;
  .scrollbar;
}
/deep/ .el-dialog__header {
  border-bottom: 1px #ddd solid;
}
.custom-tree {
  /deep/.is-disabled {
    opacity: 0.6;
  }
}
</style>
