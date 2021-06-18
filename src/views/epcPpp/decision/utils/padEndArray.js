import _ from 'lodash'

/**
 * 补齐二维数组长度
 * @param {Array} arr  二维数组
 * @param {*} placeholder 要填充的值
 * @returns {Array}
 */
export default function (arr, placeholder = null) {
  if (!_.size(arr)) return false
  arr = _.cloneDeep(arr)
  const maxLength = _.maxBy(arr, 'length').length
  _.forEach(arr, arr2 => {
    if (arr2.length < maxLength) {
      arr2.push(...new Array(maxLength - arr2.length).fill(placeholder))
    }
  })
  return arr
}
