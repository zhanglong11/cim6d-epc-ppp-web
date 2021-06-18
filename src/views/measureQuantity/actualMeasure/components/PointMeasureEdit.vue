<template>
  <el-dialog destroy-on-close title="编辑点位" :visible="visible" @close="close">
    <vxe-table row-id="positionNum" :data="_.sortBy(list, ['positionNum', 'metricName'])">
      <vxe-table-column field="metricName" title="指标名"></vxe-table-column>
      <vxe-table-column title="合格标准">
        <template #default="{ row }"> [{{ row.lowerBound }},{{ row.uppserBound }}] </template>
      </vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="designValue" title="设计值">
        <template #default="{ row }">
          <InputNumber v-model="row.designValue" @input="calculateRow(row)"></InputNumber>
        </template>
      </vxe-table-column>
      <vxe-table-column field="measureValue" title="测量值">
        <template #default="{ row }">
          <InputNumber v-model="row.measureValue" @input="calculateRow(row)"></InputNumber>
        </template>
      </vxe-table-column>
      <vxe-table-column field="" title="是否合格">
        <template #default="{ row }">{{ ['不合格', '合格'][row.status] }}</template>
      </vxe-table-column>
    </vxe-table>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'PointMeasureEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    submit() {
      this.$emit('add', this.list)
      this.close()
    },
    remove() {},
    calculateRow(row) {
      if (_.isNumber(row.measureValue) && _.isNumber(row.designValue)) {
        const deviationValue = row.measureValue - row.designValue
        const isOk = deviationValue <= row.uppserBound && deviationValue >= row.lowerBound
        row.deviationValue = deviationValue
        console.log(isOk)
        row.status = isOk ? 1 : 0
      }
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
