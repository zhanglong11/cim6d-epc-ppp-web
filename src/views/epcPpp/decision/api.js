import { ppp } from '@/utils/axios'
import _ from 'lodash'
export default {
  // 决策管理 查询列表 @author zhangshilong
  getList(body) {
    // return ppp.post('decision/list', body)
    return Promise.resolve({
      total: 5,
      records: [
        {
          id: _.uniqueId(),
          createTime: '2018-08-05',
          filed1: '20418',
          filed2: '85351',
          filed3: '66709',
          filed4: '30040',
          filed5: '20418',
          filed6: '42529',
          filed7: '41410',
          filed8: '6.58%',
          filed9: '5.42%',
          filed10: '12.12',
          filed11: '17.13',
          filed12: '7.25%',
          filed13: '5.64%',
          filed14: '12.81',
          filed15: '17.18',
          filed16: '-890.8',
          creatorName: '小明'
        },
        {
          id: _.uniqueId(),
          createTime: '2018-08-05',
          filed1: '20418',
          filed2: '85351',
          filed3: '66709',
          filed4: '30040',
          filed5: '20418',
          filed6: '42529',
          filed7: '41410',
          filed8: '6.58%',
          filed9: '5.42%',
          filed10: '12.12',
          filed11: '17.13',
          filed12: '7.25%',
          filed13: '5.64%',
          filed14: '12.81',
          filed15: '17.18',
          filed16: '-890.8',
          creatorName: '小明'
        },
        {
          id: _.uniqueId(),
          createTime: '2018-08-05',
          filed1: '20418',
          filed2: '85351',
          filed3: '66709',
          filed4: '30040',
          filed5: '20418',
          filed6: '42529',
          filed7: '41410',
          filed8: '6.58%',
          filed9: '5.42%',
          filed10: '12.12',
          filed11: '17.13',
          filed12: '7.25%',
          filed13: '5.64%',
          filed14: '12.81',
          filed15: '17.18',
          filed16: '-890.8',
          creatorName: '小明'
        },
        {
          id: _.uniqueId(),
          createTime: '2018-08-05',
          filed1: '20418',
          filed2: '85351',
          filed3: '66709',
          filed4: '30040',
          filed5: '20418',
          filed6: '42529',
          filed7: '41410',
          filed8: '6.58%',
          filed9: '5.42%',
          filed10: '12.12',
          filed11: '17.13',
          filed12: '7.25%',
          filed13: '5.64%',
          filed14: '12.81',
          filed15: '17.18',
          filed16: '-890.8',
          creatorName: '小明'
        },
        {
          id: _.uniqueId(),
          createTime: '2018-08-05',
          filed1: '20418',
          filed2: '85351',
          filed3: '66709',
          filed4: '30040',
          filed5: '20418',
          filed6: '42529',
          filed7: '41410',
          filed8: '6.58%',
          filed9: '5.42%',
          filed10: '12.12',
          filed11: '17.13',
          filed12: '7.25%',
          filed13: '5.64%',
          filed14: '12.81',
          filed15: '17.18',
          filed16: '-890.8',
          creatorName: '小明'
        }
      ]
    })
  },
  // 决策管理-新建 @author zhangshilong
  add() {
    // return ppp.post('decision/add', { projectId: localStorage.getItem('projectId') })
    return Promise.resolve({
      data: '123456'
    })
  },
  // 第一步-假设条件-新建
  addPostulated(body) {
    // return ppp.post('decision/addPostulated', body)
    return Promise.resolve({
      code: 200,
      message: '成功',
      data: [
        {
          id: '54818699131521799',
          serialNumber: '1',
          investorProjectId: 'PROJECT_TOTAL_INVESTOR',
          decisionId: '123456',
          investorProjectName: '项目总投资',
          data: '110556.73999999999',
          rateOfValueTax: null,
          inputTax: 6542.99,
          taxFreeInvestment: 104013.75
        },
        {
          id: '54818699131521800',
          serialNumber: '1.1',
          investorProjectId: 'ARCHITECTURE_PROJECT',
          decisionId: '123456',
          investorProjectName: '建筑工程',
          data: '81079.4',
          rateOfValueTax: 9.0,
          inputTax: 6493.79,
          taxFreeInvestment: 74585.61
        },
        {
          id: '54818699131521801',
          serialNumber: '1.2',
          investorProjectId: 'INSTALL_PROJECT',
          decisionId: '123456',
          investorProjectName: '安装工程',
          data: null,
          rateOfValueTax: 9.0,
          inputTax: 0.0,
          taxFreeInvestment: 0.0
        },
        {
          id: '54818699131521802',
          serialNumber: '1.3',
          investorProjectId: 'EQUIPMENT_AND_TOOL_COST',
          decisionId: '123456',
          investorProjectName: '设备及工具/器具购置费',
          data: '440.87',
          rateOfValueTax: 13.0,
          inputTax: 49.2,
          taxFreeInvestment: 391.67
        },
        {
          id: '54818699131521803',
          serialNumber: '1.4',
          investorProjectId: 'PROJECT_CONSTRUCTION_OTHER',
          decisionId: '123456',
          investorProjectName: '工程建设其他费',
          data: '10360.98',
          rateOfValueTax: 0.0,
          inputTax: 0.0,
          taxFreeInvestment: 10360.98
        },
        {
          id: '54818699131521804',
          serialNumber: '1.5',
          investorProjectId: 'READY_COST',
          decisionId: '123456',
          investorProjectName: '预备费',
          data: '10354.96',
          rateOfValueTax: 0.0,
          inputTax: 0.0,
          taxFreeInvestment: 10354.96
        },
        {
          id: '54818699131521805',
          serialNumber: '1.6',
          investorProjectId: 'CONSTRUCTION_PAY_INTEREST',
          decisionId: '123456',
          investorProjectName: '建设期利息',
          data: '8320.53',
          rateOfValueTax: 0.0,
          inputTax: 0.0,
          taxFreeInvestment: 8320.53
        },
        {
          id: '54818699131521806',
          serialNumber: '2',
          investorProjectId: 'DISCOUNT_RATE',
          decisionId: '123456',
          investorProjectName: '折现率',
          data: '5.8',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521807',
          serialNumber: '3',
          investorProjectId: 'ROI',
          decisionId: '123456',
          investorProjectName: '投资回报率',
          data: '1',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521808',
          serialNumber: '4',
          investorProjectId: 'FAIR_RATE_OF_PROFIT',
          decisionId: '123456',
          investorProjectName: '合理利润率',
          data: '6.6',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521809',
          serialNumber: '5',
          investorProjectId: 'PRICE_OF_MONEY',
          decisionId: '123456',
          investorProjectName: '贷款利率',
          data: '5.88',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521810',
          serialNumber: '6',
          investorProjectId: 'MODE_OF_REPAYMENT',
          decisionId: '123456',
          investorProjectName: '还款方式',
          data: '等额本息',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521811',
          serialNumber: '7',
          investorProjectId: 'ENTERPRISE_INCOME_TAX',
          decisionId: '123456',
          investorProjectName: '企业所得税',
          data: '25',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521812',
          serialNumber: '8',
          investorProjectId: 'ADDED_VALUE_TAX',
          decisionId: '123456',
          investorProjectName: '增值税税率',
          data: '0',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521813',
          serialNumber: '8.1',
          investorProjectId: 'ARCHITECT_ADDED_VALUE_TAX',
          decisionId: '123456',
          investorProjectName: '建筑业增值税率',
          data: '9',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521814',
          serialNumber: '8.2',
          investorProjectId: 'MODERN_SERVICE_ADDED_VALUE_TAX',
          decisionId: '123456',
          investorProjectName: '现代服务业增值税率',
          data: '6',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521815',
          serialNumber: '8.3',
          investorProjectId: 'CARGO_ADDED_VALUE_TAX',
          decisionId: '123456',
          investorProjectName: '货物增值税率',
          data: '13',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521816',
          serialNumber: '9',
          investorProjectId: 'URBAN_MAINTENANCE_AND_CONSTRUCTION_TAX',
          decisionId: '123456',
          investorProjectName: '城市维护建设税',
          data: '7',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521817',
          serialNumber: '10',
          investorProjectId: 'ADDITIONAL_EDUCATION_TAX',
          decisionId: '123456',
          investorProjectName: '教育费附加',
          data: '3',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521818',
          serialNumber: '11',
          investorProjectId: 'PLACE_ADDITIONAL_EDUCATION_TAX',
          decisionId: '123456',
          investorProjectName: '地方教育附加',
          data: '2',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521819',
          serialNumber: '12',
          investorProjectId: 'BENCHMARK_YIELD',
          decisionId: '123456',
          investorProjectName: '基准收益率',
          data: '5',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521820',
          serialNumber: '13',
          investorProjectId: 'CAPITAL_RATIO',
          decisionId: '123456',
          investorProjectName: '资本金比例',
          data: '20',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521821',
          serialNumber: '14',
          investorProjectId: 'SOCIAL_CAPITAL_EQUITY',
          decisionId: '123456',
          investorProjectName: '社会资本股权占比',
          data: '90',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521822',
          serialNumber: '15',
          investorProjectId: 'GOVERNMENT_CONTRIBUTIVE',
          decisionId: '123456',
          investorProjectName: '政府出资代表股权占比',
          data: '10',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521823',
          serialNumber: '16',
          investorProjectId: 'CONSTRUCTION_TIME',
          decisionId: '123456',
          investorProjectName: '建设期',
          data: '3',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521824',
          serialNumber: '17',
          investorProjectId: 'RUNNING_PERIOD',
          decisionId: '123456',
          investorProjectName: '运营期',
          data: '15',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521825',
          serialNumber: '18',
          investorProjectId: 'JIAN_AN_LOWER',
          decisionId: '123456',
          investorProjectName: '建安下浮率',
          data: '3',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        },
        {
          id: '54818699131521826',
          serialNumber: '19',
          investorProjectId: 'BENCHMARK_YIELD_DISCOUNT_RATE',
          decisionId: '123456',
          investorProjectName: '基准收益率（折现率）',
          data: '4.9',
          rateOfValueTax: null,
          inputTax: null,
          taxFreeInvestment: null
        }
      ]
    })
  },
  // 第二步-新建投资结构-新建 @author zhangshilong
  addStructure(body) {
    return ppp.post('decision/addStructure', body)
  }
}
