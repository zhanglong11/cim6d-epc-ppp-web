/**
 任务名称：TASK#2924	设备监控接口
 开发人员：崔洛宜
 日期：2020-04-11
 任务类型：1、全新代码
 **/
import http, { construction } from '@/utils/axios'
const { post, get } = construction
import request from '@/utils/axios'
const projectId = localStorage.getItem('projectId')
export default {
  //监控设备列表
  getMonitorList: data => {
    return post(`/monitor/device/queryList`, data)
  },
  //停用设备
  stopMonitor: id => {
    return get(`/monitor/device/${id}/stop`, {})
  },
  openMonitor: id => {
    return get(`/monitor/device/${id}/open`, {})
  },
  //监控设备详情
  getMonitorDetail: deviceId => {
    return post(`/monitor/device/detail/${deviceId}`, {})
  },
  //获取设备监控视频列表(通过设备id)
  getVideoList: data => {
    return post(`/monitor/device/monitorRecord/queryList`, data)
  },
  //获取设备监控视频列表(通过监控区域)
  getVideoListByArea: data => {
    return post(`/monitor/device/monitorRecord/queryList`, data)
  },
  deleteVideoById: id => {
    return get(`/monitor/device/monitorRecord/${id}/delete`, {})
  },
  //获取设备列表
  getDeviceList: data => {
    return post(`/monitor/device/queryList`, data)
  },

  //添加监控设备
  addMonitor: data => {
    return post(`/monitor/device/save`, { ...data, projectId })
  },
  //更新监控设备
  updateMonitor: data => {
    return post(`/monitor/device/update`, data)
  },
  //获取区域实时监控
  getRealMonitorList: data => {
    return post(`/monitor/device/area/deviceList`, data)
  },
  //监控视频列表下载
  videoMonitorDown: data => {
    return getDownload('/monitor/videorecord/down', data)
  }
}
