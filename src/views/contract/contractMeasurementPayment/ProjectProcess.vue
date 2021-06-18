<template>
  <div class="outerContainer indexWrapper">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>合同计量与支付基本信息</span>
      </div>
      <div>
        <div class="stepWrapper">
          <el-steps :active="active" align-center>
            <el-step title="步骤1" description="填写合同计量与支付基本信息"></el-step>
            <el-step title="步骤2" description="填写支付与扣款项详情"></el-step>
            <el-step title="步骤3" description="完成表单并提交审核"></el-step>
          </el-steps>
        </div>
        <BaseForm
          v-if="active === 1"
          ref="baseForm"
          :formData="formData"
          :amountDisabled="true"
          @submitSuccess="handleSubmitSuccess"
          @submitError="handleSubmitError"
        ></BaseForm>
        <PayDeduct
          v-if="active === 2"
          ref="payDeduct"
          :paymentId="paymentId"
          :contractType="contractType"
          :contractId="baseInfo.contractId"
          :isEdit="isEdit"
        ></PayDeduct>
        <PayDetail v-if="active === 3" :baseInfo="baseInfo" :paymentId="paymentId"> </PayDetail>
      </div>
    </el-card>
    <div class="footerButton">
      <el-button
        v-if="active !== 1"
        @click="
          () => {
            active--
            formData = baseInfo
            isEdit = true
          }
        "
        >上一步</el-button
      >
      <el-button @click="handleCancel">返回列表</el-button>
      <el-button v-if="active === 1" type="primary" @click="handleSave">保存</el-button>
      <el-button v-if="active !== 3" type="primary" @click="handleNext">下一步</el-button>
      <el-button v-if="active === 3" type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>
<script>
import BaseForm from './componnets/BaseForm'
import PayDeduct from './componnets/PayDeduct'
import PayDetail from './componnets/PayDetail'
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'ProjectProcess',
  components: { BaseForm, PayDeduct, PayDetail },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      active: 1,
      isNext: false,
      isSave: true,
      isEdit: true,
      formData: { paymentStage: 1, totalAmount: 0 },
      paymentId: '',
      contractType: 0,
      baseInfo: {}
    }
  },
  created() {
    let { row, isEdit } = this.$route.params
    this.isEdit = isEdit
    if (isEdit) {
      this.paymentId = row.id
      this.formData = row
      this.contractType = Number(row.contractType)
    }
  },
  methods: {
    handleCancel() {
      this.$router.back()
    },
    handleSave() {
      this.isNext = false
      this.$refs.baseForm.submitForm()
    },
    handleNext() {
      if (this.active === 1) {
        this.isNext = true
        this.$refs.baseForm.submitForm()
      } else {
        this.baseInfo.totalAmount = this.$refs.payDeduct.getTotalAmount()
        Api.updateTotalMoney(this.paymentId).then(res => {
          this.active++
        })
      }
    },
    handleSubmit() {
      this.isSave = false
      this.isEdit = true
      this.isNext = false
      /**
       任务名称：BUG1570 合同管理->新建合同：新建合同时，在必填字段【合同金额】为空的情况下，保存合同信息，可以成功保存。
       开发人员：崔洛宜
       日期：2020-04-14
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      if (!this.baseInfo.totalAmount) {
        this.$message.error('申请金额合计不能为空,请填写第二部操作')
        return false
      }
      this.handleSubmitSuccess(this.baseInfo)
    },
    handleSubmitSuccess(data) {
      this.baseInfo = data
      this.contractType = data.contractType
      this.saveData()
    },
    async saveData() {
      let res = null
      if (this.isEdit) {
        res = await Api.updateContractMeasurementPaymentById({
          ...this.baseInfo,
          status: this.isSave ? 0 : 1,
          projectId: this.projectId,
          id: this.paymentId
        })
      } else {
        res = await Api.addPrepayment({ ...this.baseInfo, projectId: this.projectId, status: this.isSave ? 0 : 1 })
        this.paymentId = res.data
      }
      if (!this.isSave) {
        this.$router.push({ name: `ContractMeasurementPayment` })
      }
      if (this.isNext) {
        this.addNext()
      }
    },
    async addNext() {
      await Api.addNext(this.paymentId)
      this.active++
    },
    handleSubmitError() {
      this.$message.error('请完善数据')
    }
  }
}
</script>
<style lang="less" scoped>
.outerContainer {
  padding: 20px;
}
.stepWrapper {
  width: 1000px;
  margin: 20px auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
