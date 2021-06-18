import http from '@/utils/axios'
import { construction, getDownload, postDownload, system } from '@/utils/axios'
const { get, post } = construction
export default {
  //添加合同
  addContract: data => {
    return post('/contractBaseinfo/add', data)
  },
  getContractList: data => {
    return post('/contractBaseinfo/list', data)
  },
  deleteContractById: id => {
    return post(`/contractBaseinfo/delete/${id}`, {})
  },
  getContractById: id => {
    return get(`/contractBaseinfo/get/${id}`, {})
  },
  updateContractById: data => {
    return post(`/contractBaseinfo/update`, data)
  },
  //合同清单计量分解树结构
  getContractMeteringUnitDivisionTreeData: data => {
    return post(`/contractMeteringUnitDivision/tree`, data)
  },
  //审核接口
  handleCheck: data => {
    return post(`/check`, data)
  },
  //添加合同清单信息
  addOrderFile: data => {
    return post(`/contractBaseinfo/upload/inventory`, data, { 'Content-Type': 'multipart/form-data' })
  },
  deleteOrderById: data => {
    return post(`/contractBaseinfo/delete/inventoryAttachment/${data}`, {})
  },
  /**
   任务名称：TASK#2828 3月7号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释(添加加快)
   **/
  //下载人材机模板
  downloadRCJ: data => {
    return getDownload(`/contractBaseinfo/download/inventoryQuotaTemplate`, { ...data })
  },
  uploadRCJ: data => {
    return post('/contractBaseinfo/import/inventoryQuota', data, {
      'Content-Type': 'multipart/form-data'
    })
  },
  /**
   任务名称：TASK#2790 3月2号注释
   开发人员：崔洛宜
   日期：2020-03-02
   任务类型：注释
   **/
  //获取分布分项工程和单价措施项
  getSubprojectUnivalenceMeasureList: data => {
    return post('/contractInventorySubprojectUnivalenceMeasure/contract/list', data)
  },
  /**
   任务名称：TASK#2791 3月3号注释
   开发人员：崔洛宜
   日期：2020-03-03
   任务类型：注释
   **/
  //导出分布分项工程和单价措施项
  exportSubprojectUnivalenceMeasureList: data => {
    return post('/contractInventorySubprojectUnivalenceMeasure/export', data, {
      responseType: 'blob'
    })
  },
  //获取总价措施项目清单
  getContractInventoryTotalPriceMeasure: data => {
    return post('/contractInventoryTotalPriceMeasure/list', data)
  },
  //导出总价措施项目清单
  exportContractInventoryTotalPriceMeasure: data => {
    return post('/contractInventoryTotalPriceMeasure/export', data, {
      responseType: 'blob'
    })
  },
  //获取暂列金额明细
  getContractInventoryProvisionalMoneyDetail: data => {
    return post('/contractInventoryProvisionalMoneyDetail/list', data)
  },
  //导出暂列金额明细
  exportContractInventoryProvisionalMoneyDetail: data => {
    return post('/contractInventoryProvisionalMoneyDetail/export', data, { responseType: 'blob' })
  },

  //获取材料(工程设备)暂估单价和调整表
  getContractInventoryMaterialInterimValuation: data => {
    return post('/contractInventoryMaterialInterimValuation/list', data)
  },
  //导出材料(工程设备)暂估单价和调整表
  exportContractInventoryMaterialInterimValuation: data => {
    return post('/contractInventoryMaterialInterimValuation/export', data, { responseType: 'blob' })
  },
  //获取专业工程暂估单价和调整表
  getContractInventorySpecialInterimValuation: data => {
    return post('/contractInventorySpecialInterimValuation/list', data)
  },
  //导出专业工程暂估单价和调整表
  exportContractInventorySpecialInterimValuation: data => {
    return post('/contractInventorySpecialInterimValuation/export', data, { responseType: 'blob' })
  },
  //获取租赁采购清单
  getContractInventoryPurchase: data => {
    return post('/contractInventoryPurchase/list', data)
  },
  //导出租赁采购清单
  exportContractInventoryPurchase: data => {
    return post('/contractInventoryPurchase/export', data, { responseType: 'blob' })
  },
  //获取分包项目清单
  getContractInventorySubpackage: data => {
    return post('/contractInventorySubpackage/list', data)
  },
  //导出分包项目清单
  exportContractInventorySubpackage: data => {
    return post('/contractInventorySubpackage/export', data, { responseType: 'blob' })
  },
  /**
   任务名称：TASK#2826 3月5号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释
   **/
  //获取计日工表
  getContractInventoryDayWorks: data => {
    return post('/contractInventoryDayWorks/list', data)
  },
  //导出计日工表
  exportContractInventoryDayWorks: data => {
    return post('/contractInventoryDayWorks/export', data, { responseType: 'blob' })
  },
  //获取总承包服务费计价表
  getContractInventoryContractServiceFee: data => {
    return post('/contractInventoryContractServiceFee/list', data)
  },
  //导出总承包服务费计价表
  exportContractInventoryContractServiceFee: data => {
    return post('/contractInventoryContractServiceFee/export', data, { responseType: 'blob' })
  },
  //获取规费税金项目计价表
  getContractInventoryTaxItem: data => {
    return post('/contractInventoryTaxItem/list', data)
  },
  //导出规费税金项目计价表
  exportContractInventoryTaxItem: data => {
    return post('/contractInventoryTaxItem/export', data, { responseType: 'blob' })
  },
  //获取主要材料价格表
  getContractInventoryMaterialPrice: data => {
    return post('/contractInventoryMaterialPrice/list', data)
  },
  //导出主要材料价格表
  exportContractInventoryMaterialPrice: data => {
    return post('/contractInventoryMaterialPrice/export', data, { responseType: 'blob' })
  },
  /**
   任务名称：BUG1498/合同管理-详情-人材机信息是写死的
   开发人员：崔洛宜
   日期：2020-04-07
   BUG类型：测试人员发现的研发自测未通过引起的BUG
   **/
  //获取人材机列表
  getPMMList: data => {
    return post('/contractBaseinfo/selectInventoryQuota', data)
  },
  //导出人材机表
  exportPMMList: (id, inventoryCategory) => {
    return getDownload(`/contractBaseinfo/${id}/export/inventoryQuota/${inventoryCategory}`)
  },
  /**
   任务名称：TASK#2792 3月4号注释
   开发人员：崔洛宜
   日期：2020-03-04
   任务类型：注释
   **/
  //计量单元划分添加同一级
  addThisLevel: data => {
    return post('/contractMeteringUnitDivision/add', data, { responseType: 'blob' })
  },
  //删除计量单元划分
  deleteContractMeteringUnitDivisionById: id => {
    return post(`/contractMeteringUnitDivision/delete/${id}`, {})
  },
  //获取清单项目列表
  getDecomposeList: data => {
    return post('/contractInventorySubprojectUnivalenceMeasure/decompose/list', data, {
      timeout: 30000
    })
  },
  //获取计量单元划分列表
  getInventoryDecomposeList: data => {
    return post('/contractMeteringUnitDivision/inventoryDecompose/list', data)
  },
  /**
   任务名称：TASK#2827 3月6号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释(添加接口)
   **/
  //添加单元划分清单项目
  updateInventoryDecompose: data => {
    return post('/contractMeteringUnitDivision/setInventoryDecompose', data)
  },
  //设置分解核实量
  setDecomposingQuantity: data => {
    return post('/contractMeteringUnitDivision/setDecomposingQuantity', data)
  },
  /**
   任务名称：BUG1444/合同清单-总承包合同-合同清单分解-选择清单项目：选择好清单后，点击确定，清单中的部分字段值不显示
   开发人员：崔洛宜
   日期：2020-03-31
   BUG类型：测试人员发现的研发自测未通过引起的BUG
   **/
  //删除清单关联
  deleteDecomposingQuantity(id) {
    return get(`/contractMeteringUnitDivision/deleteDecomposingQuantity/${id}`, {})
  },
  /**
   任务名称：TASK#2746/合同管理->清单关联
   开发人员：崔洛宜
   日期：2020-03-27
   任务类型：遗漏页面
   **/
  //获取物资计划
  getMaterialList: data => {
    return post('/project/material/list', data)
  },
  //物资和清单绑定
  bindOrderMaterial: data => {
    return post('/contractInventoryPurchase/bind/material', data)
  },
  //取消物资和清单绑定
  unbindOrderMaterial: id => {
    return get(`/contractInventoryPurchase/${id}/cancelBind/material`, {})
  },
  //分包和清单绑定
  bindPackageOrder: data => {
    return post('/contractInventoryPurchase/bind/material', data)
  },
  //取消分包和清单绑定
  unbindPackageOrder: id => {
    return get(`/contractInventoryPurchase/${id}/cancelBind/material`, {})
  },
  //上传纸质文件操作
  uploadPaperContract: data => {
    return post('/contractBaseinfo/uploadPaper', data)
  },
  // 查询企业信息
  getCompanyInfo: () => {
    return http.system.get(`/cim6d/system/company/info/get`)
  },
  // 获取所有企业列表（除当前企业） @author yangjiaqi
  queryCompany: () => {
    return http.admin.get(`/admin/copanyBase/nameList`)
  }
}
