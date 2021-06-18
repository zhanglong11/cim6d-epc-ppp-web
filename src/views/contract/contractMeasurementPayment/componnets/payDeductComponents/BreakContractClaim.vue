<template>
  <div class="container">
    <vxe-table
      ref="xTable"
      border
      :data="tableData"
      auto-resize
      show-footer
      :span-method="spanMethod"
      :footer-method="footerMethod"
      :edit-config="{ trigger: 'manual', mode: 'row' }"
    >
      <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
      <vxe-table-column field="itemName" title="违约项目" :edit-render="{ name: 'input', attrs: { type: 'text' } }" />
      <vxe-table-column
        field="applyMoney"
        title="申请金额"
        :edit-render="{ name: '$input', props: { type: 'number' } }"
      />
      <vxe-table-column field="remark" title="备注" :edit-render="{ name: 'input', attrs: { type: 'text' } }" />
      <vxe-table-column field="checkMoney" title="审核金额(元)" />
      <vxe-table-column v-if="isEdit" title="操作" width="150px">
        <template slot-scope="{ row, rowIndex }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="handleDelete(row, rowIndex)">删除</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
    <div v-if="isEdit" class="addWrapper" @click="handleAdd"><i class="el-icon-plus"></i>添加</div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'BreakContractClaim',
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
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.getContractMeasurementPaymentBreachList({
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
    handleAdd() {
      this.tableData.push({
        itemName: '',
        applyMoney: 0,
        remark: '',
        auditMoney: null
      })
    },
    spanMethod({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, data }) {
      if ($rowIndex === -2) {
        return { rowspan: 1, colspan: 2 }
      }
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        this.saveData(row)
        this.$message.success('保存成功')
        this.$refs.xTable.updateFooter()
      })
    },
    async saveData(row) {
      let res = null
      let param = {
        ...row,
        contractId: this.contractId,
        paymentId: this.paymentId,
        projectId: localStorage.getItem('projectId')
      }
      if (row.id) {
        res = await Api.updateContractMeasurementPaymentBreachById(param)
      } else {
        res = await Api.addPaymentBreach(param)
        row.id = res.data
      }
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    async handleDelete(row, rowIndex) {
      if (row.id) {
        await Api.deleteContractMeasurementPaymentBreachById(row.id)
      } else {
        this.tableData.splice(rowIndex, 1)
      }
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  padding: 5px;
}
.addWrapper {
  height: 40px;
  line-height: 40px;
  margin: 10px 50px;
  border: 1px #585858 dashed;
  text-align: center;
}
</style>
