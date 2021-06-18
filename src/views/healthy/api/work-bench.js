/**
任务名称：TASK#2893 健康管理接口对接
开发人员：崔洛宜
日期：2020-04-07
任务类型：1、全新代码
**/
import { construction, getDownload } from '@/utils/axios'
const { post, get } = construction
//const baseURL = '/cs'
const projectId = localStorage.getItem('projectId')
export default {
  getCompanyList: data => {
    return post(`/labour/company/list`, { ...data, projectId })
  },
  //获取公司备案车辆统计表
  getRecordVehicleList: data => {
    return post(`/carManage/labourCompany/queryList`, data)
  },
  //导出车辆备案列表
  exportRecordVehicleList: data => {
    return getDownload('/carManage/labourCompany/export', data)
  },
  //获取车辆统一消毒记录
  getDisinfectionRecordList: data => {
    return post(`/sterilizeRecord/queryList`, data)
  },
  //导出车辆统一消毒记录
  exportCentralizedDisinfectionRecordList: data => {
    return getDownload('/sterilizeRecord/export', data)
  },
  //添加车辆统一消毒(批量添加)
  addCentralizedDisinfectionRecord: data => {
    return post(`/sterilizeRecord/saveRecord`, { ...data, projectId })
  },
  //获取车辆统一消毒记录详情
  getDisinfectionRecordDetail: id => {
    return get(`/sterilizeRecord/${id}/detail`, {})
  },

  //(统一消毒)编辑时获取车辆消毒记录
  getCarDisinfectionRecordList: sterilizeRecordId => {
    return post(`/sterilizeRecord/${sterilizeRecordId}/carList`, {})
  },
  //更新车辆消毒记录(统一消毒)
  updateCarDisinfectionRecordListById: data => {
    return post(`/carManage/sterilizeRecord/update`, data)
  },
  //(统一消毒)删除车辆消毒记录
  deleteCarDisinfectionRecord: (recordId, carId) => {
    return get(`/carManage/sterilizeRecord/${recordId}/delete/${carId}`, {})
  },

  //获取车辆列表
  getVehicleList: data => {
    return post(`/carManage/querylist`, data)
  },
  //导出车辆列表
  exportVehicleList: data => {
    return getDownload('/carManage/labourCompany/export', data)
  },
  //获取车辆详情
  getVehicleListDetail: carId => {
    return get(`/carManage/detail/${carId}`, {})
  },
  //添加车辆
  addVehicle: data => {
    return post(`/carManage/add`, { ...data, projectId })
  },
  //编辑车辆
  updateVehicle: data => {
    return post(`/carManage/update`, data)
  },
  //编辑车辆消毒记录列表
  getVehicleDisinfectionRecordList: data => {
    return post(`/carManage/sterilizeRecord/list`, data)
  },
  //删除车辆消毒记录
  deleteVehicleDisinfectionRecordById: (sterilizeRecordId, carId) => {
    return get(`/carManage/sterilizeRecord/${sterilizeRecordId}/delete/${carId}`, {})
  },
  //更新车辆消毒记录
  updateVehicleDisinfectionRecordById: data => {
    return post(`/carManage/sterilizeRecord/update`, { ...data, projectId })
  },
  //添加车辆消毒记录
  addVehicleDisinfectionRecord: data => {
    return post(`/carManage/sterilizeRecord/save`, { ...data, projectId })
  },
  //获取公司健康状态列表
  getCompanyHealthyTableList: data => {
    return post(`/company/health/monitor/statistics`, { ...data, projectId })
  },
  queryUserListWithCompany: data => {
    return post(`/employee/health/monitor/statistics`, { ...data, projectId })
  },
  //获取人员详情
  getLabourDetail: id => {
    return get(`/labour/employee/get/${id}`, {})
  },
  //获取人员监控记录
  getLabourMonitorList: data => {
    return post(`/health/monitor/list`, data)
  },
  //添加人员体温记录
  addLabourTemperature: data => {
    return post(`/health/monitor/add`, { ...data, projectId })
  },
  //更新人员体温记录
  updateLabourTemperature: data => {
    return post(`/health/monitor/update`, { ...data, projectId })
  },
  //删除人员体温记录
  deleteLabourTemperatureRecordById: recordId => {
    return get(`/health/monitor/delete/${recordId}`, {})
  }
}
