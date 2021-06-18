<template>
  <el-dialog width="1000px" top="10vh" title="图纸关联" :visible="visible" @close="close">
    <div class="wrap">
      <el-card class="list" shadow="never">
        <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          highlight-current
          @node-click="treeClick"
        >
          <p slot-scope="{ node, data }" class="custom-tree-node">
            <span class="name">{{ data.title }}</span>
            <!--            <i v-if="data.isBind" slot="suffix" class="el-icon-star-off" />-->
          </p>
        </el-tree>
      </el-card>
      <el-card class="model" shadow="never">
        <div slot="header">
          <span>模型列表</span>
        </div>
        <vxe-table ref="table" key="1" border :data="tableData" max-height="500">
          <vxe-table-column type="seq" title="序号" width="60px" />
          <vxe-table-column field="name" min-width="140" title="视图名称" />
          <vxe-table-column
            field="type"
            min-width="100"
            title="视图类型"
            :formatter="({ cellValue }) => $getLabel(typeList, cellValue)"
          />
          <vxe-table-column field="isBind" min-width="80" title="是否关联">
            <template #default="{ row }">
              <div>{{ bindViewIdList.includes(row.id) ? '是' : '否' }}</div>
            </template>
          </vxe-table-column>
          <vxe-table-column field="createTime" min-width="140" title="上传时间" />
          <vxe-table-column field="name" width="140" fixed="right" title="操作">
            <template #default="{ row }">
              <el-button v-if="bindViewIdList.includes(row.id)" type="text" @click="cancelLink(row)"
                >取消关联</el-button
              >
              <el-button type="text" :disabled="!activeId" @click="link(row)">关联</el-button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </el-card>
    </div>
    <footer slot="footer">
      <el-button @click="close">返回</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../../api'
export default {
  name: 'LibraryLinkDialog',
  props: ['visible', 'modelId', 'viewId', 'viewName'],
  data() {
    return {
      treeData: [],
      tableData: [],
      activeViewId: null,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      activeId: null,
      bindViewIdList: [],
      typeList: [
        { label: '3D视图', value: 1 },
        { label: '平面视图', value: 2 },
        { label: '图纸视图', value: 3 },
        { label: '剖面视图', value: 4 },
        { label: '立面视图', value: 5 }
      ]
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    //刷新
    refresh() {
      this.getTree()
      this.getTableData()
    },
    async getTree() {
      const res = await Api.floorTree({ modelId: this.modelId, viewId: this.viewId })
      this.treeData = [{ id: this.viewId, title: this.viewName, isRoot: true, children: res.data }]
      if (res.data && res.data.length) {
        this.$nextTick(() => {
          let first = res.data[0]
          this.activeId = this.activeId || first.id
          this.activeName = this.title || first.title
          this.elevation = this.elevation || first.elevation
          this.bindViewIdList = res.data.filter(r => r.id === this.activeId)[0].bindViewIdList || []
          this.$refs.tree.setCurrentKey(this.activeId || first.id)
        })
      }
    },
    //获取图纸
    async getTableData() {
      const res = await Api.libraryList({ modelId: this.modelId })
      this.tableData = _.cloneDeep(res.data)
    },
    //选中楼层
    treeClick(data) {
      if (data.isRoot) {
        this.activeId = null
        return
      }
      this.activeId = data.id
      this.activeName = data.title
      this.elevation = data.elevation
      this.bindViewIdList = data.bindViewIdList || []
      this.getTableData()
    },
    //关联
    async link(row) {
      await Api.link({
        locationId: this.activeId,
        locationName: this.activeName,
        elevation: this.elevation,
        viewId: row.id,
        modelId: this.modelId
      })
      this.$message.success('操作成功')
      this.refresh()
    },
    //取消关联
    async cancelLink(row) {
      await Api.cancelBind({
        locationId: this.activeId,
        locationName: this.activeName,
        elevation: this.elevation,
        viewId: row.id,
        modelId: this.modelId
      })
      this.$message.success('操作成功')
      this.refresh()
    },
    //关闭
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;

  .list {
    flex: 0 0 240px;
    max-height: 500px;
    overflow-y: auto;
  }
  .model {
    flex: 1;
  }
  .custom-tree-node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .name {
      margin-right: 4px;
    }
  }
}
</style>
