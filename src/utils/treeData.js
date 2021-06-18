export function toTreeData(data, id, pid, name, code) {
  let parent = []
  for (let i = 0; i < data.length; i++) {
    if (data[i][pid] !== '0') {
    } else {
      let obj = {
        label: data[i][name],
        id: data[i][id],
        code: data[i][code],
        children: []
      }
      parent.push(obj)
    }
  }
  // console.log(parent)
  children(parent)
  function children(parent) {
    if (data.length !== 0) {
      for (let i = 0; i < parent.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (parent[i].id === data[j].pid) {
            let obj = {
              label: data[j][name],
              id: data[j][id],
              code: data[j][code],
              children: []
            }
            parent[i].children.push(obj)
          }
        }
        children(parent[i].children)
      }
    }
  }
  return parent
}
export default {
  toTreeData(data, id, pid, label) {
    return parent
  }
}
