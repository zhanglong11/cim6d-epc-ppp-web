<template>
  <div class="container no-padding">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" label-width="220px" class="form-con">
        <el-form-item label="日期" prop="reportDate">
          <el-date-picker v-model="form.reportDate" value-format="yyyy-MM-dd" style="width: 100%" />
        </el-form-item>

        <el-form-item label="天气" prop="weather">
          <el-input v-model="form.weather" class="form-input" />
        </el-form-item>

        <el-form-item label="气温" prop="temperature">
          <el-input v-model="form.temperature" class="form-input" />
        </el-form-item>

        <el-form-item label="监理人员动态" prop="supervisorPersonDynamic">
          <el-input v-model="form.supervisorPersonDynamic" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="承包单位人员动态" prop="contractorDynamic">
          <el-input v-model="form.contractorDynamic" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="承包单位机械使用情况" prop="contractorMachineDynamic">
          <el-input v-model="form.contractorMachineDynamic" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="材料进场情况" prop="materialEnterSituation">
          <el-input v-model="form.materialEnterSituation" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="材料使用情况动态" prop="materialUseDynamic">
          <el-input v-model="form.materialUseDynamic" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="质量检查、试验概要" prop="qualityCheckSummary">
          <el-input v-model="form.qualityCheckSummary" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="承包单位提出的问题" prop="contractorIssue">
          <el-input v-model="form.contractorIssue" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="对承包单位提出问题的答复" prop="contractorIssueReply">
          <el-input v-model="form.contractorIssueReply" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="来往函件记录" prop="correspondencesRecord">
          <el-input v-model="form.correspondencesRecord" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="主要会议、会谈、洽谈" prop="mainMeeting">
          <el-input v-model="form.mainMeeting" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="承包单位进行/完成的主要工作" prop="contractorMainWork">
          <el-input v-model="form.contractorMainWork" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="见证取样记录" prop="witnessSamplesRecord">
          <el-input v-model="form.witnessSamplesRecord" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="巡视/旁站/平行检验记录" prop="patrolInspectionRecord">
          <el-input
            v-model="form.patrolInspectionRecord"
            type="textarea"
            placeholder="工程部位、时间、存在问题、处理措施"
            rows="4"
          />
        </el-form-item>

        <el-form-item label="总监理工程师巡视纪要" prop="chiefSupervisoryPatrolSummary">
          <el-input v-model="form.chiefSupervisoryPatrolSummary" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="记事" prop="recordEvents">
          <el-input v-model="form.recordEvents" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item label="附件" prop="fileIds">
          <Upload v-model="form.fileIds" class="form-input" isOnlyButton multiple>
            <div slot="btn">
              <el-button size="mini"
                ><i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px"></i>上传附件</el-button
              >
            </div>
          </Upload>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-promise-btn size="lg" type="primary" @click="submit(null)">保存</el-button>
      <el-button v-promise-btn size="lg" type="primary" @click="submit(true)">提交并审核</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api'
export default {
  name: 'Edit',
  props: {},
  data() {
    return {
      id: null,
      form: {},
      rules: {
        reportDate: { required: true, message: '必填' }
      }
    }
  },
  created() {
    const { id } = this.$route.params
    if (!_.isNil(id)) {
      this.id = id
      this.refresh()
      return
    }
    this.getWeather()
  },
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      this.form = res.data
    },
    async getWeather() {
      let params = {
        projectId: localStorage.getItem('projectId')
      }
      let result = await this.axios.post(`/weather/info`, params)
      const weatherInfo = result.data
      console.log(weatherInfo)
      this.form = {
        reportDate: moment().format('YYYY-MM-DD'),
        weather: weatherInfo.weather,
        temperature: weatherInfo.temperature
      }
    },

    async submit(isAudit) {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      if (isAudit) {
        await Api.submit(form)
      } else {
        _.isNil(this.id) ? await Api.add(form) : await Api.update({ ...form, ...{ id: this.id } })
      }
      this.$message.success('操作成功')
      this.goBack()
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin';
.form-con {
  width: 700px;
}
</style>
