<template>
  <div>
    <VXTable
      ref="table"
      :columns="columns"
      :tableData="value"
      :validRules="validRules"
      :pageShow="pageShow"
      :show-footer="showFooter"
      :footerColspanMethod="footerColspanMethod"
      :footer-method="footerMethod"
      :border="border"
      :isEdit="true"
      :total="total"
      @pageChange="a => $emit('pageChange', a)"
      @getList="() => $emit('getList')"
      @sizeChange="a => $emit('sizeChange', a)"
    />
    <el-button v-if="isAdd" style="width: 100%" @click="add">添加</el-button>
  </div>
</template>

<script>
export default {
  name: 'EditTable',
  props: {
    tableColumn: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    pageShow: {
      type: Boolean,
      default: false
    },
    validRules: {},
    isRemove: {
      type: Boolean,
      default: true
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    footerMethod: {
      type: Function
    },
    footerColspanMethod: {
      type: Function
    },
    border: {
      type: Boolean,
      default: false
    },
    // 数据总数
    total: {
      type: Number,
      default: 0
    }
  },
  computed: {
    columns() {
      let handle = {
        field: '',
        title: '操作',
        slots: {
          default: ({ row }) => [
            <el-button type="text" onClick={() => this.remove(row)}>
              删除
            </el-button>
          ]
        }
      }
      return this.isRemove ? [...this.tableColumn, handle] : this.tableColumn
    }
  },
  methods: {
    add() {
      this.$refs.table.$refs.vxeTable.insertAt({}, -1)
      this.$emit('input', [...this.value, ...this.$refs.table.$refs.vxeTable.getInsertRecords()])
    },
    remove(row) {
      this.$refs.table.$refs.vxeTable.remove(row)
      this.$emit(
        'input',
        this.value.filter(r => r._XID !== row._XID)
      )
    },
    pageChange() {}
  }
}
</script>

<style scoped></style>
