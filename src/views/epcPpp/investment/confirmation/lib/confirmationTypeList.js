export const confirmationTypeList = [
  {
    label: '建设费用确认单',
    value: 1
  },
  {
    label: '总投资确认单',
    value: 2
  }
]
export const getConfirmationTypeByValue = value => _.find(confirmationTypeList, { value })?.label ?? ''
export const confirmationTypeFormatter = ({ cellValue }) => getConfirmationTypeByValue(cellValue)
