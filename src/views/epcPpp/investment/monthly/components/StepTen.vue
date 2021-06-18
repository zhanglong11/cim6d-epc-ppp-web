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
              <el-form-item label="上月存在问题改进情况" label-width="165px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item
                    v-for="(domain, index) in domains"
                    :key="index"
                    label-width="80px"
                    :label="'问题' + (index + 1)"
                    :prop="'domains.' + index + '.value'"
                  >
                    <!--                    :rules="[-->
                    <!--                    {-->
                    <!--                    required: true,-->
                    <!--                    message: '问题不能为空',-->
                    <!--                    trigger: 'blur'-->
                    <!--                    }-->
                    <!--                    ]"-->
                    <el-input v-model="domain.value"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addDomain">新增问题</el-button>
                    <span style="color: rgb(236, 16, 16)"
                      >*包含对上月公司《投资业务运营情况分析报告》中提出的问题和要求进行回复。</span
                    >
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="下月重点工作计划" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="1、工程进度计划" label-width="130px" prop="nextProjectSchedulePlan">
                    <el-input v-model="form.nextProjectSchedulePlan" placeholder="请输入" class="inputStyle">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="2、产值计划" label-width="130px" prop="nextProductValuePlan">
                    <el-date-picker
                      v-model="form.nextProductValuePlan"
                      type="date"
                      placeholder="请选择签订日期"
                      class="inputStyle"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="3、回款计划" label-width="130px" prop="nextReturnedMoneyPlan">
                    <el-input
                      v-model="form.nextReturnedMoneyPlan"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="4、融资计划" label-width="130px" prop="nextFinancingPlan">
                    <el-input
                      v-model="form.nextFinancingPlan"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="5、其他重点工作计划" label-width="130px" prop="nextOtherImportantPlan">
                    <el-input
                      v-model="form.nextOtherImportantPlan"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="存在主要问题" label-width="165px" prop="existsMainIssue">
                <el-input
                  v-model="form.existsMainIssue"
                  placeholder="请输入"
                  class="inputStyle"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="需公司协调解决的问题" label-width="165px" prop="coordinatelySolveIssue">
                <el-input
                  v-model="form.coordinatelySolveIssue"
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
        <el-button type="primary" @click="handleSubmit">提交月报开始审核</el-button>
      </div>
    </el-form>
    <!-- 审核组件 start -->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <!-- 审核组件 end -->
  </div>
</template>
<script>
import Api from '../../api'
export default {
  name: 'StepTen',
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
      paymentId: '',
      id: '',
      finishedStepsArr: [],
      tabIndex: '9',
      doingStepsArr: [],
      form: {
        name: '',
        reportDate: ''
      },
      domains: [
        {
          value: ''
        }
      ],
      formRule: {
        nextProjectSchedulePlan: [{ required: true, message: '必填', trigger: 'blur' }],
        nextProductValuePlan: [{ required: true, message: '必填', trigger: 'blur' }],
        nextReturnedMoneyPlan: [{ required: true, message: '必填', trigger: 'blur' }],
        nextFinancingPlan: [{ required: true, message: '必填', trigger: 'blur' }],
        nextOtherImportantPlan: [{ required: true, message: '必填', trigger: 'blur' }],
        existsMainIssue: [{ required: true, message: '必填', trigger: 'blur' }],
        coordinatelySolveIssue: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    isCheck() {
      return this.$route.params.isCheck
    }
  },

  created() {
    this.id = this.$route.params.id
    this.form = this.formData
    this.finishedStepsArr = this.form.finishedSteps.split(',')
    this.doingStepsArr = this.form.doingSteps.split(',')
    this.domains = this.form.lastMonthIssue.split(',').map(item => {
      return {
        value: item
      }
    })
  },
  methods: {
    //取消
    handleCancel() {
      this.$router.back()
    },
    //保存
    async handleSave(type) {
      let obj = {
        finishedSteps: this.finishedStepsArr.join(',') || '',
        doingSteps: this.doingStepsArr.join(',') || '',
        projectId: this.projectId,
        id: this.form.extraId
      }

      let pro = this.domains.map(item => item.value)
      this.form.lastMonthIssue = pro.join(',') || ''
      if (type === 1) {
        this.finishedStepsArr.push(this.tabIndex)
        let finishedStepsArr = Array.from(new Set(this.finishedStepsArr))
        let doingStepsArr = this.doingStepsArr.filter(item => item !== this.tabIndex)
        obj = {
          finishedSteps: finishedStepsArr.join(',') || '',
          doingSteps: doingStepsArr.join(',') || '',
          projectId: this.projectId,
          id: this.form.extraId,
          status: 1
        }
        await this.$refs.baseInfoForm.validate()
      }
      this.loading = true
      await Api.getMonthlyExtendUpdate({ ...this.form, ...obj })
      this.$message.success('保存成功')
      this.loading = false
      this.$router.back()
    },
    //添加问题
    addDomain() {
      this.domains.push({
        value: ''
        // key: Date.now()
      })
    },
    //提交审核
    handleSubmit() {
      this.$refs.checkCard.audit()
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
