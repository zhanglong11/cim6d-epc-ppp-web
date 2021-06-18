<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 12">
          <el-form ref="form" :model="form" :rules="rules" label-width="200px" class="form-con">
            <el-form-item label="周报期号" prop="periodName">
              <el-input v-model="form.periodName" />
            </el-form-item>

            <el-form-item label="报告期" prop="date">
              <el-date-picker
                v-model="form.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="编制" prop="authorIds">
              <SelectUser
                :id.sync="form.authorIds"
                :value="form.authorIds ? form.authorIds.split(',').map(id => ({ id })) : []"
                :name.sync="form.authorNames"
                :append-to-body="true"
              />
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
            <el-form-item label="本周工作完成情况" prop="workFinishSituation">
              <el-input v-model="form.workFinishSituation" type="textarea" rows="4" />
            </el-form-item>

            <el-form-item label="下周工作计划" prop="nextWorkPlan">
              <el-input v-model="form.nextWorkPlan" type="textarea" rows="4" />
            </el-form-item>

            <el-form-item label="工程质量情况" prop="qualitySituation">
              <el-input v-model="form.qualitySituation" type="textarea" rows="4" />
            </el-form-item>

            <el-form-item label="工程安全文明情况" prop="securityCivilization">
              <el-input v-model="form.securityCivilization" type="textarea" rows="4" />
            </el-form-item>

            <el-form-item label="现场形象进度图片" prop="visualScheduleImageIds">
              <FileEdit v-model="form.visualScheduleImageIds" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
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
  props: {
    //是否在弹窗中，用于其它地方弹窗新建设备
    inDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      form: {
        authorIds: ''
      },
      rules: {
        periodName: { required: true, message: '必填' }
      }
    }
  },
  created() {
    const { id } = this.$route.params
    if (!_.isNil(id)) {
      this.id = id
      this.refresh()
    } else {
      this.getLastInfo()
    }
  },
  methods: {
    //刷新
    async refresh() {
      const res = await Api.detail(this.id)
      const cloneData = res.data
      console.log(cloneData.authorIds.split(',').map(id => ({ id })))
      cloneData.date = [cloneData.startDate, cloneData.endDate]
      this.form = cloneData
    },
    //获取上周情况
    async getLastInfo() {
      const res = await Api.lastInfo({})
      if (_.isNil(res.data)) {
        return
      }
      this.form = {
        ...this.form,
        ...{
          workFinishSituation: res.data?.workFinishSituation || ''
        }
      }
    },
    //提交
    async submit(isAudit) {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      form.startDate = form.date[0]
      form.endDate = form.date[1]
      delete form.date
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
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
  @include scroll(5px);
}
</style>
