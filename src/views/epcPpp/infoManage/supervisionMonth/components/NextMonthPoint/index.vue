<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="0" class="form-con">
      <el-form-item label="下月工作重点及建议" required label-width="160px" prop="nextKeyAdvise">
        <el-input v-model="form.nextKeyAdvise" type="textarea" rows="4" class="form-input" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'NextMonthPoint',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        nextKeyAdvise: [{ required: true, message: '下月工作重点及建议必填' }]
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
