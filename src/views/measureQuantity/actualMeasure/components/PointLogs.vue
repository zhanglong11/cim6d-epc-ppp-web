<template>
  <el-dialog width="600px" destroy-on-close title="测量记录" :visible="visible" @close="close">
    <vxe-table row-id="positionNum" :data="list">
      <vxe-table-column field="measureValue" title="测量值"></vxe-table-column>
      <vxe-table-column field="measureTime" title="测量时间"></vxe-table-column>
      <vxe-table-column field="measurerName" title="测量人"></vxe-table-column>
      <vxe-table-column field="" title="是否合格">
        <template #default="{ row }">{{ ['不合格', '合格'][row.status] }}</template>
      </vxe-table-column>
    </vxe-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'PointLogs',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
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
  methods: {
    refresh() {
      this.axios.safety.get('measureHistory/list/' + this.id).then(res => {
        this.list = res.data
      })
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
