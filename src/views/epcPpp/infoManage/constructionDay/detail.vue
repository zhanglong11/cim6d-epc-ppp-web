<template>
  <div class="container no-padding">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="14">
          <el-form ref="form" :model="form" label-width="180px" class="form-con">
            <el-form-item label="日期" prop="date">
              {{ form.reportDate }}
            </el-form-item>

            <el-form-item label="最高温度" prop="models">
              {{ form.maximumTemperature }}
            </el-form-item>

            <el-form-item label="最低温度" prop="models">
              {{ form.minimumTemperature }}
            </el-form-item>

            <el-form-item label="风力" prop="unit">
              {{ form.windPower }}
            </el-form-item>

            <el-form-item label="风向" prop="location">
              {{ form.windDirection }}
            </el-form-item>

            <el-form-item label="上午" prop="brand">
              {{ form.morningWeather }}
            </el-form-item>

            <el-form-item label="下午" prop="supplier">
              {{ form.afternoonWeather }}
            </el-form-item>

            <el-form-item label="形象进度" prop="manufacturer">
              {{ form.visualSchedule }}
            </el-form-item>

            <el-form-item label="生产情况记录" prop="remark">
              {{ form.productionSituationRecord }}
            </el-form-item>

            <el-form-item label="技术质量安全工作记录" prop="remark">
              {{ form.qualitySafetyRecord }}
            </el-form-item>

            <el-form-item label="材料、构配件进场记录" prop="remark">
              {{ form.materialEnterRecord }}
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <!-- 审核组件 start -->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <!-- 审核组件 end -->

    <div class="footerButton">
      <el-button v-if="!isCheck" @click="goBack">返回</el-button>
      <template v-else>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
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
      id: this.$route.params.id || '',
      isCheck: this.$route.query.isCheck || false,
      form: {}
    }
  },
  created() {
    if (this.id) {
      this.refresh()
    }
  },
  methods: {
    //刷新
    async refresh() {
      const res = await Api.detail(this.id)
      this.form = res.data
    },
    //返回
    goBack() {
      this.$router.back()
    },
    handleSubmit() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin';
</style>
