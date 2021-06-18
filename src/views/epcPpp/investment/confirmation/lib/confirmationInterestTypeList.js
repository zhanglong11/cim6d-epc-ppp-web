export const confirmationInterestTypeList = [
  {
    label: '截止上期累计确认',
    value: 1
  },
  {
    label: '本期确认',
    value: 2
  },
  {
    label: '截止本期累计确认',
    value: 3
  }
]
export const getConfirmationInterestTypeByValue = value => _.find(confirmationInterestTypeList, { value })?.label ?? ''
export const confirmationInterestTypeFormatter = ({ cellValue }) => getConfirmationInterestTypeByValue(cellValue)
