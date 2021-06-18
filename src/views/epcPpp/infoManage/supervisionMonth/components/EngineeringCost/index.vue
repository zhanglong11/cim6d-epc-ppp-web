<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="0" class="form-con">
      <el-form-item label="本期完成情况" label-width="150px" prop="finishInvestment">
        本期完成投资<el-input v-model.number="form.finishInvestment" type="number" style="width: 200px" />万元
      </el-form-item>
      <el-form-item label="已完工程量与已支付工程款的统计及说明" required label-width="150px" prop="projectAmountMoney">
        <el-input v-model.number="form.projectAmountMoney" type="textarea" rows="4" class="form-input" />
      </el-form-item>
      <el-form-item label="工程量与工程款支付问题" required label-width="150px">
        <div class="borderedItemContainer">
          <el-form-item label="" prop="amountMoneyProblemReason">
            <div>原因:</div>
            <el-input v-model.number="form.amountMoneyProblemReason" type="textarea" rows="4" class="form-input" />
          </el-form-item>
          <el-form-item label="" prop="amountMoneyProblemHandle" label-width="0">
            <div>处理:</div>
            <el-input v-model.number="form.amountMoneyProblemHandle" type="textarea" rows="4" class="form-input" />
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'EngineeringCost',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        finishInvestment: [{ required: true, message: '本期完成投资必填' }],
        projectAmountMoney: [{ required: true, message: '说明必填' }],
        amountMoneyProblemReason: [{ required: true, message: '原因必填' }],
        amountMoneyProblemHandle: [{ required: true, message: '处理必填' }]
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
