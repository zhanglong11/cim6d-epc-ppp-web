<template>
  <div class="outerContainer indexWrapper">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>合同计量与支付基本信息</span>
      </div>
      <div>
        <BaseForm
          ref="baseForm"
          :formData="formData"
          @submitSuccess="handleSubmitSuccess"
          @submitError="handleSubmitError"
        ></BaseForm>
      </div>
    </el-card>
    <div class="footerButton">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
    </div>
  </div>
</template>
<script>
import BaseForm from './componnets/BaseForm'
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'Prepayment',
  components: { BaseForm },
  data() {
    return {
      isSave: true,
      isEdit: false,
      paymentId: '',
      formData: {
        paymentStage: 2
      }
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      let { id, isEdit } = this.$route.params
      let { paymentStage } = this.$route.query
      this.formData.paymentStage = parseInt(paymentStage)
      this.isEdit = isEdit
      this.paymentId = id
      if (isEdit) {
        Api.getContractMeasurementPaymentById(id).then(res => {
          if (res.code === 200) {
            this.formData = res.data
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
      }
    },
    handleCancel() {
      this.$router.back()
    },
    handleSave() {
      this.isSave = true
      this.$refs.baseForm.submitForm()
    },
    handleSubmit() {
      this.isSave = false
      this.$refs.baseForm.submitForm()
    },
    handleSubmitSuccess(data) {
      if (this.isEdit) {
        Api.updateContractMeasurementPaymentById({
          ...data,
          status: this.isSave ? 0 : 1,
          projectId: this.projectId,
          id: this.paymentId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$router.back()
          } else {
            this.$message.error('保存失败')
          }
        })
      } else {
        Api.addPrepayment({ ...data, projectId: this.projectId, status: this.isSave ? 0 : 1 }).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$router.back()
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    handleSubmitError() {
      this.$message.error('保存失败')
    }
  }
}
</script>
<style lang="less" scoped>
.outerContainer {
  padding: 20px;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
