<template>
  <div class="outerContainer indexWrapper">
    <el-form ref="baseInfoForm" :model="form" :rules="formRule">
      <el-card shadow="never">
        <el-row>
          <el-col :span="18">
            <div class="formWrapper">
              <el-form-item label="项目名称" label-width="160px" prop="name">
                <div>{{ projectName }}</div>
                <!--                <el-input v-model="form.name" placeholder="请输入" class="inputStyle"> </el-input>-->
              </el-form-item>
              <el-form-item label="报告期" label-width="160px">
                <div>{{ form.reportDate }}</div>
              </el-form-item>
              <el-form-item label="合作方（政府方）" label-width="160px" prop="partner">
                <el-input v-model="form.partner" placeholder="请输入" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="项目公司设计情况" label-width="160px" prop="designSituation">
                <el-input
                  v-model="form.designSituation"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="总包单位" label-width="160px" prop="mainContractorCompany">
                <el-input v-model="form.mainContractorCompany" placeholder="请输入" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="项目概况" label-width="160px" prop="projectSituation">
                <el-input
                  v-model="form.projectSituation"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="投资项目要点" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="合同形式" label-width="150px" prop="projectContractForm">
                    <el-input v-model="form.projectContractForm" placeholder="请输入" class="inputStyle"> </el-input>
                  </el-form-item>
                  <el-form-item label="签署日期" label-width="150px" prop="projectSignDate">
                    <el-date-picker
                      v-model="form.projectSignDate"
                      type="date"
                      placeholder="请选择签订日期"
                      class="inputStyle"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="合同期限及内容" label-width="150px" prop="projectContractDeadline">
                    <el-input
                      v-model="form.projectContractDeadline"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="回报机制（构成、支付）" label-width="150px" prop="projectReportingStandards">
                    <el-input
                      v-model="form.projectReportingStandards"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="主要违约罚则" label-width="150px" prop="projectMainBreachPenalty">
                    <el-input
                      v-model="form.projectMainBreachPenalty"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="总包合同要点" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="合同形式" label-width="150px" prop="contractorContractForm">
                    <el-input v-model="form.contractorContractForm" placeholder="请输入" class="inputStyle"> </el-input>
                  </el-form-item>
                  <el-form-item label="签署日期" label-width="150px" prop="contractorSignDate">
                    <el-date-picker
                      v-model="form.contractorSignDate"
                      type="date"
                      placeholder="请选择签订日期"
                      class="inputStyle"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="施工让利" label-width="150px" prop="contractorConstructionBenefits">
                    <el-input
                      v-model="form.contractorConstructionBenefits"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="工程款支付方式" label-width="150px" prop="contractorPayMoneyType">
                    <el-input
                      v-model="form.contractorPayMoneyType"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="履约担保（额度、方式）"
                    label-width="150px"
                    prop="contractorPerformanceGuarantee"
                  >
                    <el-input
                      v-model="form.contractorPerformanceGuarantee"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="工期" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="合同工期" label-width="150px" prop="contractDuration">
                    <el-input v-model="form.contractDuration" placeholder="请输入" class="inputStyle"> </el-input>
                  </el-form-item>
                  <el-form-item label="实际开工日期" label-width="150px" prop="actualStartDate">
                    <el-input v-model="form.actualStartDate" placeholder="请输入" class="inputStyle"> </el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="本年度经营目标情况" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="产值目标" label-width="150px" prop="productValueTarget">
                    <el-input
                      v-model="form.productValueTarget"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @change="handleRroductValue"
                    ></el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="产值完成情况" label-width="150px" prop="productValueFinishSituation">
                    <el-input
                      v-model="form.productValueFinishSituation"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @change="handleRroductValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="产值完成比例" label-width="150px" prop="productValueFinishPercentage">
                    <el-input
                      v-model="form.productValueFinishPercentage"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      disabled
                      @change="handleRroductValue"
                    >
                    </el-input>
                    %
                  </el-form-item>
                  <el-form-item label="投资回报目标" label-width="150px" prop="investmentReturnTarget">
                    <el-input
                      v-model="form.investmentReturnTarget"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @change="handleInvestmentValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="投资回报完成情况" label-width="150px" prop="investmentReturnFinishSituation">
                    <el-input
                      v-model="form.investmentReturnFinishSituation"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @change="handleInvestmentValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="投资回报完成比例" label-width="150px" prop="investmentReturnFinishPercentage">
                    <el-input
                      v-model="form.investmentReturnFinishPercentage"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      disabled
                      @change="handleInvestmentValue"
                    >
                    </el-input>
                    %
                  </el-form-item>
                  <el-form-item label="回款目标" label-width="150px" prop="returnedMoneyTarget">
                    <el-input
                      v-model="form.returnedMoneyTarget"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @change="handleReturnedMoneyValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="回款完成情况" label-width="150px" prop="returnedMoneyFinishSituation">
                    <el-input
                      v-model="form.returnedMoneyFinishSituation"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @change="handleReturnedMoneyValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="回款完成比例" label-width="150px" prop="returnedMoneyFinishPercentage">
                    <el-input
                      v-model="form.returnedMoneyFinishPercentage"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      disabled
                      @change="handleReturnedMoneyValue"
                    >
                    </el-input>
                    %
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="重要情况说明" label-width="150px" prop="basicImportantExplanation">
                <el-input
                  v-model="form.basicImportantExplanation"
                  placeholder="请输入"
                  class="inputStyle"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                >
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <div class="footerButton">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSave(0)">保存草稿</el-button>
        <el-button type="primary" @click="handleSave(1)">提交本页</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import Api from '../../api'
export default {
  name: 'StepThree',
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isSave: true,
      isEdit: false,
      uploadVisible: false,
      finishedStepsArr: [],
      tabIndex: '2',
      doingStepsArr: [],
      formRule: {
        partner: [{ required: true, message: '必填', trigger: 'blur' }],
        designSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        mainContractorCompany: [{ required: true, message: '必填', trigger: 'blur' }],
        projectSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        projectContractForm: [{ required: true, message: '必填', trigger: 'blur' }],
        projectSignDate: [{ required: true, message: '必填', trigger: 'blur' }],
        projectContractDeadline: [{ required: true, message: '必填', trigger: 'blur' }],
        projectReportingStandards: [{ required: true, message: '必填', trigger: 'blur' }],
        projectMainBreachPenalty: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorContractForm: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorSignDate: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorConstructionBenefits: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorPayMoneyType: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorPerformanceGuarantee: [{ required: true, message: '必填', trigger: 'blur' }],
        contractDuration: [{ required: true, message: '必填', trigger: 'blur' }],
        actualStartDate: [{ required: true, message: '必填', trigger: 'blur' }],
        productValueTarget: [{ required: true, message: '必填', trigger: 'blur' }],
        productValueFinishSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        productValueFinishPercentage: [{ required: true, message: '必填', trigger: 'blur' }],
        investmentReturnTarget: [{ required: true, message: '必填', trigger: 'blur' }],
        investmentReturnFinishSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        investmentReturnFinishPercentage: [{ required: true, message: '必填', trigger: 'blur' }],
        returnedMoneyTarget: [{ required: true, message: '必填', trigger: 'blur' }],
        returnedMoneyFinishSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        returnedMoneyFinishPercentage: [{ required: true, message: '必填', trigger: 'blur' }],
        basicImportantExplanation: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      form: {
        name: '',
        reportDate: ''
      }
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    projectName() {
      return this.$store.state.project.projectName
    }
  },

  created() {
    this.form = this.formData
    this.finishedStepsArr = this.form.finishedSteps.split(',')
    this.doingStepsArr = this.form.doingSteps.split(',')
  },
  methods: {
    handleCancel() {
      this.$router.back()
    },
    //产值完成比例
    handleRroductValue(e) {
      this.form.productValueFinishPercentage = this.percentage(
        this.form.productValueFinishSituation,
        this.form.productValueTarget
      )
    },
    //投资回报目标占比
    handleInvestmentValue(e) {
      this.form.investmentReturnFinishPercentage = this.percentage(
        this.form.investmentReturnFinishSituation,
        this.form.investmentReturnTarget
      )
    },
    //回款完成比例
    handleReturnedMoneyValue(e) {
      this.form.returnedMoneyFinishPercentage = this.percentage(
        this.form.returnedMoneyFinishSituation,
        this.form.returnedMoneyTarget
      )
    },
    //计算百分比
    percentage(num, total) {
      if (num === 0 || total === 0) {
        return 0
      }
      return Math.round((num / total) * 10000) / 100.0 // 小数点后两位百分比
    },
    async handleSave(type) {
      let obj = {
        finishedSteps: this.finishedStepsArr.join(',') || '',
        doingSteps: this.doingStepsArr.join(',') || '',
        projectId: this.projectId,
        id: this.form.extraId
      }
      if (type === 1) {
        this.finishedStepsArr.push(this.tabIndex)
        let finishedStepsArr = Array.from(new Set(this.finishedStepsArr))
        let doingStepsArr = this.doingStepsArr.filter(item => item !== this.tabIndex)
        obj = {
          finishedSteps: finishedStepsArr.join(',') || '',
          doingSteps: doingStepsArr.join(',') || '',
          projectId: this.projectId,
          id: this.form.extraId
        }
        await this.$refs.baseInfoForm.validate()
      }
      this.loading = true
      await Api.getMonthlyExtendUpdate({ ...this.form, ...obj })
      this.$message.success('保存成功')
      this.loading = false
      this.$router.back()
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
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
