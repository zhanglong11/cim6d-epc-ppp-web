<template>
  <el-dialog
    title=""
    :visible="visible"
    width="85%"
    top="10vh"
    style="margin-left: 150px"
    :modal-append-to-body="false"
    @close="$emit('close')"
  >
    <div class="container">
      <el-row :gutter="20">
        <el-col :md="24">
          <div class="task-list">
            <div style="margin: 15px 0">
              <el-button type="primary" @click="insertEvent(-1)">新增</el-button>
            </div>

            <div>
              <vxe-table
                ref="xTree"
                border
                resizable
                show-overflow
                :data="tableData"
                :edit-config="{ trigger: 'click', mode: 'row' }"
              >
                <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
                <vxe-table-column field="code" title="材料编码(自动生成)"></vxe-table-column>
                <vxe-table-column field="name" title="材料名称" :edit-render="{ name: '$input' }"></vxe-table-column>
                <vxe-table-column field="models" title="规格型号" :edit-render="{ name: '$input' }"></vxe-table-column>
                <vxe-table-column field="unit" title="单位" :edit-render="{ name: '$input' }"></vxe-table-column>
                <vxe-table-column field="brand" title="品牌" :edit-render="{ name: '$input' }"></vxe-table-column>
                <vxe-table-column field="supplier" title="供应商" :edit-render="{ name: '$input' }"></vxe-table-column>
                <vxe-table-column field="remark" title="备注" :edit-render="{ name: '$input' }"></vxe-table-column>
              </vxe-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <footer slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddMaterialDialog',

  props: {
    visible: {},
    detailList: {
      type: Array
    }
  },

  data() {
    // 这里存放数据
    return {
      loading: false,
      /*列表*/
      tableData: [
        {
          seq: '1',
          code: '',
          name: '',
          models: '',
          unit: '',
          brand: '',
          supplier: '',
          inventoryNumber: '',
          number: '',
          univalence: ''
        }
      ]
    }
  },
  methods: {
    async insertEvent(row) {
      let record = {
        seq: '',
        code: '',
        name: '',
        models: '',
        unit: '',
        brand: '',
        supplier: '',
        inventoryNumber: '',
        number: '',
        univalence: ''
      }
      let { row: newRow } = await this.$refs.xTree.insertAt(record, row)
      await this.$refs.xTree.setActiveCell(newRow)
    },
    submit() {
      const { insertRecords } = this.$refs.xTree.getRecordset()
      this.tableData = [...this.tableData, ...insertRecords]
      this.$emit('getTarget', { checked: this.tableData })
      // this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .treeView {
    margin-bottom: 15px;
  }
  .buttons {
    margin: 10px 0;
  }
}
</style>
