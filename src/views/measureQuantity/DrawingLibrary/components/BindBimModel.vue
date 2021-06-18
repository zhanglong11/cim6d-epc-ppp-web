<template>
  <el-dialog title="BIM关联" center width="1000px" top="60px" :visible="visible" @close="close">
    <vxe-table
      :tree-config="{ lazy: true, children: 'children', hasChild: 'hasChild', loadMethod: loadChildrenMethod }"
      max-height="800px"
      :data="list"
      resizable
      row-id="id"
    >
      <vxe-table-column tree-node title="模型名称" field="name"></vxe-table-column>
      <vxe-table-column title="状态" field="status"></vxe-table-column>
      <vxe-table-column title="关联模型"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button type="text" @click="bind(row)">关联</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
  </el-dialog>
</template>

<script>
import Api from '@/api/model/tree'
import treeForEach from '@/utils/treeForEach'

export default {
  name: 'BindBimModel',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      list: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.refresh()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async refresh() {
      let res = await Api.getProjectTreeData(this.projectId)
      treeForEach(res.data, e => {
        e.hasChild = e.type === 3
        e.name = e.bimResourceName
      })
      this.list = res.data
    },
    loadChildrenMethod({ row }) {
      return Api.getFloorTreeData(row.bimResourceId)
    },
    async bind(row) {
      await this.axios.construction.post('constructionDrawingLibrary/updateBim', {
        bimResourceId: row.id,
        bimResourceName: row.name,
        ids: [this.model.id]
      })
      this.$message.success('关联成功')
      this.$parent.init()
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
