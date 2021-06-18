import axios from '@/utils/axios'
export default {
  //实测实量-列表
  getMeasureRecordList: param =>
    axios.safety.post(`measureRecord/page`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //实测实量-添加
  getMeasureRecordAdd: param =>
    axios.safety.post(`measureRecord/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //实测实量-修改
  getMeasureRecordUpdate: param =>
    axios.safety.post(`measureRecord/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //实测实量-删除
  getMeasureRecordDelete: id => axios.safety.get(`/measureRecord/delete/${id}`),
  //实测实量-详情
  getMeasureRecordDetail: id => axios.safety.get(`/measureRecord/view/${id}`),
  //实测实量-测量记录
  getDetailInfo: id => axios.safety.get(`/measureHistory/list/${id}`),
  //进行复测
  getMeasureRecordInfo: (id, arr) => axios.safety.post(`/measureRecord/${id}/repetitionMeasure`, arr),
  //实测实量-测点明细列表
  getMeasureDetailList: param =>
    axios.safety.post(`measureDetail/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //批量添加单体
  getDrawingLibraryAdd: param =>
    axios.construction.post(`constructionDrawingLibrary/adds`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //修改节点图纸节点名称
  getDrawingLibraryUpdate: param =>
    axios.construction.post(`constructionDrawingLibrary/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //图纸列表信息
  getDrawingLibraryList: param =>
    axios.construction.post(`constructionDrawingLibrary/page`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //单体树形结构数据列表
  getTreeListInfo: id => axios.construction.get(`/constructionDrawingLibrary/tree/${id}`),
  //单体信息列表
  getListInfo: id => axios.construction.get(`/constructionDrawingLibrary/get/${id}`),

  //标准库添加
  getStandardLibraryAdd: param =>
    axios.safety.post(`standard/library/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //标准库删除
  getStandardLibraryDelete: id => axios.safety.get(`/standard/library/delete/${id}`),
  // 标准库编辑
  getStandardLibraryEdit: param =>
    axios.safety.post(`standard/library/edit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  // 标准库列表
  getStandardLibraryList: param =>
    axios.safety.post(`standard/library/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  // 测量指标-列表
  getStandardMeasureList: param =>
    axios.safety.post(`standard/measure/index/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  // 测量指标-添加
  getStandardMeasureAdd: param =>
    axios.safety.post(`standard/measure/index/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  // 测量指标-编辑
  getStandardMeasureEdit: param =>
    axios.safety.post(`standard/measure/index/edit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //测量指标-删除
  getStandardMeasureDelete: id => axios.safety.get(`/standard/measure/index/delete/${id}`),
  //测量指标-详情
  getStandardMeasureView: id => axios.safety.get(`/standard/measure/index/view/${id}`),
  //根据图片id查找url
  getImgUrl: id => axios.file.get(`/file/manage/get/${id}`),

  //图纸库
  //图纸库-新建
  getDrawingAdd: param =>
    axios.construction.post(`construction/drawing/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //图纸库-编辑
  getDrawingUpdate: param =>
    axios.construction.post(`construction/drawing/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //图纸库-列表
  getDrawingList: param =>
    axios.construction.post(`construction/drawing/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //  //图纸库-详情
  getDrawingDetail: id => axios.construction.get(`/construction/drawing/get/${id}`),
  //  //图纸库-删除
  getDrawingDelete: id => axios.construction.get(`/construction/drawing/delete/${id}`),
  // 根据节点ID获取当前节点下所有的图纸列表
  getAllDrawingsByNode: id => axios.construction.get(`/constructionDrawingLibrary/getAllDrawings//${id}`),
  //批量修改房间名称
  updateRootName: param =>
    axios.construction.post(`/constructionDrawingLibrary/updateBatchName`, {
      ...param
    })
}
