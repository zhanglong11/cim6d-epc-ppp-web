<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
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
            @change="changeDate"
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
        <el-form-item label="施工进度情况" prop="constructionScheduleSituation">
          <el-input v-model="form.constructionScheduleSituation" type="textarea" rows="6" />
        </el-form-item>

        <el-form-item label="下周施工计划" prop="nextConstructionPlan">
          <el-input v-model="form.nextConstructionPlan" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="重大事项" prop="majorEvents">
          <el-input v-model="form.majorEvents" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="质量问题及建议" prop="qualityIssueSuggest">
          <el-input v-model="form.qualityIssueSuggest" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="现场安全生产工作检查记录" prop="safetyCheckRecord">
          <el-input v-model="form.safetyCheckRecord" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="现阶段危险源识别清单" prop="hazardSourceItem">
          <el-input v-model="form.hazardSourceItem" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="现场安全隐患整改落实情况" prop="safetyRectifySituation">
          <el-input v-model="form.safetyRectifySituation" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="疫情防控情况" prop="epidemicPreventionControl">
          <el-input v-model="form.epidemicPreventionControl" type="textarea" rows="4" />
        </el-form-item>

        <el-form-item label="现场形象进度图片" prop="visualScheduleImageIds">
          <FileEdit v-model="form.visualScheduleImageIds" />
        </el-form-item>
      </el-form>
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
        constructionScheduleSituation: '',
        nextConstructionPlan: '',
        qualityIssueSuggest: '',
        safetyRectifySituation: ''
      },
      rules: {
        periodName: { required: true, message: '必填' }
        /*date: { required: true, message: '必填' },
        authorIds: { required: true, message: '必填' },
        constructionScheduleSituation: { required: true, message: '必填' },
        nextConstructionPlan: { required: true, message: '必填' },
        qualityIssueSuggest: { required: true, message: '必填' },
        safetyCheckRecord: { required: true, message: '必填' },
        hazardSourceItem: { required: true, message: '必填' },
        safetyRectifySituation: { required: true, message: '必填' },
        visualScheduleImageIds: { required: true, message: '必填' }*/
      }
    }
  },
  created() {
    const { id } = this.$route.params
    if (!_.isNil(id)) {
      this.id = id
      this.refresh()
    }
  },
  methods: {
    //刷新
    async refresh() {
      const res = await Api.detail(this.id)
      const cloneData = res.data
      cloneData.date = [cloneData.startDate, cloneData.endDate]
      this.form = cloneData
      this.isFirst = true
    },
    async getProgress(param) {
      const res = await Api.progressInfo(param)
      const cloneData = _.cloneDeep(res.data)
      let str = ``
      if (cloneData && cloneData.baseList && cloneData.baseList.length) {
        cloneData.baseList.map((r, i) => {
          str += `${i + 1}.${r.synthesisTaskName} \n`
        })
        this.form.constructionScheduleSituation = str
      } else {
        this.form.constructionScheduleSituation = ''
      }
    },
    async getNextProgress(param) {
      const res = await Api.progressInfo(param)
      const cloneData = _.cloneDeep(res.data)
      let str = ``
      if (cloneData && cloneData.baseList && cloneData.baseList.length) {
        cloneData.baseList.map((r, i) => {
          str += `${i + 1}.${r.synthesisTaskName} \n`
        })
        this.form.nextConstructionPlan = str
      } else {
        this.form.nextConstructionPlan = ''
      }
    },
    //获取质量信息
    async getQualityInfo(param) {
      const res = await Api.qualityList(param)
      const cloneData = _.cloneDeep(res.data)
      let str = ``
      if (cloneData && cloneData.records && cloneData.records.length) {
        cloneData.records.map((r, i) => {
          str += `${i + 1}.${r.description} \n`
        })
        this.form.qualityIssueSuggest = str
      } else {
        this.form.qualityIssueSuggest = ''
      }
    },

    //获取安全信息
    async getSafeInfo(param) {
      const res = await Api.safeList(param)
      const cloneData = _.cloneDeep(res.data)
      let str = ``
      if (cloneData && cloneData.records && cloneData.records.length) {
        cloneData.records.map((r, i) => {
          str += `${i + 1}.${r.description} \n`
        })
        this.form.safetyRectifySituation = str
      } else {
        this.form.safetyRectifySituation = ''
      }
    },
    changeDate(v) {
      let beginDate = moment(v[0]).format('YYYY-MM-DD 00:00:00')
      let endDate = moment(v[1]).format('YYYY-MM-DD 00:00:00')
      this.getProgress({
        startDate: beginDate,
        endDate: endDate,
        page: 1,
        rows: 100
      })
      this.getNextProgress({
        startDate: moment(v[0]).add('days', 7).format('YYYY-MM-DD 00:00:00'),
        endDate: moment(v[1]).add('days', 7).format('YYYY-MM-DD 00:00:00')
      })
      this.getQualityInfo({
        beginDate,
        endDate,
        page: 1,
        rows: 100
      })
      this.getSafeInfo({
        beginDate,
        endDate,
        page: 1,
        rows: 100
      })
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
.form-con {
  width: 900px;
}
</style>
