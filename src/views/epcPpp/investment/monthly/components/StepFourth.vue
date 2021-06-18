<template>
  <div class="outerContainer indexWrapper">
    <el-form ref="baseInfoForm" :model="form" :rules="formRule">
      <el-card shadow="never">
        <el-row>
          <el-col :span="18">
            <div class="formWrapper">
              <el-form-item label="报告期" label-width="160px">
                <div>{{ form.reportDate }}</div>
              </el-form-item>
              <el-form-item label="建安产值完成情况" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="本月计划确认建安产值" label-width="165px" prop="monthPlanConfirmProductValue">
                    <el-input v-model="form.monthPlanConfirmProductValue" placeholder="请输入" class="inputStyle">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="本月实际完成建安产值" label-width="165px" prop="monthFinishProductValue">
                    <el-input v-model="form.monthFinishProductValue" placeholder="请输入" class="inputStyle"></el-input>
                  </el-form-item>
                  <el-form-item label="本月确认建安产值" label-width="165px" prop="monthConfirmProductValue">
                    <el-input
                      v-model="form.monthConfirmProductValue"
                      placeholder="请输入"
                      class="inputStyle"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="本年累计确认建安产值" label-width="165px" prop="yearTotalConfirmProductValue">
                    <el-input
                      v-model="form.yearTotalConfirmProductValue"
                      placeholder="请输入"
                      class="inputStyle"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="投资回报完成情况" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item
                    label="本月计划确认投资回报"
                    label-width="165px"
                    prop="monthPlanConfirmInvestmentReturn"
                  >
                    <el-input v-model="form.monthPlanConfirmInvestmentReturn" placeholder="请输入" class="inputStyle">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="本月确认投资回报" label-width="165px" prop="monthConfirmReturnedMoney">
                    <el-input
                      v-model="form.monthConfirmInvestmentReturn"
                      placeholder="请输入"
                      class="inputStyle"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="本年累计确认投资回报" label-width="165px" prop="yearTotalConfirmReturnedMoney">
                    <el-input
                      v-model="form.yearTotalConfirmInvestmentReturn"
                      placeholder="请输入"
                      class="inputStyle"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="回款完成情况" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="本月计划回款" label-width="165px" prop="monthPlanReturnedMoney">
                    <el-input v-model="form.monthPlanReturnedMoney" placeholder="请输入" class="inputStyle"> </el-input>
                  </el-form-item>
                  <el-form-item label="本月实际回款" label-width="165px" prop="monthConfirmReturnedMoney">
                    <el-input
                      v-model="form.monthConfirmReturnedMoney"
                      placeholder="请输入"
                      class="inputStyle"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="本年累计回款" label-width="165px" prop="yearTotalConfirmReturnedMoney">
                    <el-input
                      v-model="form.yearTotalConfirmReturnedMoney"
                      placeholder="请输入"
                      class="inputStyle"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="备注" label-width="160px" prop="operatingIndexRemark">
                <el-input
                  v-model="form.operatingIndexRemark"
                  type="textarea"
                  class="inputStyle"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  style="width: 60%"
                ></el-input>
              </el-form-item>
              <el-form-item label="重要情况说明" label-width="160px" prop="operatingIndexImportantExplanation">
                <el-input
                  v-model="form.operatingIndexImportantExplanation"
                  type="textarea"
                  class="inputStyle"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                  style="width: 60%"
                ></el-input>
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
  name: 'StepFourth',
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      uploadVisible: false,
      formRule: {
        monthPlanConfirmProductValue: [{ required: true, message: '必填', trigger: 'blur' }],
        monthFinishProductValue: [{ required: true, message: '必填', trigger: 'blur' }],
        monthConfirmProductValue: [{ required: true, message: '必填', trigger: 'blur' }],
        yearTotalConfirmProductValue: [{ required: true, message: '必填', trigger: 'blur' }],
        monthPlanConfirmInvestmentReturn: [{ required: true, message: '必填', trigger: 'blur' }],
        monthConfirmInvestmentReturn: [{ required: true, message: '必填', trigger: 'blur' }],
        yearTotalConfirmInvestmentReturn: [{ required: true, message: '必填', trigger: 'blur' }],
        monthPlanReturnedMoney: [{ required: true, message: '必填', trigger: 'blur' }],
        monthConfirmReturnedMoney: [{ required: true, message: '必填', trigger: 'blur' }],
        yearTotalConfirmReturnedMoney: [{ required: true, message: '必填', trigger: 'blur' }],
        operatingIndexRemark: [{ required: true, message: '必填', trigger: 'blur' }],
        operatingIndexImportantExplanation: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      finishedStepsArr: [],
      tabIndex: '3',
      doingStepsArr: [],
      form: {
        name: '',
        reportDate: ''
      },
      tableData: []
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
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
