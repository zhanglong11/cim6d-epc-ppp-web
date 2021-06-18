/*
 * @Description:
 * @Author:
 * @Date: 2020-01-15 09:09:52
 */

import { JSEncrypt } from 'jsencrypt'
/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// 获取其他平台地址
export const getOrigin = (num = 1, design) => {
  const origin = location.origin
  const lastOrigin = parseInt(origin[origin.length - 1]) + num
  const newOrigin = origin.substring(0, origin.length - 1) + lastOrigin
  let url = `${newOrigin}/#`
  if (design) {
    // 设计协同跳转专用
    url = `http://${location.hostname}:${design}/#`
  }
  return url
}

// 登录加密
export const userEncryption = obj => {
  let PUBLIC_KEY =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChqImB8Pz4nTh3UBbA5m9zb+YCIwvop1Zxr8Bii6xoEt6+znWy/2WVXMV/NH28Yq34cH68VdcKSikEQlGnAqhci+9rrjVo0/vS2/D6RJcihXqfST9ZOMFsRJgxAQWyIbjL/Gf7HD5NrCM54TE+YOk/P6eI5Nc8lbkxXEavrLDtOwIDAQAB'

  // 使用公钥加密
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(PUBLIC_KEY)
  let loginName = encrypt.encrypt(obj.loginName)
  let password = encrypt.encrypt(obj.password)
  return {
    loginName,
    password
  }
}
// 截取日期年月日时分秒
export const formatData = str => {
  if (!str) {
    return ''
  }
  return str.substring(0, 10)
}

/*
  获取日期函数 返回2018-06-06
  AddDayCount 天数
  getDateStr(0) //获取当前日期
  getDateStr(-10) //获取前10天日期
  getDateStr(20) //获取后20天日期
*/
export const getDateStr = (AddDayCount, type = 'datetime') => {
  let date = new Date()
  date.setDate(date.getDate() + AddDayCount)
  return getDateAll(date, type)
}
const getDateAll = (date, type) => {
  let year = date.getFullYear()
  //day获取当前几号，不足10补0
  let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
  //month获取当前月份的日期，不足10补0
  let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  let hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  let minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  let seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  let newDate = year + '-' + month + '-' + day
  if (type === 'datetime') {
    newDate += ' ' + hours + ':' + minutes + ':' + seconds
  }
  return newDate
}

// 计算两个日期时间差
export const getDays = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return '-'
  }
  let startDateStr = formatData(startDate).split('-') //将日期字符串分隔为数组,数组元素分别为年.月.日
  //根据年 . 月 . 日的值创建Date对象
  let startDateObj = new Date(startDateStr[0], startDateStr[1] - 1, startDateStr[2])
  let endDateStr = formatData(endDate).split('-')
  let endDateObj = new Date(endDateStr[0], endDateStr[1] - 1, endDateStr[2])
  let t1 = startDateObj.getTime()
  let t2 = endDateObj.getTime()
  let dateTime = 1000 * 60 * 60 * 24 //每一天的毫秒数
  let minusDays = Math.floor((t2 - t1) / dateTime) //计算出两个日期的天数差
  let days = Math.abs(minusDays) //取绝对值
  return days
}
