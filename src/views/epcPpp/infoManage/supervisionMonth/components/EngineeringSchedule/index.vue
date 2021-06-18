<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="0" class="form-con">
      <el-form-item label="工程进展情况" required label-width="140px">
        <div class="borderedItemContainer">
          <el-form-item label="" prop="imageProgress">
            <div>形象进度:</div>
            <el-input v-model="form.imageProgress" type="textarea" rows="4" class="form-input" />
          </el-form-item>
          <el-form-item label="" prop="imageContrast">
            <div>形象对比:</div>
            <el-input v-model="form.imageContrast" type="textarea" rows="4" class="form-input" />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="本期工程进度控制方面的主要问题分析及处理情况" required label-width="140px">
        <div class="borderedItemContainer">
          <el-form-item label="" prop="progressProblemReason">
            <div>原因:</div>
            <el-input v-model="form.progressProblemReason" type="textarea" rows="4" class="form-input" />
          </el-form-item>
          <el-form-item label="" prop="progressProblemHandle">
            <div>处理:</div>
            <el-input v-model="form.progressProblemHandle" type="textarea" rows="4" class="form-input" />
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'EngineeringSchedule',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        imageProgress: [{ required: true, message: '形象进度必填' }],
        imageContrast: [{ required: true, message: '形象对比必填' }],
        progressProblemReason: [{ required: true, message: '原因必填' }],
        progressProblemHandle: [{ required: true, message: '处理必填' }]
      }
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import url('../../style.less');
</style>
