import { MessageBox, Message } from 'element-ui'
export default (list, name = 'name') => {
  if (!list.length) {
    Message.info('您当前没有选中')
    return Promise.reject('您当前没有选中')
  }

  const nameList = list
    .filter(r => r[name])
    .map(r => r[name])
    .map(text => `<span style='color:red;padding:4px;'>${text}</span>`)

  let msg =
    nameList.length > 3
      ? `<p>确定删除${nameList}等${nameList.length}项吗？</>`
      : nameList.length
      ? `<p>确定删除${nameList}吗？</>`
      : `确定删除吗`

  return MessageBox.confirm(msg, '提示', { dangerouslyUseHTMLString: true, type: 'warning' })
}
