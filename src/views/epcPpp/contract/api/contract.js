import http from '@/utils/axios'
export const contractApi = {
  //获取合同管理列表
  getCcpContract: data => {
    return http.epcPPP({
      url: '/contract/list',
      method: 'post',
      data
    })
  },
  //获取详详情
  getdetailCcpContract: id => {
    return http.epcPPP({
      url: `/contract/get/${id}`,
      method: 'get'
    })
  },
  //添加新建
  getAddCcpContract: data => {
    return http.epcPPP({
      url: '/contract/add',
      method: 'post',
      data
    })
  },

  //编辑
  getUpdateContract: data => {
    return http.epcPPP({
      url: '/contract/update',
      method: 'post',
      data
    })
  },

  //删除新建
  getdeleteContract: id => {
    return http.epcPPP({
      url: `/contract/delete/${id}`,
      method: 'get'
    })
  },
  //获取甲乙人名
  getFistSPeopleName: data => {
    return http.epcPPP({
      url: '/contract/partnerList',
      method: 'post',
      data
    })
  }
}
