/*
 * @Description:
 * @Author:
 * @Date: 2020-01-09 18:05:43
 */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/getPageTitle'
import { getOrigin } from '@/utils'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/share'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // 审批通过或返回操作，返回基础系统审批列表
  if (to.name === 'ToAdmin' && from.name) {
    if (process.env.NODE_ENV !== 'development') {
      history.go(-1)
      return
    }
  }
  // start progress bar
  NProgress.start()
  // console.log(to)
  // set page title
  let webTitle = store.state.userPower.webTitle
  document.title = `${webTitle} - ${to.meta.title}`

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken || to.name === 'ToAdmin') {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      // 权限拦截，无权限跳转404页面
      // const power = store.state.userPower.power
      // if (!power.includes(to.name) && to.name !== '404') {
      //   next('/404')
      //   NProgress.done()
      //   return
      // }
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/logout')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      if (process.env.NODE_ENV === 'development') {
        next(`/login?redirect=${to.path}`)
      } else {
        location.href = `${getOrigin(-2)}/login`
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
  /*
   * @任务编号: 2522 || 树与模型交互,切换菜单清空选中的树形数据
   * @开发人员:申豪强
   * @日期:2020-03-20
   * @任务类型: 新代码
   */
  store.commit('bim/changeMajor', [])
  store.commit('bim/changeSingle', [])
  store.commit('bim/changeVersionModelIds', [])
})
