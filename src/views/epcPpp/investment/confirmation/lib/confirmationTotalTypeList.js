export const confirmationTotalTypeList = [
  {
    label: '工程建设费用',
    value: 1
  },
  {
    label: '工程建设其他费用',
    value: 2
  },
  {
    label: '项目建设期利息',
    value: 3
  }
]
export const getConfirmationTotalTypeByValue = value => _.find(confirmationTotalTypeList, { value })?.label ?? ''
export const confirmationTotalTypeFormatter = ({ cellValue }) => getConfirmationTotalTypeByValue(cellValue)
