<template>
  <div class="container no-padding">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="14">
          <el-form ref="form" :model="form" label-width="200px" class="form-con">
            <el-form-item label="周报期号" prop="periodName"> {{ form.periodName }} </el-form-item>

            <el-form-item label="报告期" prop="models"> {{ form.startDate }}~{{ form.endDate }} </el-form-item>

            <el-form-item label="编制" prop="models">
              {{ form.authorNames }}
            </el-form-item>

            <el-form-item label="报告日期" prop="unit">
              {{ form.createTime }}
            </el-form-item>

            <el-form-item label="施工进度情况" prop="location">
              {{ form.constructionScheduleSituation }}
            </el-form-item>

            <el-form-item label="下周施工计划" prop="brand">
              {{ form.nextConstructionPlan }}
            </el-form-item>

            <el-form-item label="重大事项" prop="majorEvents">
              {{ form.majorEvents }}
            </el-form-item>

            <el-form-item label="质量问题及建议" prop="manufacturer">
              {{ form.qualityIssueSuggest }}
            </el-form-item>

            <el-form-item label="现场安全生产工作检查记录" prop="remark">
              {{ form.safetyCheckRecord }}
            </el-form-item>

            <el-form-item label="现阶段危险源识别清单" prop="remark">
              {{ form.hazardSourceItem }}
            </el-form-item>

            <el-form-item label="现场安全隐患整改落实情况" prop="remark">
              {{ form.safetyRectifySituation }}
            </el-form-item>
            <el-form-item label="疫情防控情况" prop="remark">
              {{ form.epidemicPreventionControl }}
            </el-form-item>
            <el-form-item label="现场形象进度图片" prop="remark">
              <FileList :ids="form.visualScheduleImageIds" />
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
