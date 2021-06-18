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
              <el-form-item label="形象进度文字描述" label-width="160px" prop="visualProgressDescription">
                <el-input
                  v-model="form.visualProgressDescription"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="现场照片（项目全景、住里面、重点部位）"
                label-width="160px"
                prop="visualProgressFileIds"
              >
                <Upload v-model="form.visualProgressFileIds" multiple isOnlyButton btnText="上传图片"> </Upload>
              </el-form-item>
              <el-form-item label="存在问题" label-width="160px" prop="visualProgressIssue">
                <el-input
                  v-model="form.visualProgressIssue"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="解决措施" label-width="160px" prop="visualProgressMeasure">
                <el-input
                  v-model="form.visualProgressMeasure"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
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
  name: 'StepEighty',
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
      tabIndex: '7',
      doingStepsArr: [],
      formRule: {
        visualProgressDescription: [{ required: true, message: '必填', trigger: 'blur' }],
        visualProgressFileIds: [{ required: true, message: '必填', trigger: 'blur' }],
        visualProgressIssue: [{ required: true, message: '必填', trigger: 'blur' }],
        visualProgressMeasure: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      form: {}
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
