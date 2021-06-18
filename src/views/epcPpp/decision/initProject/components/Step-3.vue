<template>
  <div class="container no-padding">
    <el-row :gutter="15">
      <el-col :span="24" :lg="10">
        <el-form label-width="160px" size="mini" :rules="rules" :model="form">
          <el-card header="现金流入">
            <el-form-item label="政府付款现金收入" prop="governmentPayCashIncomeType">
              <el-select v-model="form.governmentPayCashIncomeType">
                <el-option label="21号文公式模型" :value="1"></el-option>
                <el-option label="年金公式模型" :value="2"></el-option>
                <el-option label="公式变形等其他模型" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="[3].includes(form.governmentPayCashIncomeType)">
              <YearTable
                edit
                :year="year"
                :highlight-year="detail.step1.constructionTime"
                :value="form.todoArr"
              ></YearTable>
            </el-form-item>
            <el-form-item label="运营现金收入">
              <YearTable
                edit
                :year="year"
                :value="form.todoArr"
                :highlight-year="detail.step1.constructionTime"
              ></YearTable>
            </el-form-item>
          </el-card>
          <el-card header="现金流出" style="margin-top: 15px">
            <el-form-item label="还本付息方式" prop="modeOfRepaymentType">
              <el-select v-model="form.modeOfRepaymentType">
                <el-option
                  v-for="item in modeOfRepaymentList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="[3].includes(form.modeOfRepaymentType)" label="债务还本">
              <YearTable
                edit
                :year="year"
                :value="form.todoArr"
                :highlight-year="detail.step1.constructionTime"
              ></YearTable>
            </el-form-item>
            <el-form-item v-if="[3].includes(form.modeOfRepaymentType)" label="建设期付息">
              <YearTable
                edit
                :year="year"
                :value="form.todoArr"
                :highlight-year="detail.step1.constructionTime"
              ></YearTable>
            </el-form-item>
            <el-form-item v-if="[3].includes(form.modeOfRepaymentType)" label="运营期付息">
              <YearTable
                edit
                :year="year"
                :value="form.todoArr"
                :highlight-year="detail.step1.constructionTime"
              ></YearTable>
            </el-form-item>
            <el-form-item label="人员工资">
              <YearTable
                edit
                :year="year"
                :value="form.todoArr"
                :highlight-year="detail.step1.constructionTime"
              ></YearTable>
            </el-form-item>
            <el-form-item label="维修养护">
              <YearTable
                edit
                :year="year"
                :value="form.todoArr"
                :highlight-year="detail.step1.constructionTime"
              ></YearTable>
            </el-form-item>
            <el-form-item label="其它">
              <YearTable
                edit
                :year="year"
                :value="form.todoArr"
                :highlight-year="detail.step1.constructionTime"
              ></YearTable>
            </el-form-item>
          </el-card>
        </el-form>
      </el-col>
      <el-col :span="24" :lg="14">
        <el-card style="height: 100%">
          <div class="tooltips">
            <el-button type="primary" @click="calculate">生成项目测算表和评价指标表</el-button>
          </div>
          <ProjectCalculationTable :tableData="tableData"></ProjectCalculationTable>
          <EvaluationIndexTable :tableData="tableData2"></EvaluationIndexTable>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'handsontable/languages/zh-CN'
import YearTable from './YearTable'
import modeOfRepaymentList from '../../lib/modeOfRepaymentList'
import ProjectCalculationTable from '../components/ProjectCalculationTable'
import projectCalculationTableData from '../../lib/projectCalculationTableData'
import EvaluationIndexTable from '../components/EvaluationIndexTable'
import evaluationIndexTableData from '../../lib/evaluationIndexTableData'
export default {
  name: 'Step3',
  // import引入的组件需要注入到对象中才能使用
  components: { YearTable, ProjectCalculationTable, EvaluationIndexTable },
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
    },
    detail: {
      type: Object,
      required: true
    }
  },
  data() {
    // 这里存放数据
    return {
      rules: {
        todo: [{ required: true, message: '必填' }]
      },
      tableData: [],
      tableData2: [],
      modeOfRepaymentList
    }
  },
  computed: {
    year() {
      return this.detail.step1.constructionTime + this.detail.step1.runningPeriod
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.form.modeOfRepaymentType = this.detail.step1.modeOfRepaymentType
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    // 生成项目测算表和评价指标表
    calculate() {
      this.tableData = projectCalculationTableData
      this.tableData2 = evaluationIndexTableData
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>
