<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="0" class="form-con">
      <el-form-item label="本期文明施工情况" required label-width="150px" prop="civilizedConstructionSituation">
        <el-input v-model="form.civilizedConstructionSituation" type="textarea" rows="4" class="form-input" />
      </el-form-item>
      <el-form-item label="文明施工管理方面的主要问题分析及处理情况" required label-width="150px">
        <div class="borderedItemContainer">
          <el-form-item label="" prop="constructionProblemReason">
            <div>原因:</div>
            <el-input v-model="form.constructionProblemReason" type="textarea" rows="4" class="form-input" />
          </el-form-item>
          <el-form-item label="" prop="constructionProblemHandle" label-width="0">
            <div>处理:</div>
            <el-input v-model="form.constructionProblemHandle" type="textarea" rows="4" class="form-input" />
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'CivilizationSupervision',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        civilizedConstructionSituation: [{ required: true, message: '文明施工情况必填' }],
        constructionProblemReason: [{ required: true, message: '原因必填' }],
        constructionProblemHandle: [{ required: true, message: '处理必填' }]
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
