import axios from '@/utils/axios'

export default {
  //采购单列表
  getPurchaseOrderList: param =>
    axios.material.post(`/materialPurchase/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //采购单添加
  getPurchaseOrderAdd: param =>
    axios.material.post(`materialPurchase/save`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //采购单添加并提交
  getPurchaseOrderSubmit: param =>
    axios.material.post(`materialPurchase/saveAndSubmit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //添加选择列表数据
  getMaterialList: param =>
    axios.material.post(`material/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //更新
  update: param =>
    axios.material.post(`/equipment/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //采购单验收
  accept: param =>
    axios.material.post(`/materialPurchase/accept`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //采购
  purchase: param =>
    axios.material.post(`materialPurchase/purchase`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //采购单删除
  getPurchaseOrderDelete: id => axios.material.post(`/materialPurchase/delete/${id}`),

  // 采购单详情
  getPurchaseOrderDetail: id => axios.material.get(`/materialPurchase/get/${id}`),
  //材料申请列表
  getMaterialApplyList: param =>
    axios.material.post(`/materialApply/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //材料申请添加
  getMaterialApplyAdd: param =>
    axios.material.post(`materialApply/decorateSave`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //材料申请添加-施工
  getMaterialApplyConstructionAdd: param =>
    axios.material.post(`materialApply/constructionSave`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //材料使用申请删除
  getMaterialApplyDelete: id => axios.material.get(`/materialApply/delete/${id}`),
  // 采购单详情
  getMaterialApplyDetail: id => axios.material.get(`/materialApply/get/${id}`),
  //材料申请添加并提交-施工
  getMaterialApplyConstructionUpdate: param =>
    axios.material.post(`materialApply/constructionUpdate`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  getMaterialApplyUpdate: param =>
    axios.material.post(`materialApply/decorateUpdate`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
