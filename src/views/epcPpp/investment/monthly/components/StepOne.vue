<template>
  <div class="outerContainer indexWrapper">
    <el-form ref="baseInfoForm" :model="form" :rules="formRule">
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">
            <div class="formWrapper">
              <el-form-item label="报告月份" label-width="160px" prop="reportMonth">
                <el-date-picker v-model="form.reportMonth" type="month" placeholder="选择月"> </el-date-picker>
              </el-form-item>
              <el-form-item label="项目公司名称" label-width="160px" prop="name">
                <div>{{ companyName }}</div>
                <!--                <el-input v-model="form.name" placeholder="" class="inputStyle" disabled> </el-input>-->
              </el-form-item>
              <el-form-item label="报告期" label-width="160px" prop="reportStartDate">
                <!--                <DateRange :startTime.sync="form.reportStartDate" :endTime.sync="form.reportEndDate" />-->
                <el-date-picker
                  v-model="reportDateTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="请选择"
                  end-placeholder="请选择"
                  style="width: 300px"
                  value-format="yyyy-MM-dd"
                  @change="handleReportVal"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="编制" label-width="160px" prop="authorId" style="margin-right: 20px">
                <SelectUser
                  :id.sync="form.authorId"
                  :value="form.initAuthorId"
                  :name.sync="form.authorName"
                  :append-to-body="true"
                />
              </el-form-item>
              <!--              <el-form-item label="审核" label-width="160px" prop="copyToPersonIds" style="margin-right: 20px;">-->
              <!--                <SelectUser-->
              <!--                  :id.sync="form.copyToPersonIds"-->
              <!--                  :value="form.copyToPersonIds ? { id: form.copyToPersonIds, label: form.copyToPersonNames } : null"-->
              <!--                  :name.sync="form.copyToPersonNames"-->
              <!--                  :append-to-body="true"-->
              <!--                />-->
              <!--              </el-form-item>-->
              <el-form-item label="报告日期" label-width="160px" prop="reportDate">
                <div>{{ form.reportDate }}</div>
                <!--                <el-input v-model="form.reportDate" class="inputStyle" disabled></el-input>-->
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
import payType from '../../lib/payType'
export default {
  name: 'StepOne',
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
      loading: false,
      id: '',
      finishedStepsArr: [],
      reportDateTime: [],
      tabIndex: 0,
      doingStepsArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      formRule: {
        reportMonth: [{ required: true, message: '请选择报告月份', trigger: 'change' }],
        reportStartDate: [{ required: true, message: '请选择报告月份', trigger: 'change' }],
        authorId: [{ required: true, message: '请选择编制人员', trigger: 'change' }]
      },
      form: {
        name: '',
        reportDate: '',
        authorName: '',
        authorId: '',
        reportStartDate: ''
      },
      payType
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    companyName() {
      return this.$store.state.project.companyName
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.form.reportDate = moment().format('YYYY-MM-DD hh:mm')
      this.id = this.$route.params.id
      if (this.id) {
        Api.getMonthlyDetails(this.id).then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.form.authorId = res.data.authorId.split(',')
            this.form.authorName = res.data.authorName.split(',')
            this.form.initAuthorId = this.form.authorId.map((i, index) => {
              return {
                id: this.form.authorId[index],
                name: this.form.authorName[index]
              }
            })
            this.reportDateTime.push(this.form.reportStartDate, this.form.reportEndDate)
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
      }
    },
    //获取选中日期的值
    handleReportVal(val) {
      this.form.reportStartDate = val[0] || ''
      this.form.reportEndDate = val[1] || ''
    },
    handleCancel() {
      this.$router.back()
    },
    async handleSave(type) {
      this.form.name = this.companyName
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
