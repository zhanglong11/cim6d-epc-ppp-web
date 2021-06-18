<template>
  <div v-if="!isEmpty" class="container init-project">
    <div class="tooltips border-bottom">
      <router-link :to="`initProject/${13}/edit`"><el-button type="primary">修改决策报告</el-button></router-link>
    </div>
    <div class="tooltips">
      <h2>决策结果</h2>
      <div>
        <a href="/doc/决策结果.xlsx" style="margin-right: 10px">
          <el-button plain type="primary">下载决策结果</el-button>
        </a>
        <el-button plain type="primary" @click="assumptionTableDialogVisible = true">查看假设条件表</el-button>
        <el-button plain type="primary" @click="totalInvestmentRecalculationDataDialogVisible = true"
          >查看总投资重算表</el-button
        >
        <el-button plain type="primary" @click="projectCalculationTableDialogVisible = true">查看项目测算表</el-button>
        <el-button plain type="primary" @click="evaluationIndexTableDialogVisible = true">查看评价指标表</el-button>
      </div>
    </div>
    <HotTable class="table-1" :data="tableData1" :settings="hotSettings"></HotTable>
    <h2>评价指标</h2>
    <EvaluationIndexTable :tableData="evaluationIndexTableData"></EvaluationIndexTable>
    <div style="height: 20px"></div>
    <el-dialog title="假设条件表" top="50px" :visible.sync="assumptionTableDialogVisible">
      <AssumptionTable class="mini" :tableData="assumptionTableData"></AssumptionTable>
      <div slot="footer">
        <a href="/doc/假设条件表.xlsx" style="margin-right: 10px">
          <el-button plain type="primary">下载表格</el-button>
        </a>
        <el-button @click="assumptionTableDialogVisible = false">我知道了</el-button>
      </div>
    </el-dialog>
    <el-dialog title="总投资重算表" width="600px" :visible.sync="totalInvestmentRecalculationDataDialogVisible">
      <TotalInvestmentRecalculationData
        :tableData="totalInvestmentRecalculationData"
      ></TotalInvestmentRecalculationData>
      <div slot="footer">
        <a href="/doc/总投资重算表.xlsx" style="margin-right: 10px">
          <el-button plain type="primary">下载表格</el-button>
        </a>
        <el-button @click="totalInvestmentRecalculationDataDialogVisible = false">我知道了</el-button>
      </div>
    </el-dialog>
    <el-dialog title="项目测算表" width="80vw" top="30px" :visible.sync="projectCalculationTableDialogVisible">
      <ProjectCalculationTable :height="800" :tableData="projectCalculationTableData"></ProjectCalculationTable>
      <div slot="footer">
        <a href="/doc/项目测算表.xlsx" style="margin-right: 10px">
          <el-button plain type="primary">下载表格</el-button>
        </a>
        <el-button @click="projectCalculationTableDialogVisible = false">我知道了</el-button>
      </div>
    </el-dialog>
    <el-dialog width="500px" title="评价指标表" :visible.sync="evaluationIndexTableDialogVisible">
      <EvaluationIndexTable class="small" :tableData="evaluationIndexTableData"></EvaluationIndexTable>
      <div slot="footer">
        <a href="/doc/评价指标表.xlsx" style="margin-right: 10px">
          <el-button plain type="primary">下载表格</el-button>
        </a>
        <el-button @click="evaluationIndexTableDialogVisible = false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
  <div v-else class="empty">
    <img src="@/assets/images/empty-2.svg" alt="empty" />
    <el-button type="primary" style="margin-top: 60px" size="large" @click="add">新建决策报告</el-button>
  </div>
</template>

<script>
import api from '@/views/epcPpp/decision/api'
import padEndArray from '../utils/padEndArray'
import 'handsontable/languages/zh-CN'
import { HotTable } from '@handsontable/vue'
import AssumptionTable from './components/AssumptionTable'
import assumptionTableData from '../lib/assumptionTableData'
import TotalInvestmentRecalculationData from './components/TotalInvestmentRecalculationData'
import ProjectCalculationTable from './components/ProjectCalculationTable'
import projectCalculationTableData from '../lib/projectCalculationTableData'
import EvaluationIndexTable from './components/EvaluationIndexTable'
import evaluationIndexTableData from '../lib/evaluationIndexTableData'
export default {
  name: 'InitProject',
  // import引入的组件需要注入到对象中才能使用
  components: {
    HotTable,
    AssumptionTable,
    TotalInvestmentRecalculationData,
    ProjectCalculationTable,
    EvaluationIndexTable
  },
  data() {
    // 这里存放数据
    return {
      isEmpty: !localStorage.getItem('decisionInitProject'),
      hotSettings: {
        editor: false,
        rowHeaders: false,
        fixedColumnsLeft: 3,
        colHeaders: ['项目', '金额', ..._.range(1, 19)],
        licenseKey: 'non-commercial-and-evaluation',
        language: 'zh-cn',
        width: '100%',
        height: 850,
        rowHeights: 40,
        columnHeaderHeight: 40
      },
      tableData1: padEndArray([
        /*eslint-disable*/
        ['净利润',19734,0 ,0 ,0 ,-4114 ,-3455 ,-2758 ,-2021 ,-1060 ,-414 ,460 ,1385 ,2364 ,3438 ,3373 ,4178 ,5084 ,6054 ,7220 ],
        ['全投资现金流量'],
        ['税前净现金流量',82588,-39668 ,-29751 ,-29751 ,8069 ,8535 ,9029 ,9552 ,10239 ,10689 ,11308 ,11963 ,12655 ,13992 ,14163 ,14178 ,14856 ,15716 ,16812 ],
        ['税后净现金流量',63907,-39668 ,-29751 ,-29751 ,7838 ,8195 ,8572 ,8972 ,9484 ,9841 ,10314 ,10814 ,11343 ,12305 ,12496 ,12339 ,12817 ,13462 ,14284 ],
        ['税后净现金流量累计',63907,-39668 ,-69418 ,-99169 ,-91331 ,-83136 ,-74563 ,-65591 ,-56107 ,-46266 ,-35953 ,-25138 ,-13795 ,-1490 ,11006 ,23345 ,36162 ,49623 ,63907 ],
        ['税后净现金流量现值',4183,-37815 ,-27036 ,-25773 ,6473 ,6452 ,6434 ,6419 ,6468 ,6398 ,6392 ,6389 ,6389 ,6607 ,6396 ,6020 ,5962 ,5969 ,6038 ],
        ['税后净现金流量现值累计',4183,-37815 ,-64851 ,-90624 ,-84151 ,-77699 ,-71266 ,-64847 ,-58379 ,-51981 ,-45588 ,-39199 ,-32810 ,-26202 ,-19806 ,-13786 ,-7824 ,-1855 ,4183 ],
        ['静态投资回收期',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,12.12,0.00,0.00,0.00,0.00,],
        ['动态投资回收期',0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,17.31 ,],
        ['资本金现金流量',],
        ['税前净现金流量',29139,-8125 ,-6485 ,-6797 ,-679 ,-212 ,282 ,804 ,1492 ,1942 ,2561 ,3215 ,3908 ,5245 ,5416 ,5431 ,6108 ,6968 ,8064 ,],
        ['税后净现金流量',19734,-8125 ,-6485 ,-6797 ,-679 ,-212 ,282 ,804 ,1492 ,1942 ,2561 ,3215 ,3908 ,4475 ,4292 ,4038 ,4414 ,4950 ,5658 ,],
        ['税后净现金流量累计',-8125 ,-14609 ,-21407 ,-22086 ,-22298 ,-22016 ,-21211 ,-19719 ,-17777 ,-15217 ,-12001 ,-8093 ,-3618 ,674 ,4712 ,9126 ,14076 ,19734 ,],
        ['税后净现金流量现值',1711,-7745 ,-5893 ,-5889 ,-561 ,-167 ,211 ,575 ,1018 ,1263 ,1587 ,1900 ,2201 ,2403 ,2197 ,1970 ,2053 ,2195 ,2392 ,],
        ['税后净现金流量现值累计',1711,-7745 ,-13638 ,-19527 ,-20087 ,-20254 ,-20043 ,-19467 ,-18450 ,-17187 ,-15600 ,-13700 ,-11499 ,-9096 ,-6899 ,-4929 ,-2876 ,-681 ,1711 ,],
        ['静态投资回收期',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,12.81,0.00,0.00,0.00,0.00,],
        ['动态投资回收期',0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00 ,17.28 ,],
        ['项目全口径现金流量',41140,0 ,0 ,0 ,-679 ,-212 ,282 ,804 ,1492 ,1942 ,2561 ,3215 ,3908 ,4475 ,4292 ,4038 ,4414 ,4950 ,5658 ,],
        ['累计净现金流量',41140,0 ,0 ,0 ,-679 ,-891 ,-609 ,195 ,1687 ,3629 ,6190 ,9405 ,13313 ,17789 ,22081 ,26118 ,30532 ,35483 ,41140 ,]
        /*eslint-enable*/
      ]),
      assumptionTableDialogVisible: false,
      assumptionTableData,
      totalInvestmentRecalculationDataDialogVisible: false,
      totalInvestmentRecalculationData: padEndArray([
        ['序号', '项目', '合集', '40%', '30%', '30%', '备注'],
        ['1', '静态总投', 99169, 39668, 29751, 29751],
        ['2', '建设期利息', 7369, 928, 2540, 3901],
        ['3', '动态总投资', 106538, 40595, 32291, 33652],
        ['3.1', '资本金', 21308, 8119, 6458, 6730, '20%'],
        ['3.2', '项目贷款', 85230, 32476, 25832, 26922, '80%'],
        ['3.2.1', '贷款本金', 77862, 31549, 23293, 23020],
        ['3.2.2', '建设期利息', 7369, 928, 2540, 3901]
      ]),
      projectCalculationTableDialogVisible: false,
      projectCalculationTableData,
      evaluationIndexTableDialogVisible: false,
      evaluationIndexTableData
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
    add() {
      api.add().then(res => {
        localStorage.setItem('lastDecisionAddId', res.data)
        this.$router.push({ name: 'InitProjectAddEpcPpp' })
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
@import '~handsontable/dist/handsontable.full.css';
.tooltips.border-bottom {
  border-bottom: 1px solid #aaaaaa2f;
  margin: 0 -20px 20px;
  padding: 0 20px;
}

h2 {
  margin-bottom: 25px;
  font-size: 18px;
  color: #131313;
  font-weight: bold;
}
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="less">
.init-project {
  table:not(.htCore) {
    td {
      border: 1px solid #e1e1e1;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      font-size: 14px;
    }
  }
  table.small {
    td {
      height: 30px;
      line-height: 30px;
    }
  }
  table.mini {
    td {
      height: 26px;
      line-height: 26px;
    }
  }
  .table-1 {
    /deep/ tr:nth-child(2),
    /deep/ tr:nth-child(10),
    /deep/ tr:nth-child(18),
    /deep/ tr:nth-child(19) {
      td:first-child {
        color: #e70b0b;
      }
      td:nth-child(2) {
        color: #e70b0b;
      }
    }
    td,
    th {
      font-size: 14px;
      line-height: 40px;
      padding: 0 10px;
      border-color: #e1e1e1 !important;
    }
    th {
      background-color: #f2f4f9;
    }
  }
}
</style>
