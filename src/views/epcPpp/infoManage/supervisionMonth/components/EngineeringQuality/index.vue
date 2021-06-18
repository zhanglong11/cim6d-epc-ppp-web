<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="0" class="form-con">
      <el-form-item label="工程质量情况" required label-width="140px" prop="qualitySituation">
        <el-input v-model="form.qualitySituation" type="textarea" rows="4" class="form-input" />
      </el-form-item>
      <el-form-item label="本期工程质量控制方面的主要问题分析及处理情况" required label-width="140px">
        <div class="borderedItemContainer">
          <el-form-item label="" prop="qualityProblemReason">
            <div>原因:</div>
            <el-input v-model="form.qualityProblemReason" type="textarea" rows="4" class="form-input" />
          </el-form-item>
          <el-form-item label="" prop="qualityProblemHandle" label-width="0">
            <div>处理:</div>
            <el-input v-model="form.qualityProblemHandle" type="textarea" rows="4" class="form-input" />
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'EngineeringQuality',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        qualitySituation: [{ required: true, message: '质量情况必填' }],
        qualityProblemReason: [{ required: true, message: '原因必填' }],
        qualityProblemHandle: [{ required: true, message: '处理必填' }]
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
