<template>
  <div class="container no-padding init-project-edit">
    <Step1 v-if="step === 1" :id="id" ref="step1" v-model="form.step1" :detail="form"></Step1>
    <Step2 v-if="step === 2" :id="id" ref="step2" v-model="form.step2" :detail="form"></Step2>
    <Step3 v-if="step === 3" :id="id" ref="step3" v-model="form.step3" :detail="form"></Step3>
    <div class="footer-btn">
      <el-button :disabled="step === 1" @click="prev">上一步</el-button>
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="next">
        {{ step === 3 ? '完成' : '下一步' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import api from '../api'
import Step1 from './components/Step-1'
import Step2 from './components/Step-2'
import Step3 from './components/Step-3'
export default {
  name: 'Edit',
  // import引入的组件需要注入到对象中才能使用
  components: { Step1, Step2, Step3 },
  data() {
    // 这里存放数据
    return {
      id: localStorage.getItem('lastDecisionAddId'),
      form: {
        step1: {
          ...(process.env.NODE_ENV === 'development' || 1
            ? {
                architectureProjectInvestor: 81079.4,
                installProjectInvestor: 0,
                equipmentBuyCost: 440.87,
                projectOtherCost: 10360.98,
                readyCost: 10354.96,
                constructionInterest: 8320.53
              }
            : {}),
          discountRate: 5.8,
          roi: 1,
          fairRateOfProfit: 6.6,
          loanRate: 5.88,
          modeOfRepaymentType: 1,
          corporateIncomeTax: 25,
          addedValueTax: 0,
          constructionIndustryAddedTax: 9,
          modernServiceIndustryAddedTax: 6,
          cargoAddedTax: 13,
          urbanMaintenanceAndConstructionTax: 7,
          educationSurtax: 3,
          educationSurtaxPlace: 2,
          baseEarningsRatio: 5,
          capitalRatio: 20,
          socialCapitalShares: 90,
          governmentContributive: 10,
          constructionTime: 3,
          runningPeriod: 15,
          jianAnLower: 3,
          benchmarkYieldDiscountRate: 4.9
        },
        step2: {
          schedule: [30, 70, 100],
          totalInvestmentRecalculationMethod: 1
        },
        step3: {
          governmentPayCashIncomeType: 1,
          modeOfRepaymentType: 1,
          todoArr: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
        }
      },
      step: 1
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    //下一步
    async next() {
      if (this.step === 1) {
        await this.$refs.step1.submit()
      } else if (this.step === 2) {
        await this.$refs.step2.submit()
      } else if (this.step === 3) {
        localStorage.setItem('decisionInitProject', '1')
        this.$router.back()
        return false
      }
      this.step++
    },
    //上一步
    prev() {
      this.step--
    }
  }
}
</script>

<style scoped lang="less">
@import '~handsontable/dist/handsontable.full.css';
@import '~@/styles/color.less';
</style>
<style lang="less">
.init-project-edit table:not(.htCore) {
  td {
    border: 1px solid #e1e1e1;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    font-size: 14px;
  }
}
</style>
