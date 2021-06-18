<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane name="cover">
        <span slot="label">
          <div :class="{ isFinish: isFinish('cover'), isSave: isSave('cover') }">封面</div>
        </span>
        <Cover ref="cover" />
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="EngineeringSchedule" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('EngineeringSchedule'), isSave: isSave('EngineeringSchedule') }">
            工程进度控制
          </div>
        </span>
        <EngineeringSchedule ref="EngineeringSchedule" />
      </el-tab-pane>
      <el-tab-pane name="EngineeringQuality" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('EngineeringQuality'), isSave: isSave('EngineeringQuality') }">
            工程质量控制
          </div>
        </span>
        <EngineeringQuality ref="EngineeringQuality" />
      </el-tab-pane>
      <el-tab-pane name="SafeSupervision" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('SafeSupervision'), isSave: isSave('SafeSupervision') }">
            安全生产管理的监理工作
          </div>
        </span>
        <SafeSupervision ref="SafeSupervision"></SafeSupervision>
      </el-tab-pane>
      <el-tab-pane name="CivilizationSupervision" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('CivilizationSupervision'), isSave: isSave('CivilizationSupervision') }">
            文明施工管理的监理工作
          </div>
        </span>
        <CivilizationSupervision ref="CivilizationSupervision"></CivilizationSupervision>
      </el-tab-pane>
      <el-tab-pane name="EngineeringCost" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('EngineeringCost'), isSave: isSave('EngineeringCost') }">工程造价控制</div>
        </span>
        <EngineeringCost ref="EngineeringCost"></EngineeringCost>
      </el-tab-pane>
      <el-tab-pane name="ContractOther" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('ContractOther'), isSave: isSave('ContractOther') }">合同及其他事项</div>
        </span>
        <ContractOther ref="ContractOther"></ContractOther>
      </el-tab-pane>
      <el-tab-pane name="SupervisionStatistics" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('SupervisionStatistics'), isSave: isSave('SupervisionStatistics') }">
            本月监理工作统计
          </div>
        </span>
        <SupervisionStatistics ref="SupervisionStatistics"></SupervisionStatistics>
      </el-tab-pane>
      <el-tab-pane name="SupervisionSummary" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('SupervisionSummary'), isSave: isSave('SupervisionSummary') }">
            本月监理工作总结
          </div>
        </span>
        <SupervisionSummary ref="SupervisionSummary"></SupervisionSummary>
      </el-tab-pane>
      <el-tab-pane name="NextMonthPoint" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('NextMonthPoint'), isSave: isSave('NextMonthPoint') }">
            下月工作重点及建议
          </div>
        </span>
        <NextMonthPoint ref="NextMonthPoint"></NextMonthPoint>
      </el-tab-pane>
    </el-tabs>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-promise-btn size="lg" @click="save">保存</el-button>
      <el-button v-promise-btn size="lg" type="primary" @click="submit">提交本页</el-button>
      <el-button
        v-if="activeName === 'NextMonthPoint'"
        v-promise-btn
        :disabled="form.finishedSteps.length !== 10 || form.status === 1"
        :style="{ backgroundColor: form.finishedSteps.length === 10 ? '#a61f6e' : '#999' }"
        size="lg"
        type="primary"
        @click="audit"
        >提交月报，开始审核</el-button
      >
    </div>
  </div>
</template>

<script>
import commonList from '@/views/epcPpp/infoManage/supervisionMonth/lib/commonSupervisionList'
import Api from '@/views/epcPpp/infoManage/api'
import Cover from './components/Cover'
import EngineeringSchedule from './components/EngineeringSchedule'
import EngineeringQuality from './components/EngineeringQuality'
import SafeSupervision from './components/SafeSupervision' //安全监理
import CivilizationSupervision from './components/CivilizationSupervision' //文明监理
import EngineeringCost from './components/EngineeringCost' //工程造价
import ContractOther from './components/ContractOther' //合同和其他
import SupervisionStatistics from './components/SupervisionStatistics' //监理统计
import SupervisionSummary from './components/SupervisionSummary' //监理总结
import NextMonthPoint from './components/NextMonthPoint' //下月建议
export default {
  name: 'Edit',
  // import引入的组件
  components: {
    Cover,
    EngineeringSchedule,
    EngineeringQuality,
    SafeSupervision,
    CivilizationSupervision,
    EngineeringCost,
    ContractOther,
    SupervisionStatistics,
    SupervisionSummary,
    NextMonthPoint
  },
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || this.$route.query.id || '',
      activeName: 'cover',
      form: { doingSteps: [], finishedSteps: [] },
      commonList
    }
  },
  // 生命周期 - 挂载完成
  created() {
    if (this.id) {
      this.getSupervisionMonthDetail()
    }
  },
  // 方法集合
  methods: {
    //获取数据
    async getSupervisionMonthDetail() {
      let res = await Api.getSupervisionMonthDetail(this.id)
      this.form = {
        ...res.data,
        workStatList: res.data.workStatList.length ? res.data.workStatList : commonList,
        date: res.data.reportStartDate,
        finishedSteps: res.data.finishedSteps.split(','),
        doingSteps: res.data.doingSteps.split(',')
      }
      for (let i in this.$refs) {
        this.$refs[i].form = { ...this.form }
      }
      // this.$refs[this.activeName].form = { ...this.form }
    },
    //是否不可点击
    isDisabled() {
      return ![...this.form.finishedSteps, ...this.form.doingSteps].includes('cover')
    },
    //是否已完成
    isFinish(name) {
      return this.form.finishedSteps.includes(name)
    },
    //是否一保存
    isSave(name) {
      return this.form.doingSteps.includes(name)
    },
    async save() {
      let aa = { tableData: [...(this.form.workStatList || [])] }
      if (this.activeName !== 'SupervisionStatistics') {
        await this.$refs[this.activeName].$refs.form.validate()
      } else {
        aa = await this.$refs[this.activeName].$refs.table.getTableData()
      }
      this.form.doingSteps = _.compact(_.uniq([...this.form.doingSteps, this.activeName]))
      this.form.finishedSteps = _.compact(_.difference(this.form.finishedSteps, [this.activeName]))
      let params = {
        ...this.form,
        ...this.$refs[this.activeName].form,
        workStatList: aa.tableData,
        doingSteps: this.form.doingSteps.join(','),
        finishedSteps: this.form.finishedSteps.join(','),
        workStatFlag: this.activeName === 'SupervisionStatistics' ? 1 : 0
      }
      let res = await Api.addSupervisionMonth(params)
      this.id = res.data
      if (!this.$route.params.id) {
        await this.$router.push({ query: { id: res.data } })
      }
      await this.getSupervisionMonthDetail()
    },
    async submit() {
      let aa = { tableData: [...(this.form.workStatList || [])] }
      if (this.activeName !== 'SupervisionStatistics') {
        await this.$refs[this.activeName].$refs.form.validate()
      } else {
        aa = await this.$refs[this.activeName].$refs.table.getTableData()
      }
      this.form.finishedSteps = _.compact(_.uniq([...this.form.finishedSteps, this.activeName]))
      this.form.doingSteps = _.compact(_.difference(this.form.doingSteps, [this.activeName]))
      let params = {
        ...this.form,
        ...this.$refs[this.activeName].form,
        workStatList: aa.tableData,
        doingSteps: this.form.doingSteps.join(','),
        finishedSteps: this.form.finishedSteps.join(','),
        workStatFlag: this.activeName === 'SupervisionStatistics' ? 1 : 0
      }
      let res = await Api.addSupervisionMonth(params)
      this.id = res.data
      if (!this.$route.params.id) {
        await this.$router.push({ query: { id: res.data } })
      }
      await this.getSupervisionMonthDetail()
    },
    async audit() {
      await Api.auditSupervisionMonth(this.form.id)
      await this.$router.push({
        name: `SupervisionMonthEpcPpp`
      })
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.isSave {
  color: red;
}
.isFinish {
  color: green;
}
</style>
