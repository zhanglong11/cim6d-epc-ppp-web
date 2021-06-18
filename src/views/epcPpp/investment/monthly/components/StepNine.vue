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
              <el-form-item label="本月风险管理情况" label-width="160px" prop="monthRiskSituation">
                <el-input
                  v-model="form.monthRiskSituation"
                  type="textarea"
                  :autosize="{ minRows: 10, maxRows: 16 }"
                  placeholder="请输入：1、风险名字:(1)风险事件详细描述：(2)：本月管理措施及落实情况：(3)：风险变化趋势："
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="本月新增风险情况" label-width="160px" prop="monthAddRiskSituation">
                <el-input
                  v-model="form.monthAddRiskSituation"
                  type="textarea"
                  :autosize="{ minRows: 10, maxRows: 16 }"
                  placeholder="请输入"
                  class="inputStyle"
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
  name: 'StepNine',
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
      tabIndex: '8',
      doingStepsArr: [],
      formRule: {
        monthRiskSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        monthAddRiskSituation: [{ required: true, message: '必填', trigger: 'blur' }]
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
    }
  },

  created() {
    this.form = this.formData
    this.finishedStepsArr = this.form.finishedSteps.split(',')
    this.doingStepsArr = this.form.doingSteps.split(',')
    // this.init()
  },
  methods: {
    // 初始化
    init() {
      this.id = this.$route.params.id
      if (this.id) {
        Api.getMonthlyDetails(this.id).then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.finishedStepsArr = res.data.finishedSteps.split(',')
            this.doingStepsArr = res.data.doingSteps.split(',')
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
      }
    },
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
