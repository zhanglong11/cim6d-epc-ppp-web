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
      <vxe-table-column field="itemCode" title="项目编码" />
      <vxe-table-column field="itemName" title="项目名称" />
      <vxe-table-column field="calculationBasis" title="计算基础" />
      <vxe-table-column field="rate" title="费率(%)" />
      <vxe-table-column field="money" title="合价金额(元)" />
      <vxe-table-column field="adjustRate" title="调整费率(%)" />
      <vxe-table-column field="adjustMoney" title="调整后金额(元)" />
      <vxe-table-column field="measureFinishMoney" title="已计量金额(元)" />
      <vxe-table-column
        field="currentFinishMoney"
        title="本期完成金额"
        :edit-render="{ name: '$input', props: { type: 'number' } }"
      />
      <vxe-table-column field="categoryCode" title="所属分类">
        <template slot-scope="{ row }">
          <span v-if="row.categoryCode">{{
            projectBelongType.find(item => item.value === row.categoryCode).label
          }}</span>
        </template>
      </vxe-table-column>
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
import projectBelongType from '@/lib/projectBelongType'
export default {
  name: 'TotalPriceMeasure',
  props: {
    contractId: {
      type: [Number, String],
      default: ''
    },
    paymentId: {
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
      projectBelongType,
      tableData: []
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    async refresh(isFirstPage) {
      //this.total = 50
      if (isFirstPage) {
        this.currentPage = 1
      }
      let res = await Api.getContractMeasurementPaymentTotalPriceMeasureList({
        paymentId: this.paymentId
      })
      this.tableData = res.data.records
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['currentFinishMoney'].includes(column.property)) {
            let total = 0
            data.map(item => {
              total += Number(item.currentFinishMoney)
            })
            this.$emit('getPayMoney', Number(total))
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
      })
    },
    async saveData(row) {
      let res = null
      let param = {
        ...row,
        contractId: this.contractId,
        paymentId: this.paymentId
      }
      res = await Api.updateTotalPriceMeasure(param)
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
