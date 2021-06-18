<template>
  <div>
    <div class="formWrapper">
      <el-form ref="baseInfoForm" :model="form" :rules="formRule">
        <el-form-item label="选择合同" label-width="160px" prop="contractName">
          <el-input v-model="form.contractName" placeholder="请选择合同" class="inputStyle" disabled> </el-input>
          <a @click="handleSelectContract">选择合同</a>
        </el-form-item>
        <el-form-item label="付款单名称" label-width="160px" prop="name">
          <el-input v-model="form.name" placeholder="请输入付款单名称" class="inputStyle"> </el-input>
        </el-form-item>
        <el-form-item label="支付阶段" label-width="160px" prop="paymentStage">
          <PaymentStatusSelect v-model="form.paymentStage" class="inputStyle" :disabled="true"></PaymentStatusSelect>
        </el-form-item>
        <!--
        /**
        任务名称：1104/申请合计金额必填项,缺少必填标记
        开发人员：崔洛宜
        日期：2020-03-18
        BUG类型：1、测试人员提出的系统性BUG
        **/
       -->
        <el-form-item label="申请金额合计（元）" label-width="160px" prop="totalAmount">
          <el-input-number
            v-model="form.totalAmount"
            :min="0"
            placeholder="请输入申请金额合计"
            :controls="false"
            :precision="2"
            :disabled="amountDisabled"
            class="inputStyle"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="付款方" label-width="160px" prop="payer">
          <el-input v-model="form.payer" disabled placeholder="选择合同自动填充" class="inputStyle"> </el-input>
        </el-form-item>
        <el-form-item label="收款方" label-width="160px" prop="payee">
          <el-input v-model="form.payee" disabled placeholder="选择合同自动填充" class="inputStyle"> </el-input>
        </el-form-item>
        <el-form-item label="支付时间" label-width="160px" prop="paymentTime">
          <el-date-picker
            v-model="form.paymentTime"
            type="date"
            placeholder="支付时间"
            class="inputStyle"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" label-width="160px" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            class="inputStyle"
            placeholder="备注"
            :autosize="{ minRows: 4, maxRows: 6 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建人 " label-width="160px" prop="creatorName">
          <el-input v-model="form.creatorName" class="inputStyle" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>

    <ContractDialog
      v-if="contractSelectVisible"
      :visible="contractSelectVisible"
      :selectContractId="form.contractId"
      @close="contractSelectVisible = false"
      @submit="handleEmit"
    ></ContractDialog>
  </div>
</template>
<script>
import ContractDialog from './ContractDialog'

export default {
  name: 'BaseForm',
  components: { ContractDialog },
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    amountDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contractSelectVisible: false,
      form: {
        contractId: '',
        contractName: '',
        name: '',
        totalAmount: '',
        paymentTime: '',
        remark: '',
        creatorName: ''
      },
      formRule: {
        contractName: [{ required: true, message: '请选择合同', trigger: 'blur' }],
        name: [{ required: true, message: '请输入付款单名称', trigger: 'blur' }],
        paymentStage: [{ required: true, message: '请选择支付阶段', trigger: 'change' }],
        totalAmount: [
          { required: true, message: '请输入申请金额合计', trigger: 'blur' },
          { type: 'number', message: '申请金额合计必须为数字值' }
        ],
        paymentTime: [{ required: true, message: '请选择支付时间', trigger: 'change' }],
        payer: [{ required: true, message: '请输入付款方', trigger: 'blur' }],
        payee: [{ required: true, message: '请输入收款方', trigger: 'blur' }]
      }
    }
  },
  watch: {
    formData(newVal, oldVal) {
      this.form = { ...newVal }
    }
  },
  created() {
    this.form = this.formData
    this.form.creatorName = this.$store.getters.name || 'admin'
  },
  methods: {
    handleSelectContract() {
      this.contractSelectVisible = true
    },
    // 选择合同回传数据
    handleEmit(row) {
      console.log(111, row)
      this.form.payerId = row.firstPartyId
      this.form.payer = row.firstParty
      this.form.payeeId = row.secondPartyId
      this.form.payee = row.secondParty
      this.form.contractType = row.type
      this.form.contractName = row.name
      this.form.contractId = row.id
      this.contractSelectVisible = false
    },
    submitForm() {
      this.$refs.baseInfoForm.validate(valid => {
        if (valid) {
          this.$emit('submitSuccess', this.form)
        } else {
          this.$emit('submitError', '')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.outerContainer {
  padding: 20px;
}
.formWrapper {
  width: 800px;
  margin: 0 auto;
}
.inputStyle {
  width: 500px;
}
</style>
