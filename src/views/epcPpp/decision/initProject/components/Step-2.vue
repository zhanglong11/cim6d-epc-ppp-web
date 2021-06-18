<template>
  <div class="container no-padding">
    <el-row :gutter="15">
      <el-col :span="24" :lg="10">
        <el-form ref="form" label-width="130px" size="mini" :model="form">
          <el-card header="投资详情">
            <h2>投资进度设置</h2>
            <el-form-item
              v-for="year in detail.step1.constructionTime"
              :key="year"
              :label="`第${num2chinese(year)}期投资进度`"
              :prop="`schedule[${year - 1}]`"
              :rules="[{ required: true, message: '必填' }]"
            >
              <InputNumber v-model="form.schedule[year - 1]" unit="%"></InputNumber>
            </el-form-item>
            <h2>总投资重算设置</h2>
            <el-form-item label="总投资重算方式" prop="totalInvestmentRecalculationMethod">
              <el-select v-model="form.totalInvestmentRecalculationMethod" style="width: 100%">
                <el-option label="建设期计息付息不还本、自有资金付息" :value="1"></el-option>
                <el-option label="建设期计息付息不还本、债务资金付息" :value="2"></el-option>
                <el-option label="建设期计息不付息不还本" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-card>
        </el-form>
      </el-col>
      <el-col :span="24" :lg="14">
        <el-card>
          <div class="tooltips">
            <el-button type="primary" @click="submit">生成资本结构表</el-button>
          </div>
          <table>
            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'handsontable/languages/zh-CN'
import num2chinese from 'num2chinese'
import padEndArray from '../../utils/padEndArray'
import api from '../../api'
export default {
  name: 'Step2',
  // import引入的组件需要注入到对象中才能使用
  components: {},
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
      tableData: [
        /*[1, '静态总投', 99169, 39668, 29751, 29751],
        [2, '建设期利息', 7864, 955, 2674, 4236],
        [3, '动态总投资', 107034, 40623, 32424, 33986],
        [3.1, '资本金', 21407, 8125, 6485, 6797, '20%'],
        [3.2, '项目贷款', 85627, 32498, 25939, 27189, '80%']*/
      ]
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
    num2chinese,
    //生成资本结构表
    async submit() {
      await this.$refs.form.validate()
      /*await api.addStructure({ decisionId: this.id, ...this.form }).then(res => {

      })*/
      if (this.form.totalInvestmentRecalculationMethod === 1) {
        this.tableData = padEndArray([
          ['序号', '项目', '合集', '40%', '30%', '30%', '备注'],
          [1, '静态总投', 99169, 39668, 29751, 29751, null],
          [2, '建设期利息', 7864, 955, 2674, 4236, null],
          [3, '动态总投资', 107034, 40623, 32424, 33986, null],
          [3.1, '资本金', 21407, 8125, 6485, 6797, '20%'],
          [3.2, '项目贷款', 85627, 32498, 25939, 27189, '80%']
        ])
      } else if (this.form.totalInvestmentRecalculationMethod === 2) {
        this.tableData = padEndArray([
          ['序号', '项目', '合集', '40%', '30%', '30%', '备注'],
          ['1', '静态总投', 99169, 39668, 29751, 29751],
          ['2', '建设期利息', 7464, 933, 2566, 3965],
          ['3', '动态总投资', 106633, 40601, 32316, 33716],
          ['3.1', '资本金', 19834, 7934, 5950, 5950, '20%'],
          ['3.2', '项目贷款', 86799, 32667, 26366, 27766, '80%'],
          ['3.2.1', '贷款本金', 79335, 31734, 23801, 23801],
          ['3.2.2', '建设期利息', 7464, 933, 2566, 3965]
        ])
      } else if (this.form.totalInvestmentRecalculationMethod === 3) {
        this.tableData = padEndArray([
          ['序号', '项目', '合集', '40%', '30%', '30%', '备注'],
          ['1', '静态总投', 99169, 39668, 29751, 29751],
          ['2', '建设期利息', 7369, 928, 2540, 3901],
          ['3', '动态总投资', 106538, 40595, 32291, 33652],
          ['3.1', '资本金', 21308, 8119, 6458, 6730, '20%'],
          ['3.2', '项目贷款', 85230, 32476, 25832, 26922, '80%'],
          ['3.2.1', '贷款本金', 77862, 31549, 23293, 23020],
          ['3.2.2', '建设期利息', 7369, 928, 2540, 3901]
        ])
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~handsontable/dist/handsontable.full.css';
@import '~@/styles/color.less';
.el-form-item {
  width: 400px;
}
.el-row {
  .el-col {
    margin-bottom: 15px;
  }
}
h2 {
  margin-bottom: 10px;
  font-weight: bold;
}
table {
  td {
    border: 1px solid #aaa;
    padding: 0 10px;
  }
}
</style>
