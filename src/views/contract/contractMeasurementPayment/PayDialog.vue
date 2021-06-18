<template>
  <el-dialog title="支付填报" :visible="visible" width="1200" top="10px" @close="$emit('close')">
    <div class="dialogWrapper">
      <vxe-table ref="xTable" border :data="tableData" auto-resize :edit-config="{ trigger: 'manual', mode: 'row' }">
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column
          field="payMoney"
          title="支付金额"
          :edit-render="{ name: 'input', attrs: { type: 'number' } }"
        />
        <vxe-table-column
          field="payTime"
          title="支付日期"
          :edit-render="{
            name: 'ElDatePicker',
            props: { type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' }
          }"
        />
        <vxe-table-column field="remark" title="备注" :edit-render="{ name: 'input', attrs: { type: 'text' } }" />
        <vxe-table-column v-if="!disabled" title="操作" width="150px">
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
      <div v-if="!disabled" class="addWrapper" @click="handleAdd"><i class="el-icon-plus"></i>添加</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="$emit('close')">确 定</el-button>
      <el-button v-if="!disabled" type="primary" @click="finishContractMeasurementPaymentReport()"
        >全部支付完成</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'PayDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    paymentId: {
      type: [Number, String],
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
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
      let res = await Api.getPaymentReportList({
        paymentId: this.paymentId
      })
      this.tableData = res.data.records
    },
    handleAdd() {
      this.tableData.push({
        payMoney: 0,
        remark: '',
        payTime: null
      })
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        /**
         任务名称：BUG1585 合同管理->财务支付填报->支付填报：在支付填报页面添加支付信息，在没有填写【支付金额】和【支付日期】时，点击“保存”按钮，页面报错，并弹出保存成功提示，不合理
         开发人员：崔洛宜
         日期：2020-04-14
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
        if (!row.payMoney) {
          this.$message.error('请填写金额')
          this.$refs.xTable.setActiveRow(row)
          return
        }
        if (!row.payTime) {
          this.$message.error('请填写支付时间')
          this.$refs.xTable.setActiveRow(row)
          return
        }
        this.saveData(row)
        this.$message.success('保存成功')
      })
    },
    payTimeChangeEvent({ row }, e) {
      if (e && row.exitTime) {
        row.leaseDay = this.getLeaseDay(e, row.exitTime)
      }
    },
    async saveData(row) {
      let res = null
      row.payTime = moment(row.payTime).format('YYYY-MM-DD HH:mm:ss')
      let param = {
        ...row,
        paymentId: this.paymentId
      }
      if (row.id) {
        res = await Api.updatePaymentReportById(param)
      } else {
        res = await Api.addPaymentReport(param)
        row.id = res.data
      }
      // 刷新父级组件
      this.$emit('refreshTable')
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
        await Api.deletePaymentReportById(row.id)
      } else {
        this.tableData.splice(rowIndex, 1)
      }
      // 刷新父级组件
      this.$emit('refreshTable')
      this.$message.success('删除成功')
      this.refresh()
    },
    // 填报完成
    async finishContractMeasurementPaymentReport() {
      await Api.finishContractMeasurementPaymentReport(this.paymentId)
      this.$message.success('操作成功')
      this.$emit('refreshTable')
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.addWrapper {
  height: 40px;
  line-height: 40px;
  margin: 10px 50px;
  border: 1px #585858 dashed;
  text-align: center;
}
</style>
