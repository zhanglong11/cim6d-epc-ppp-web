<template>
  <div>
    <div class="formWrapper">
      <div class="detail">
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">选择合同：</el-col>
          <el-col :span="16" style="text-align: left">{{ baseInfo.contractName }}</el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">付款单名称：</el-col>
          <el-col :span="16" style="text-align: left">{{ baseInfo.name }}</el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">支付阶段：</el-col>
          <el-col :span="16" style="text-align: left">工程进度款</el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">付款方：</el-col>
          <el-col :span="16" style="text-align: left">{{ baseInfo.payer }}</el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">收款方：</el-col>
          <el-col :span="16" style="text-align: left">{{ baseInfo.payee }}</el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">支付时间：</el-col>
          <el-col :span="16" style="text-align: left">{{ baseInfo.paymentTime }}</el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">申报金额合计（元）：</el-col>
          <!--          <el-col :span="16" style="text-align: left">{{ baseInfo.totalAmount }}</el-col>-->
          <el-col :span="16" style="text-align: left">{{ info.money }}</el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">备注：</el-col>
          <el-col :span="16" style="text-align: left">{{ baseInfo.remark }}</el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="8" style="text-align: right">创建人：</el-col>
          <el-col :span="16" style="text-align: left">{{ baseInfo.creatorName }}</el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'PayDetail',
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    },
    paymentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: { ...this.baseInfo }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let res = await Api.getContractMeasurementPaymentById(this.paymentId)
      this.info = { money: res.data.totalAmount }
    }
  }
}
</script>
<style lang="less" scoped>
.formWrapper {
  width: 800px;
  margin: 0 auto;
}
.rowLine {
  margin: 40px 0;
}
</style>
