<template>
  <el-dialog title="租赁" width="1000px" :visible="visible" @close="close">
    <vxe-table :data="detail.details">
      <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
      <vxe-table-column title="设备名称" field="name"></vxe-table-column>
      <vxe-table-column title="规格型号" field="models"></vxe-table-column>
      <vxe-table-column
        title="设备类型"
        field="type"
        :formatter="({ cellValue }) => $getLabel(equipmentType, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="生产厂家" field="manufacturer"></vxe-table-column>
      <vxe-table-column title="供应商" field="supplier"></vxe-table-column>
      <vxe-table-column title="租赁押金" field="rentDeposit"></vxe-table-column>
      <vxe-table-column title="租赁期限(天)" field="rentTime"></vxe-table-column>
      <vxe-table-column title="租赁数量" field="number"></vxe-table-column>
      <vxe-table-column title="租赁租金" field="rentReprises"></vxe-table-column>
      <vxe-table-column title="到货数量" field="arrivalNumber"></vxe-table-column>
      <vxe-table-column title="可入库量" field="enableInputNumber"></vxe-table-column>
      <vxe-table-column title="备注" field="remark"></vxe-table-column>
    </vxe-table>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">入库</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import equipmentType from '@/components/SelectEquipmentDialog/selectList/equipmentType'

export default {
  name: 'WarehousingDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Array],
      default: null
    }
  },
  data() {
    return {
      detail: {
        details: []
      },
      equipmentType
    }
  },
  watch: {
    visible(val) {
      val && this.refresh()
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.axios.material.get('equipmentLease/get/' + this.id).then(res => {
        this.detail = res.data
      })
    },
    async submit() {
      await this.axios.material.get('equipmentLease/addInventory/' + this.id)
      this.$message.success('操作成功')
      this.$parent.refresh()
      this.close()
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
