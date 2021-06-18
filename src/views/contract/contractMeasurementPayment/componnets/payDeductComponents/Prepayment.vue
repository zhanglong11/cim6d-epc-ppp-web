<template>
  <div class="container">
    <vxe-table
      ref="xTable"
      border
      :data="tableData"
      auto-resize
      show-footer
      :footer-method="footerMethod"
      :edit-config="{ trigger: 'manual', mode: 'row' }"
    >
      <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
      <vxe-table-column field="orderCode" title="付款单编号" />
      <vxe-table-column field="orderName" title="付款单名称" />
      <vxe-table-column field="orderTotalAmount" title="预存款单金额(元)" />
      <vxe-table-column field="withholdMoney" title="已扣款金额(元)" />
      <vxe-table-column
        field="applyMoney"
        title="申请金额(元)"
        :edit-render="{ name: '$input', props: { type: 'number' } }"
      />
      <vxe-table-column field="remark" title="备注" :edit-render="{ name: 'input', attrs: { type: 'text' } }" />
      <vxe-table-column field="auditMoney" title="审核金额(元)" />
      <vxe-table-column v-if="isEdit" title="操作" width="150px">
        <template #default="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'Prepayment',
  props: {
    paymentId: {
      type: [Number, String],
      default: ''
    },
    contractId: {
      type: [Number, String],
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    async refresh() {
      let res = await Api.getContractMeasurementPaymentAdvanceList({
        contractId: this.contractId,
        paymentId: this.paymentId,
        projectId: localStorage.getItem('projectId')
      })
      this.tableData = res.data.records
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['applyMoney'].includes(column.property)) {
            let total = 0
            data.map(item => {
              total += Number(item.applyMoney)
            })
            this.$emit('getDeductMoney', Number(total))
            return total.toFixed(2)
          }
          return null
        })
      ]
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        this.saveData(row)
        this.$message.success('保存成功')
        this.refresh()
      })
    },
    async saveData(row) {
      let res = null
      let param = {
        ...row,
        contractId: this.contractId,
        paymentId: this.paymentId
      }
      res = await Api.updateContractMeasurementPaymentAdvanceById(param)
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  padding: 5px;
}
</style>
