/*
 * @Description:
 * @Author:
 * @Date: 2020-01-16 18:46:31
 */
import store from '@/store'
export default {
  inserted: async function (el, binding, vnode) {
    //如果有权限
    let privilegeKey = binding.value
    let accessList = store.state.app.accessList
    let node = _.find(accessList, { powerKey: privilegeKey })
    _.isEmpty(node) && el.parentNode.removeChild(el)
  }
}
