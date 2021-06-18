<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="0" class="form-con">
      <el-form-item label="本期施工安全评述" required label-width="150px" prop="safetyDescribe">
        <el-input v-model="form.safetyDescribe" type="textarea" rows="4" class="form-input" />
      </el-form-item>
      <el-form-item label="施工单位安全生产管理方面的主要问题及处理情况" required label-width="150px">
        <div class="borderedItemContainer">
          <el-form-item label="" prop="safetyProblemReason">
            <div>原因:</div>
            <el-input v-model="form.safetyProblemReason" type="textarea" rows="4" class="form-input" />
          </el-form-item>
          <el-form-item label="" prop="safetyProblemHandle" label-width="0">
            <div>处理:</div>
            <el-input v-model="form.safetyProblemHandle" type="textarea" rows="4" class="form-input" />
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'SafeSupervision',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        safetyDescribe: [{ required: true, message: '安全评述必填' }],
        safetyProblemReason: [{ required: true, message: '原因必填' }],
        safetyProblemHandle: [{ required: true, message: '处理必填' }]
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
