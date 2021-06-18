export const confirmationStatusList = [
  {
    label: '草稿',
    value: 0
  },
  {
    label: '待审核',
    value: 1
  },
  {
    label: '已通过',
    value: 2
  },
  {
    label: '已驳回',
    value: 3
  }
]
export const getConfirmationStatusByValue = value => _.find(confirmationStatusList, { value })?.label ?? ''
export const confirmationStatusFormatter = ({ cellValue }) => getConfirmationStatusByValue(cellValue)
