/*
 * @Description:金额千分位转换
 * @Version:
 * @Autor:
 * @Date: 2020-02-18 18:01:49
 * @LastEditTime: 2020-02-18 18:09:34
 */
const moneyFormat = num => {
  if (_.isUndefined(num)) return 0
  var c =
    num.toString().indexOf('.') !== -1 ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return c
}
export default moneyFormat
