<template>
  <el-dialog
    width="1400px"
    :title="'确认页面'"
    :visible="visible"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <h4>设备明细</h4>
    <vxe-table
      ref="xTable"
      border
      resizable
      show-overflow
      :data="tableData"
      :edit-config="{ trigger: 'click', mode: 'cell', autoClear: false }"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="name" title="设备名称"></vxe-table-column>
      <vxe-table-column field="models" title="规格型号"></vxe-table-column>
      <vxe-table-column
        field="type"
        title="设备类型"
        :formatter="({ cellValue }) => $getLabel(equipmentTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="type" title="设备类别"></vxe-table-column>
      <vxe-table-column field="manufacturer" title="生产厂家"></vxe-table-column>
      <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
      <vxe-table-column field="number" title="申请采购数量"></vxe-table-column>
      <vxe-table-column field="univalence" title="单价"></vxe-table-column>
      <vxe-table-column field="combinedPrice" title="合价"> </vxe-table-column>
      <vxe-table-column
        field="arrivalNumber"
        title="到货数量"
        :edit-render="{
          name: '$input',
          props: { type: 'number' }
        }"
      ></vxe-table-column>
      <vxe-table-column
        field="enableInputNumber"
        title="可入库量"
        :edit-render="{
          name: '$input',
          props: { type: 'number' }
        }"
      ></vxe-table-column>
      <vxe-table-column
        field="remark"
        title="备注"
        :edit-render="{
          name: '$input',
          props: { type: 'text' }
        }"
      ></vxe-table-column>
    </vxe-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api/index'
import equipmentTypeList from '../../lib/equipmentTypeList'
export default {
  name: 'ReceiveConfirmModel',
  props: {
    visible: Boolean,
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      equipmentTypeList,
      tableData: []
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let res = await Api.getEquipmentPurchaseById(this.id)
      let arr = res.data.purchaseDetails.map(item => {
        return {
          ...item,
          arrivalNumber: 0,
          enableInputNumber: 0,
          remark: ''
        }
      })
      this.tableData = [...arr]
    },
    onOk() {
      this.$emit('submit', this.tableData)
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
