<template>
  <div class="container">
    <el-tabs v-model="activeName" laz>
      <el-tab-pane name="cover">
        <span slot="label">
          <div :class="{ isFinish: isFinish('cover'), isSave: isSave('cover') }">封面</div>
        </span>
        <Cover ref="cover" />
      </el-tab-pane>
      <el-tab-pane name="month" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('month'), isSave: isSave('month') }">项目月报表</div>
        </span>
        <ProjectMonth ref="month" />
      </el-tab-pane>
      <el-tab-pane name="progress" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('progress'), isSave: isSave('progress') }">项目形象进度表</div>
        </span>
        <ProjectProgress ref="progress" />
      </el-tab-pane>
      <el-tab-pane name="rectify" :disabled="isDisabled()">
        <span slot="label">
          <div :class="{ isFinish: isFinish('rectify'), isSave: isSave('rectify') }">项目问题整改情况表</div>
        </span>
        <ProjectRectify ref="rectify" />
      </el-tab-pane>
    </el-tabs>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-promise-btn size="lg" type="primary" @click="save">保存</el-button>
      <el-button v-promise-btn size="lg" type="primary" @click="submit">提交本页</el-button>
      <el-button
        v-if="activeName === 'rectify'"
        v-promise-btn
        :disabled="form.finishedSteps.length !== 4 || form.status === 1"
        size="lg"
        type="primary"
        :style="{ backgroundColor: form.finishedSteps.length === 4 ? '#a61f6e' : '#999' }"
        @click="audit"
        >提交月报，开始审核</el-button
      >
    </div>
  </div>
</template>

<script>
import Cover from './components/Cover'
import ProjectMonth from './components/ProjectMonth'
import ProjectProgress from './components/ProjectProgress'
import ProjectRectify from './components/ProjectRectify'
import Api from './api'
export default {
  name: 'Edit',
  // import引入的组件
  components: { Cover, ProjectMonth, ProjectProgress, ProjectRectify },
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || this.$route.query.id || '',
      activeName: 'cover',
      form: { doingSteps: [], finishedSteps: [] }
    }
  },
  // 生命周期 - 挂载完成
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    //获取数据
    async getDetail() {
      let res = await Api.detail(this.id)
      this.form = {
        ...res.data,
        date: res.data.reportStartDate,
        problemSaveList: res.data.problemSaveList || [],
        nextDate: [res.data.nextMonthStartDate, res.data.nextMonthEndDate],
        finishedSteps: res.data.finishedSteps.split(','),
        doingSteps: res.data.doingSteps.split(',')
      }
      for (let i in this.$refs) {
        this.$refs[i].form = { ...this.form }
      }
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
    //刷新
    refresh() {},
    /* async submit() {
      await this.$refs[this.activeName].$refs.form.validate()
      const form = this.$refs[this.activeName].form
      let cloneForm = _.cloneDeep(form)
      cloneForm.reportStartDate = cloneForm.date[0]
      cloneForm.reportEndDate = cloneForm.date[1]
      cloneForm.doingSteps = this.activeName
      delete cloneForm.date
      await Api.add(cloneForm)
    },*/
    async save() {
      await this.$refs[this.activeName].$refs.form.validate()
      this.form.doingSteps = _.compact(_.uniq([...this.form.doingSteps, this.activeName]))
      this.form.finishedSteps = _.compact(_.difference(this.form.finishedSteps, [this.activeName]))
      let params = {
        ...this.form,
        ...this.$refs[this.activeName].form,
        doingSteps: this.form.doingSteps.join(','),
        finishedSteps: this.form.finishedSteps.join(',')
      }
      let res
      if (this.id) {
        res = await Api.update(params)
      } else {
        res = await Api.add(params)
        this.id = res.data
        await this.$router.push({ query: { id: res.data } })
      }
      await this.getDetail()
    },
    async submit() {
      await this.$refs[this.activeName].$refs.form.validate()
      this.form.finishedSteps = _.compact(_.uniq([...this.form.finishedSteps, this.activeName]))
      this.form.doingSteps = _.compact(_.difference(this.form.doingSteps, [this.activeName]))
      let params = {
        ...this.form,
        ...this.$refs[this.activeName].form,
        doingSteps: this.form.doingSteps.join(','),
        finishedSteps: this.form.finishedSteps.join(',')
      }
      let res
      if (this.id) {
        res = await Api.update(params)
      } else {
        res = await Api.add(params)
        this.id = res.data
        await this.$router.push({ query: { id: res.data } })
      }
      await this.getDetail()
    },
    async audit() {
      await Api.audit(this.form.id)
      await this.$router.push({
        name: `ConstructionMonthEpcPpp`
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
