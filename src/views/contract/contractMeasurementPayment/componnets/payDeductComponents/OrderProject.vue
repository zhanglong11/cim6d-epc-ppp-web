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
      <vxe-table-column field="itemCode" title="项目编号" />
      <vxe-table-column field="itemName" title="项目名称" />
      <vxe-table-column field="itemFeature" title="项目特征" />
      <vxe-table-column field="unit" title="单位" />
      <vxe-table-column field="comprehensiveUnitPrice" title="单价(元)" />
      <vxe-table-column field="quantity" title="数量" />
      <vxe-table-column field="measureFinishQuantity" title="已计量完成工作量" />
      <vxe-table-column
        field="currentFinishQuantity"
        title="本期完成数量"
        :edit-render="{ name: '$input', props: { type: 'number' } }"
      />
      <vxe-table-column field="currentFinishMoney" title="本期完成金额(元)">
        <template #default="{ row }">
          {{ row.currentFinishQuantity ? row.currentFinishQuantity * row.comprehensiveUnitPrice : 0 }}</template
        >
      </vxe-table-column>
      <vxe-table-column field="auditQuantity" title="审核量" />
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
    <div style="margin-top: 10px">
      <div class="toolbar" style="display: flex; justify-content: space-between">
        <div class="num">
          共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
          <el-button type="text primary" class="el-icon-refresh" @click="refresh(false)"></el-button>
        </div>
        <el-pagination
          class="pagination"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'OrderProject',
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
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    async refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      let res = await Api.getContractMeasurementPaymentSubpackageList({
        paymentId: this.paymentId,
        rows: this.pageSize,
        page: this.currentPage
      })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh(true)
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
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
      res = await Api.updatePaymentSubpackage(param)
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
