<template>
  <div class="outerContainer indexWrapper">
    <el-form ref="baseInfoForm" :model="form" :rules="formRule">
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">
            <div class="formWrapper">
              <el-form-item label="项目公司名称" label-width="140px" prop="content">
                <div>{{ companyName }}</div>
              </el-form-item>
              <el-form-item label="详细表格" label-width="140px" prop="childOperatingIndexFileIds">
                <Upload v-model="form.childOperatingIndexFileIds" :accept="accept" isOnlyButton btnText="上传表格">
                  <span style="color: #ff2600"> *当前表格过于庞大，不适合线上填写，请下载模板线下填写后，上传表格</span>
                </Upload>
              </el-form-item>
              <el-form-item label="" label-width="140px">
                <el-button type="primary"><a href="/doc/设备清单导入.xlsx" download>下载表格模板</a></el-button>
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
  name: 'StepFive',
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {},
      finishedStepsArr: [],
      tabIndex: '4',
      doingStepsArr: [],
      formRule: {
        childOperatingIndexFileIds: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      accept: '.xlsx,.xls'
    }
  },
  computed: {
    companyName() {
      return this.$store.state.project.companyName
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

<style scoped></style>
