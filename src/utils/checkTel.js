export default function (rule, value, callback) {
  if (!value) {
    callback()
  } else {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      callback(new Error('请输入正确的电话号码!'))
    } else {
      callback()
    }
  }
}
