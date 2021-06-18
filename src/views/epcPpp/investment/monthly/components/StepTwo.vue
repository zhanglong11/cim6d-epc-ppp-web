<template>
  <div class="outerContainer indexWrapper">
    <el-form ref="baseInfoForm" :model="form" :rules="formRule">
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">
            <div class="formWrapper">
              <el-form-item label="填写说明" label-width="100px" prop="fillingExplanation">
                <el-input
                  v-model="form.fillingExplanation"
                  type="textarea"
                  class="inputStyle"
                  :autosize="{ minRows: 12, maxRows: 24 }"
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
  name: 'StepTwo',
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {},
      id: '',
      finishedStepsArr: [],
      tabIndex: '1',
      doingStepsArr: [],
      formRule: {
        fillingExplanation: [{ required: true, message: '请填写说明', trigger: 'change' }]
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
    this.id = this.$route.params.id
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
        projectId: this.projectId
      }
      if (type === 1) {
        this.finishedStepsArr.push(this.tabIndex)
        let finishedStepsArr = Array.from(new Set(this.finishedStepsArr))
        let doingStepsArr = this.doingStepsArr.filter(item => item !== this.tabIndex).join(',') || ''
        obj = {
          finishedSteps: finishedStepsArr.join(',') || '',
          doingSteps: doingStepsArr,
          projectId: this.projectId
        }
        await this.$refs.baseInfoForm.validate()
      }
      this.loading = true
      this.id ? await Api.getMonthlyUpdate({ ...this.form, ...obj }) : await Api.getMonthlyAdd({ ...this.form, ...obj })
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
