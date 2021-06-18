<template>
  <div>
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
        style="max-height: 400px; overflow-y: auto"
        show-checkbox
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @check="handleNodeClick"
        @check-change="parentModules"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span v-if="data.findChildrenBind === true" style="display: inline-block; margin-left: 5px"
            ><i class="el-icon-picture" style="color: #00a6ff"></i
          ></span>
          <span v-else></span>
          <!--          <span>-->
          <!--            <el-button type="text" size="mini" style="margin-left: 10px;" @click="lookDraw(data.drawingUrl)">-->
          <!--              {{ data.type === 5 ? data.drawingName : '' }}-->
          <!--            </el-button>-->
          <!--          </span>-->
        </span>
      </el-tree>
      <footer slot="footer">
        <el-button @click="$emit('update:visible', false)">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </footer>
    </el-dialog>
    <el-dialog title="图片展示" :visible.sync="dialogVisible" width="30%" :append-to-body="true">
      <el-image style="width: 100%; height: 300px" :src="DrawImgUrl" :fit="fit">
        <div slot="error" class="image-slot"></div>
      </el-image>
    </el-dialog>
  </div>
</template>
<script>
import Api from '@/views/measureQuantity/api/measure'
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
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: (data, node) => {
          if (data.type < 5) {
            return !data.leaf
          }
        }
      },
      DrawImgUrl: '',
      fit: 'fill',
      filterText: '',
      projectId: localStorage.getItem('projectId'),
      checkName: null,
      checkId: null,
      drawingId: null,
      uniqueValue: '',
      drawingUrl: ''
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
    lookDraw(url) {
      console.log(url)
      this.dialogVisible = true
      this.DrawImgUrl = url
    },
    refresh() {
      console.log(this.targetType)
      // let res = await api.tree({})
      // this.treeData = toTree(res.data)
      this.getTreeListInfo()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /*单体树形结构列表*/
    async getTreeListInfo() {
      let res = await Api.getTreeListInfo(this.projectId)
      this.treeData = res.data || []
      // console.log(this.treeData)
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    handleNodeClick(node, data) {
      let label = []
      label = this.$refs.tree
        .getCheckedNodes()
        .concat(this.$refs.tree.getHalfCheckedNodes())
        .map(item => {
          return item.label
        })
      label.push(...label.splice(0, 1))
      console.log('选中节点', node)
      this.checkName = label.join('')
      this.drawingId = node.drawingId
      this.checkId = node.id
      this.drawingUrl = node.drawingUrl
      this.length = node?.children?.length || 0
    },
    //节点选择状态发生改变时
    parentModules(data, checkbox, node) {
      console.log(data)
      if (checkbox) {
        this.$refs.tree.setCheckedKeys([data.id])
        this.uniqueValue = this.$refs.tree.getCheckedKeys()
      } else {
        this.uniqueValue = this.$refs.tree.getCheckedKeys()
        if (this.uniqueValue.length === 0) {
          this.uniqueValue = ''
        }
      }
    },
    submit() {
      this.$emit('getTarget', {
        label: this.checkName,
        drawingId: this.drawingId,
        id: this.checkId,
        drawingUrl: this.drawingUrl,
        length: this.length
      })
      this.$emit('update:visible', false)
    },
    handle(e, data) {
      if (data.engineeringDivide !== this.targetType) {
        e.preventDefault()
        e.stopPropagation()
        return false
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
