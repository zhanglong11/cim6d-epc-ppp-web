import statusList from '@/lib/paramList/statusList'
import selfCheckTypeList from '@/lib/paramList/selfCheckTypeList'
import safe from '@/lib/paramList/safe' //安全管理
import quality from '@/lib/paramList/quality'
import device from '@/lib/paramList/device'
import cost from '@/lib/paramList/cost'

export default {
  statusList, //状态
  selfCheckTypeList, //状态
  ...safe,
  ...quality,
  ...device,
  ...cost
}
