<template>
  <div class="container no-padding">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px" class="form-con">
        <el-form-item label="日期" prop="reportDate">
          <el-date-picker v-model="form.reportDate" value-format="yyyy-MM-dd" style="width: 100%" />
        </el-form-item>

        <el-form-item label="最高温度" prop="maximumTemperature">
          <el-input v-model="form.maximumTemperature" class="form-input" />
        </el-form-item>

        <el-form-item label="最低温度" prop="minimumTemperature">
          <el-input v-model="form.minimumTemperature" class="form-input" />
        </el-form-item>

        <el-form-item label="风力" prop="windPower">
          <el-input v-model="form.windPower" class="form-input" />
        </el-form-item>

        <el-form-item label="风向" prop="windDirection">
          <el-input v-model="form.windDirection" class="form-input" />
        </el-form-item>

        <el-form-item label="上午天气" prop="morningWeather">
          <el-input v-model="form.morningWeather" class="form-input" />
        </el-form-item>

        <el-form-item label="下午天气" prop="afternoonWeather">
          <el-input v-model="form.afternoonWeather" class="form-input" />
        </el-form-item>

        <el-form-item label="形象进度" prop="visualSchedule">
          <el-input v-model="form.visualSchedule" class="form-input" />
        </el-form-item>

        <el-form-item label="生产情况记录" prop="productionSituationRecord">
          <el-input
            v-model="form.productionSituationRecord"
            type="textarea"
            rows="4"
            placeholder="部位、项目、机械作业、班组工作，生产存在问题等"
          />
        </el-form-item>

        <el-form-item label="技术质量安全工作记录" prop="qualitySafetyRecord">
          <el-input
            v-model="form.qualitySafetyRecord"
            type="textarea"
            rows="4"
            placeholder="技术质量安全活动，技术质量安全问题，检查评定验收等"
          />
        </el-form-item>

        <el-form-item label="材料、构配件进场记录" prop="materialEnterRecord">
          <el-input v-model="form.materialEnterRecord" type="textarea" rows="4" />
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
        /* maximumTemperature: { required: true, message: '必填' },
        minimumTemperature: { required: true, message: '必填' },
        windPower: { required: true, message: '必填' },
        windDirection: { required: true, message: '必填' },
        morningWeather: { required: true, message: '必填' },
        afternoonWeather: { required: true, message: '必填' },
        visualSchedule: { required: true, message: '必填' },
        productionSituationRecord: { required: true, message: '必填' },
        qualitySafetyRecord: { required: true, message: '必填' }*/
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
    //更新
    async refresh() {
      const res = await Api.detail(this.id)
      this.form = res.data
    },
    //获取天气数据
    async getWeather() {
      let params = {
        projectId: localStorage.getItem('projectId')
      }
      let result = await this.axios.post(`/weather/info`, params)
      const weatherInfo = result.data
      this.form = {
        reportDate: moment().format('YYYY-MM-DD'),
        maximumTemperature: weatherInfo.highTemperature,
        minimumTemperature: weatherInfo.lowTemperature,
        morningWeather: weatherInfo.weather,
        afternoonWeather: weatherInfo.weather,
        windDirection: weatherInfo.windDirection,
        windPower: weatherInfo.windPower
      }
    },
    //提交
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
    //返回
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
