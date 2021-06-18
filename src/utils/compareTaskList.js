import toFlat from './toFlat'
export default function (newList, oldList, key = 'id') {
  newList = toFlat(newList)
  oldList = toFlat(oldList)
  let intersection = _.intersectionBy(newList, oldList, key) //交集
  let addTaskList = _.differenceBy(newList, oldList, key) //第一个数组中，不包含第二各数组中元素的item组成的集合
  let deleteIds = _.differenceBy(oldList, newList, key).map(e => e.id)
  let updateTaskList = intersection.filter(
    e => !_.isEqual(_.omit(_.find(newList, { id: e.id }), '_XID'), _.omit(_.find(oldList, { id: e.id }), '_XID'))
    // _.omit 忽略_XID属性，其他属性构成的对象，判断是否相等
  )
  return {
    addTaskList,
    deleteIds,
    updateTaskList
  }
}
