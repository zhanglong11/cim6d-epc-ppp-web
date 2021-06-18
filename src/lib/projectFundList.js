/*
 * @Description:项目经费核算明细配置
 * @Author:
 * @Date: 2020-03-09 14:59:00
 */

/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9be3e5c65eebd73fa421dd7692c70588a8ed0e99
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算列表接口，查询核算下的项目经费明细接口，项目经费明细新增(编辑)接口，添加项目经费核算明细详情页
@补加代码注释日期: 2020-04-11
*/
export default [
  {
    id: 1,
    parentId: 0,
    code: 'indirect.expenses',
    name: '间接费用',
    unit: '',
    money: '',
    fullMoney: '',
    remark: '',
    children: [
      {
        id: 2,
        parentId: 1,
        code: 'employee.compensation',
        name: '职工薪酬',
        unit: '',
        money: '',
        fullMoney: '',
        remark: '',
        children: [
          {
            id: 3,
            parentId: 2,
            code: 'staff.salaries',
            name: '职工工资',
            unit: '元',
            money: '',
            fullMoney: '',
            remark: ''
          },
          {
            id: 4,
            parentId: 2,
            code: 'casual.wages',
            name: '临时工工资',
            unit: '元',
            money: '',
            fullMoney: '',
            remark: ''
          },
          {
            id: 5,
            parentId: 2,
            code: 'five.social.insurance.and.one.housing.fund',
            name: '五险一金',
            unit: '元',
            money: '',
            fullMoney: '',
            remark: ''
          },
          {
            id: 6,
            parentId: 2,
            code: 'labor.union.dues',
            name: '工会经费',
            unit: '元',
            money: '',
            fullMoney: '',
            remark: ''
          },
          {
            id: 7,
            parentId: 2,
            code: 'personnel.education.fund',
            name: '职工教育经费',
            unit: '元',
            money: '',
            fullMoney: '',
            remark: ''
          },
          {
            id: 8,
            parentId: 2,
            code: 'other.employee.compensation',
            name: '其他职工薪酬',
            unit: '元',
            money: '',
            fullMoney: '',
            remark: ''
          }
        ]
      },
      {
        id: 9,
        parentId: 1,
        code: 'office.allowance',
        name: '办公费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 10,
        parentId: 1,
        code: 'travel.expense',
        name: '差旅费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 11,
        parentId: 1,
        code: 'labor.protection.fees',
        name: '劳动保护费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 12,
        parentId: 1,
        code: 'amortization.of.temporary.installation',
        name: '临时设施摊销',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 13,
        parentId: 1,
        code: 'depreciation.cost',
        name: '折旧费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 14,
        parentId: 1,
        code: 'repair.charge',
        name: '修理费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 15,
        parentId: 1,
        code: 'article.of.consumption',
        name: '低值易耗品摊销',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 16,
        parentId: 1,
        code: 'safety.measure.fee',
        name: '安全措施费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 17,
        parentId: 1,
        code: 'signage.fee',
        name: '标识标牌费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 18,
        parentId: 1,
        code: 'vehicle.usage.fee',
        name: '车辆使用费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 19,
        parentId: 1,
        code: 'publicity.expenses',
        name: '宣传费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 20,
        parentId: 1,
        code: 'land.requisition.and.relocation.fees',
        name: '征地拆迁费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 21,
        parentId: 1,
        code: 'indirect.expenses.other',
        name: '其他',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      }
    ]
  },
  {
    id: 22,
    parentId: 0,
    code: 'administration.expense',
    name: '管理费用',
    unit: '',
    money: '',
    fullMoney: '',
    remark: '',
    children: [
      {
        id: 23,
        parentId: 22,
        code: 'intermediary.organs',
        name: '聘请中介机构费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 24,
        parentId: 22,
        code: 'consulting.fee',
        name: '咨询费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 25,
        parentId: 22,
        code: 'legal.fare',
        name: '诉讼费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 26,
        parentId: 22,
        code: 'taxation.expense',
        name: '税金',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 27,
        parentId: 22,
        code: 'research.and.development.expenses',
        name: '研究与开发费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 28,
        parentId: 22,
        code: 'business.entertainment',
        name: '业务招待费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 29,
        parentId: 22,
        code: 'tender.preparation.and.tender.fee',
        name: '标书编制及投标费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 30,
        parentId: 22,
        code: 'fixed.charge',
        name: '上级管理费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 30,
        parentId: 22,
        code: 'administration.expense.other',
        name: '其他',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      }
    ]
  },
  {
    id: 31,
    parentId: 0,
    code: 'financial.cost',
    name: '财务费用',
    unit: '',
    money: '',
    fullMoney: '',
    remark: '',
    children: [
      {
        id: 32,
        parentId: 31,
        code: 'interest.expense',
        name: '利息支出',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 33,
        parentId: 31,
        code: 'interest.income',
        name: '利息收入',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 34,
        parentId: 31,
        code: 'exchange.gain.or.loss',
        name: '汇兑损益',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 35,
        parentId: 31,
        code: 'handling.change.of.finance.authority',
        name: '金融机构手续费',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      },
      {
        id: 36,
        parentId: 31,
        code: 'financial.cost.other',
        name: '其他',
        unit: '元',
        money: '',
        fullMoney: '',
        remark: ''
      }
    ]
  }
]
