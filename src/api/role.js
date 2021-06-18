/*
 * @Author: 耿为刚 创建
 * @Date: 2020-05-23
 * @Last Modified by: gengweigang
 */

import http from '@/utils/axios'

export const roleApi = {
  // 获取用户所有权限
  getSourcePower: () => {
    return http({
      url: '/cim6d/system/power/source',
      method: 'get'
    })
  },

  /**
   * 获取用户可用权限
   * @param projectId 项目ID
   * @param {Boolean} [isParticipant=false]  是否是参与方项目
   * @returns {Promise}
   */
  getAvailablePower: (projectId, isParticipant = false) => {
    return http({
      url: `/cim6d/system/project${isParticipant ? '/participant' : ''}/power/available/${projectId}`,
      method: 'get'
    })
  },
  // 获取用户可用权限
  // getAvailablePower: () => {
  //   return http({
  //     url: '/cim6d/system/power/available',
  //     method: 'get'
  //   })
  // },
  // 角色分类&角色树
  getTreePermissionPower: data => {
    return http({
      url: '/cim6d/system/permission/role/tree',
      method: 'post',
      data
    })
  },
  // 新建角色分类
  addCategoryRole: data => {
    return http({
      url: '/cim6d/system/permission/role/category/add',
      method: 'post',
      data
    })
  },
  // 编辑角色分类
  updateCategoryRole: data => {
    return http({
      url: '/cim6d/system/permission/role/category/update',
      method: 'post',
      data
    })
  },
  // 删除角色分类
  deleteCategoryRole: id => {
    return http({
      url: `/cim6d/system/permission/role/category/delete/${id}`,
      method: 'get'
    })
  },
  // 新建角色
  addRole: data => {
    return http({
      url: '/cim6d/system/permission/role/add',
      method: 'post',
      data
    })
  },
  // 编辑角色
  updateRole: data => {
    return http({
      url: '/cim6d/system/permission/role/update',
      method: 'post',
      data
    })
  },
  // 删除角色
  deleteRole: id => {
    return http({
      url: `/cim6d/system/permission/role/delete/${id}`,
      method: 'get'
    })
  },
  // 获取角色已分配权限
  getPowerListRole: roleId => {
    return http({
      url: `/cim6d/system/permission/role/power/list/${roleId}`,
      method: 'get'
    })
  },
  // 保存权限
  bindPowerRoleUser: data => {
    return http({
      url: '/cim6d/system/permission/user/role/power/bind',
      method: 'post',
      data
    })
  }
}
