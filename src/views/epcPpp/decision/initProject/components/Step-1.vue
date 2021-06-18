<template>
  <div class="container no-padding">
    <el-row :gutter="15">
      <el-col :span="24" :lg="14">
        <el-form ref="form" label-width="128px" size="mini" :rules="rules" :model="form">
          <el-card header="投资详情">
            <el-form-item label="建筑工程投资" prop="architectureProjectInvestor">
              <InputNumber v-model="form.architectureProjectInvestor" :precision="2" unit="万元"></InputNumber>
            </el-form-item>
            <el-form-item label="安装工程投资" prop="installProjectInvestor">
              <InputNumber v-model="form.installProjectInvestor" :precision="2" unit="万元"></InputNumber>
            </el-form-item>
            <el-form-item label="设备及工具、器具购置费" prop="equipmentBuyCost">
              <InputNumber v-model="form.equipmentBuyCost" :precision="2" unit="万元"></InputNumber>
            </el-form-item>
            <el-form-item label="工程建设其他费" prop="projectOtherCost">
              <InputNumber v-model="form.projectOtherCost" :precision="2" unit="万元"></InputNumber>
            </el-form-item>
            <el-form-item label="预备费" prop="readyCost">
              <InputNumber v-model="form.readyCost" :precision="2" unit="万元"></InputNumber>
            </el-form-item>
            <el-form-item label="建设期利息" prop="constructionInterest">
              <InputNumber v-model="form.constructionInterest" :precision="2" unit="万元"></InputNumber>
            </el-form-item>
          </el-card>
          <el-card style="margin-top: 15px" header="基本信息">
            <el-form-item label="折现率" prop="discountRate">
              <InputNumber v-model="form.discountRate" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="投资回报率" prop="roi">
              <InputNumber v-model="form.roi" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="合理利润率" prop="fairRateOfProfit">
              <InputNumber v-model="form.fairRateOfProfit" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="贷款利率" prop="loanRate">
              <InputNumber v-model="form.loanRate" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="还款方式" prop="modeOfRepaymentType">
              <el-select v-model="form.modeOfRepaymentType">
                <el-option
                  v-for="{ label, value } in modeOfRepaymentList"
                  :key="value"
                  :label="label"
                  :value="value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业所得税" prop="corporateIncomeTax">
              <InputNumber v-model="form.corporateIncomeTax" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="增值税税率" prop="addedValueTax">
              <InputNumber v-model="form.addedValueTax" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="建筑业增值税率" prop="constructionIndustryAddedTax">
              <InputNumber v-model="form.constructionIndustryAddedTax" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="现代服务业增值税率" prop="modernServiceIndustryAddedTax">
              <InputNumber v-model="form.modernServiceIndustryAddedTax" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="货物增值税率" prop="cargoAddedTax">
              <InputNumber v-model="form.cargoAddedTax" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="城市维护建设税" prop="urbanMaintenanceAndConstructionTax">
              <InputNumber v-model="form.urbanMaintenanceAndConstructionTax" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="教育费附加" prop="educationSurtax">
              <InputNumber v-model="form.educationSurtax" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="地方教育附加" prop="educationSurtaxPlace">
              <InputNumber v-model="form.educationSurtaxPlace" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="基准收益率" prop="baseEarningsRatio">
              <InputNumber v-model="form.baseEarningsRatio" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="资本金比例" prop="capitalRatio">
              <InputNumber v-model="form.capitalRatio" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="社会资本股份占比" prop="socialCapitalShares">
              <InputNumber v-model="form.socialCapitalShares" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="政府出资代表股权占比" prop="governmentContributive">
              <InputNumber v-model="form.governmentContributive" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="建设期" prop="constructionTime">
              <InputNumber v-model="form.constructionTime" unit="年"></InputNumber>
            </el-form-item>
            <el-form-item label="运营期" prop="runningPeriod">
              <InputNumber v-model="form.runningPeriod" unit="年"></InputNumber>
            </el-form-item>
            <el-form-item label="建安下浮率" prop="jianAnLower">
              <InputNumber v-model="form.jianAnLower" :precision="2" unit="%"></InputNumber>
            </el-form-item>
            <el-form-item label="基准收益率（折现率）" prop="benchmarkYieldDiscountRate">
              <InputNumber v-model="form.benchmarkYieldDiscountRate" :precision="2" unit="%"></InputNumber>
            </el-form-item>
          </el-card>
        </el-form>
      </el-col>
      <el-col :span="24" :lg="10">
        <el-card>
          <div class="tooltips">
            <el-button type="primary" @click="submit">生成假设条件表</el-button>
          </div>
          <AssumptionTable class="small" :tableData="tableData"></AssumptionTable>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../../api'
import modeOfRepaymentList from '../../lib/modeOfRepaymentList'
import AssumptionTable from '../components/AssumptionTable'
export default {
  name: 'Step1',
  // import引入的组件需要注入到对象中才能使用
  components: { AssumptionTable },
  model: {
    prop: 'form',
    event: 'input'
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      default: null
    }
  },
  data() {
    // 这里存放数据
    return {
      rules: {
        architectureProjectInvestor: [{ required: true, message: '必填' }],
        installProjectInvestor: [{ required: true, message: '必填' }],
        equipmentBuyCost: [{ required: true, message: '必填' }],
        projectOtherCost: [{ required: true, message: '必填' }],
        readyCost: [{ required: true, message: '必填' }],
        constructionInterest: [{ required: true, message: '必填' }],
        discountRate: [{ required: true, message: '必填' }],
        roi: [{ required: true, message: '必填' }],
        fairRateOfProfit: [{ required: true, message: '必填' }],
        loanRate: [{ required: true, message: '必填' }],
        modeOfRepaymentType: [{ required: true, message: '必填' }],
        corporateIncomeTax: [{ required: true, message: '必填' }],
        addedValueTax: [{ required: true, message: '必填' }],
        constructionIndustryAddedTax: [{ required: true, message: '必填' }],
        modernServiceIndustryAddedTax: [{ required: true, message: '必填' }],
        cargoAddedTax: [{ required: true, message: '必填' }],
        urbanMaintenanceAndConstructionTax: [{ required: true, message: '必填' }],
        educationSurtax: [{ required: true, message: '必填' }],
        educationSurtaxPlace: [{ required: true, message: '必填' }],
        baseEarningsRatio: [{ required: true, message: '必填' }],
        capitalRatio: [{ required: true, message: '必填' }],
        socialCapitalShares: [{ required: true, message: '必填' }],
        governmentContributive: [{ required: true, message: '必填' }],
        constructionTime: [{ required: true, message: '必填' }],
        runningPeriod: [{ required: true, message: '必填' }],
        jianAnLower: [{ required: true, message: '必填' }],
        benchmarkYieldDiscountRate: [{ required: true, message: '必填' }]
      },
      modeOfRepaymentList,
      tableData: []
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
    // 生成假设条件表
    async submit() {
      await this.$refs.form.validate()
      await api.addPostulated({ decisionId: this.id, ...this.form }).then(res => {
        this.tableData = res.data
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-form .el-card /deep/ .el-card__body {
  display: flex;
  flex-wrap: wrap;
}
.el-form-item {
  width: 50%;
  padding-left: 10px;
}
.el-col {
  margin-bottom: 15px;
}
</style>
