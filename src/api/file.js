/*
 * @Description:文件接口
 * @Version:
 * @Autor:
 * @Date: 2020-02-21 10:16:26
 * @LastEditTime: 2020-02-21 10:42:59
 */
import axios, { post, get, getDownload } from '@/utils/axios' //bug号：1181、修改人：董渊海、修改时间：2020-03-20

export default {
  //文件列表查询 @author sunboqiang
  getFileList: ids => {
    return axios.file.post('file/manage/list', ids)
  },
  uploadFile: data => {
    return axios.file.post(`/file/commonFile/upload`, data, {
      'Content-Type': 'multipart/form-data'
    })
  },
  //根据id下载文件
  downloadFileById: id => {
    //bug号：1181、修改人：董渊海、修改时间：2020-03-20
    return getDownload(`/noToken/file/commonFile/download/${id}`, {})
  },
  // 获取一级菜单下拉
  getFirstList: data => {
    return post('/cim6d/system/project/organ/query', data)
  },
  //获取文档类型
  // getFileList: data => {
  //   return post('/file/fileManage/list', data)
  // },
  //新增文件夹
  addFolder: data => {
    return post('/file/fileManage/addFolder', data)
  },
  // 重命名
  rename: data => {
    return post(`/file/fileManage/rename`, data)
  },
  //新增文件夹
  saveFile: data => {
    return post('/file/projectFile/saveFile', data)
  },
  // 下载文件
  download: data => {
    return post('/file/commonFile/download/' + data, {}, { responseType: 'blob' })
  },
  // 删除文件
  deleteFile: ({ id, type }) => {
    return get(`/file/projectFile/${id}/delete/${type}`, {})
  },
  // 查询外部协作
  externalCollaborationList: data => {
    return post('/file/fileManage/externalCollaborationList', data)
  },
  // 文件移动、复制、内部共享
  copyMoveFile: data => {
    return post('/file/projectFile/copyMoveFile', data)
  },
  getTree: data => {
    return post('/file/projectFile/selectDepartmentFolderTree', data)
  },
  // 外部协作操作
  handleExternalCollaboration: data => {
    return post('/file/projectFile/externalCollaboration', data)
  },
  // 查询权限
  selectFolderAccess: folderId => {
    return post(`file/projectFile/${folderId}/selectFolderAccess`, {})
  },
  // 文件历史流程查询
  getHistoryList(id) {
    return post(`process/instance/file/history/list/${id}`, {})
  },
  // 根据提取码获取外部协作
  selectExternalCollaborationFile(data) {
    return get(`/file/projectFile/selectExternalCollaborationFile`, data)
  },
  // 设置文档权限
  setAccess(data) {
    return post('file/projectFile/setFolderAccess', data)
  },
  getAccess(id) {
    return post(`/file/projectFile/${id}/selectFolderAccess`, {})
  }
}
