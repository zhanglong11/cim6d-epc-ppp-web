<template>
  <el-card class="box-card">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" label-width="0" class="form-con">
        <el-form-item
          label="本期合同及其他事项的管理工作情况"
          required
          label-width="150px"
          prop="contractOtherSituation"
        >
          <el-input v-model="form.contractOtherSituation" type="textarea" rows="4" class="form-input" />
        </el-form-item>
        <el-form-item label="合同及其他事项管理方面的主要问题及分析处理情况" required label-width="150px">
          <div class="borderedItemContainer">
            <el-form-item label="" prop="contractOtherProblemReason">
              <div>原因:</div>
              <el-input v-model="form.contractOtherProblemReason" type="textarea" rows="4" class="form-input" />
            </el-form-item>
            <el-form-item label="" prop="contractOtherProblemHandle" label-width="0">
              <div>处理:</div>
              <el-input v-model="form.contractOtherProblemHandle" type="textarea" rows="4" class="form-input" />
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </el-card>
</template>

<script>
export default {
  name: 'ContractOther',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        contractOtherSituation: [{ required: true, message: '情况必填' }],
        contractOtherProblemReason: [{ required: true, message: '原因必填' }],
        contractOtherProblemHandle: [{ required: true, message: '处理必填' }]
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
