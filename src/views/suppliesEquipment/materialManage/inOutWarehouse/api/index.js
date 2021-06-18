/**
任务名称：出入库接口对接
开发人员：许雷
日期：2020-07-01
任务类型：1、全新代码
**/
import axios, { bimSynergy } from '@/utils/axios'
const { post, get } = bimSynergy
//const baseURL = '/cs'
// const projectId = localStorage.getItem('projectId')
export default {
  //查询入库列表
  getInList: data => {
    return axios.material.post(`/materialInput/page`, data)
  },

  //查询出库列表
  getOutList: data => {
    return axios.material.post(`/materialOutput/page`, data)
  },

  //新建入库单
  newInput: data => {
    return axios.material.post(`/materialInput/add`, data)
  },

  //新建出库单
  newOutput: data => {
    return axios.material.post(`/materialOutput/add`, data)
  },

  //编辑入库单
  editInput: data => {
    return axios.material.post(`/materialInput/update`, data)
  },

  //编辑出库单
  editOutput: data => {
    return axios.material.post(`/materialOutput/update`, data)
  },

  //查询入库单详情
  getInDetail: id => {
    return axios.material.get(`/materialInput/get/${id}`)
  },

  //查询出库单详情
  getOutDetail: id => {
    return axios.material.get(`/materialOutput/get/${id}`)
  },

  //查询材料明细
  getWarehouseDetail: data => {
    return axios.material.post(`/material/list`, data)
  }

  //日志详情
  // getLogDetail: id => {
  //   return get(`/dailydiary/get/${id}`)
  // }

  // 质量问题关联
  // qualityProblemBimBind: data => {
  //   return post(`/qualityProblemBimBind/bind`, data)
  // },
}
