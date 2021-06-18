<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 14">
          <el-form ref="form" :model="form" :rules="rules" label-width="220px" class="form-con">
            <el-form-item label="日期" prop="date">
              {{ form.reportDate }}
            </el-form-item>

            <el-form-item label="天气" prop="models">
              {{ form.weather }}
            </el-form-item>

            <el-form-item label="气温" prop="models">
              {{ form.temperature }}
            </el-form-item>

            <el-form-item label="承包单位人员动态" prop="unit">
              {{ form.supervisorPersonDynamic }}
            </el-form-item>

            <el-form-item label="承包单位人员动态" prop="unit">
              {{ form.contractorDynamic }}
            </el-form-item>

            <el-form-item label="承包单位机械使用情况" prop="location">
              {{ form.contractorMachineDynamic }}
            </el-form-item>

            <el-form-item label="材料进场情况" prop="brand">
              {{ form.materialEnterSituation }}
            </el-form-item>

            <el-form-item label="材料使用情况动态" prop="supplier">
              {{ form.materialUseDynamic }}
            </el-form-item>

            <el-form-item label="质量检查、试验概要" prop="manufacturer">
              {{ form.qualityCheckSummary }}
            </el-form-item>

            <el-form-item label="承包单位提出的问题" prop="remark">
              {{ form.contractorIssue }}
            </el-form-item>

            <el-form-item label="对承包单位提出问题的答复" prop="remark">
              {{ form.contractorIssueReply }}
            </el-form-item>

            <el-form-item label="来往函件记录" prop="remark">
              {{ form.correspondencesRecord }}
            </el-form-item>

            <el-form-item label="主要会议、会谈、洽谈" prop="remark">
              {{ form.mainMeeting }}
            </el-form-item>

            <el-form-item label="承包单位进行/完成的主要工作" prop="remark">
              {{ form.contractorMainWork }}
            </el-form-item>

            <el-form-item label="见证取样记录" prop="remark">
              {{ form.witnessSamplesRecord }}
            </el-form-item>

            <el-form-item label="巡视/旁站/平行检验记录" prop="remark">
              {{ form.patrolInspectionRecord }}
            </el-form-item>

            <el-form-item label="总监理工程师巡视纪要" prop="remark">
              {{ form.chiefSupervisoryPatrolSummary }}
            </el-form-item>

            <el-form-item label="记事" prop="remark">
              {{ form.recordEvents }}
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </component>
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
  props: {
    //是否在弹窗中，用于其它地方弹窗新建设备
    inDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: this.$route.params.id || '',
      isCheck: this.$route.query.isCheck || false,
      form: {},
      rules: {}
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
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
  @include scroll(5px);
}
</style>
