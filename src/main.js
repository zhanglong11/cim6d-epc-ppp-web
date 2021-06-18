/*
 * @Description:
 * @Author:
 * @Date: 2020-01-19 15:58:42
 */
import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/assets/iconfont-document/iconfont.js' //bug号：1176、修改人：董渊海、修改时间：2020-03-20、描述：文件记录组件需要引用的图标库
import '@/permission' // permission control
import axios from '@/utils/axios'
import _ from 'lodash'
import remove from '@/utils/remove'
import 'xe-utils'
import 'vxe-table/lib/index.css'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import Upload from '@/components/Upload'
import Download from '@/components/Download'
import Preview from '@/components/Preview'
import VXTable from '@/components/VxeTable'
import SelectList from '@/components/SelectList'
import moment from 'moment'
import 'moment/locale/zh-cn'
import api from '@/api'
import BIM from '_c/Bim/index'

import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import TreeSelect from '@riophae/vue-treeselect'
import SelectUser from '@/components/SelectUser'
import SelectDepart from '@/components/SelectDepart'
import Grid from '@/components/Grid'
import privilege from '@/directive/privilege'
import InputNumber from '@/components/InputNumber'
import ContractTypeSelect from '@/components/ContractTypeSelect' //合同类型
import ContractStatusSelect from '@/components/ContractStatusSelect' //合同状态
import BasicStatusSelect from '@/components/BasicStatusSelect' //基本状态(草稿,待审核,已通过,已驳回)
import PaymentStatusSelect from '@/components/PaymentStatusSelect' //支付阶段
import PayStatusSelect from '@/components/PayStatusSelect' //付款状态
import AuditDialog from '@/components/AuditDialog' //审核弹出框
import ProjectBelongTypeSelect from '@/components/ProjectBelongTypeSelect' //审核弹出框
import FileUpload from '@/components/FileUpload'
import FileTable from '@/components/FileTable'
import FileRecord from '@/components/FileRecord'
import EditTable from '@/components/EditTable'
import ContractChangeTypeSelect from '@/components/ContractChangeTypeSelect' //合同类型
import CheckCard from '@/components/CheckCard' //合同类型
import moneyFormat from '@/utils/moneyFormat'
import EngineeringTypeSelect from '@/components/EngineeringTypeSelect' //付款状态
import InvestmentTypeSelect from '@/components/InvestmentTypeSelect' //付款状态
import SelectEquipmentDialog from '@/components/SelectEquipmentDialog' //设备台账模态框
import FileList from '_c/FileList'
import DateRange from '@/components/DateRange' //日期选择组件
import SceneVisaSelect from '@/components/SceneVisaSelect' //日期选择组件
import FileEdit from '@/components/FileEdit' //编辑页面文件上传组件
import SelectArg from '@/components/SelectArg' //下拉选择器(从参数中获取数据)
import AttachmentDialog from '@/components/AttachmentDialog'
import DownloadByFileId from '@/components/DownloadByFileId' //通过文件id下载
import PreviewByFileId from '@/components/PreviewByFileId' //通过文件id下载
import PreviewUrl from '@/components/PreviewUrl' //通过文件id下载
import ViewFlow from '@/views/epcPpp/workflow/components/viewFlow' // 流程图预览
import VuePromiseBtn from 'vue-promise-btn'
import ECharts from 'vue-echarts'
import 'echarts'

import toFixed2 from '@/utils/toFixed2'
import fullscreen from 'vue-fullscreen'

import Video from '@/components/VideoPlayer'
import Clipboard from 'v-clipboard'
import tipRemove from '@/utils/tipRemove'
import InputNumberCommon from '@/components/InputNumberCommon'
import AddComments from '@/components/AddComments' //批注组件
Vue.component('AddComments', AddComments)

moment.locale('zh-cn')
Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(VXTable)
Vue.use(FileList)
Vue.use(fullscreen)
VXETable.use(VXETablePluginElement)
Vue.prototype.axios = axios
Vue.use(Clipboard)
Vue.component('VChart', ECharts)

Vue.prototype._ = _
Vue.prototype.$api = api
Vue.prototype.$moneyFormat = moneyFormat
window._ = _
const getLabel = (options, value) => _.get(_.find(options, { value }), 'label', '-')
Vue.prototype.moment = moment
Vue.prototype.$log = console.log
window.moment = moment
Vue.prototype.$remove = remove
Vue.prototype.$tipRemove = tipRemove
Vue.prototype.XEUtils = XEUtils
Vue.prototype.$getLabel = getLabel

/*
获取系统参数分组数据
group 分组参数
this.$getArgList(group)
*/
Vue.prototype.$getArgList = group =>
  store.state.systemConfig.config[group] &&
  store.state.systemConfig.config[group].children.filter(item => !item.deleteFlag)
/*
  通过value 获取系统参数label
  group 分组参数
  value 参数编码
  this.$getLabelFromArg(group, value)
  */
Vue.prototype.$getLabelFromArg = (group, value) =>
  getLabel(store.state.systemConfig.config[group] && store.state.systemConfig.config[group].children, value + '')

Vue.component('TreeSelect', TreeSelect)
Vue.component('BIM', BIM)
Vue.component(Grid.name, Grid)
Vue.component(Upload.name, Upload)
Vue.component(Download.name, Download)
Vue.component(Preview.name, Preview)
Vue.component(SelectUser.name, SelectUser)
Vue.component(SelectDepart.name, SelectDepart)
Vue.component(SelectList.name, SelectList)
Vue.component(InputNumber.name, InputNumber)
Vue.component(AttachmentDialog.name, AttachmentDialog)
Vue.component(Video.name, Video)
Vue.component(SelectArg.name, SelectArg)
Vue.component('ViewFlow', ViewFlow) // 流程图预览组件
VXETable.setup({
  table: {
    size: 'mini',
    stripe: true,
    align: 'center',
    border: true,
    resizable: true,
    showOverflow: 'title',
    checkboxConfig: {
      trigger: 'cell'
    },
    showHeaderOverflow: false
  }
})
VXETable.formats.mixin({
  ymd({ cellValue }) {
    return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
  },
  toWan({ cellValue }) {
    return cellValue || cellValue === 0 ? cellValue / 10000 : ''
  }
})
Vue.use(VXETable)
Vue.use(VuePromiseBtn, {
  btnLoadingClass: 'is-loading',
  loader: `<i class="el-icon-loading"></i>`,
  autoHideSpinnerWrapper: true
})
Vue.component('ContractTypeSelect', ContractTypeSelect)
Vue.component('ContractChangeTypeSelect', ContractChangeTypeSelect)
Vue.component('ContractStatusSelect', ContractStatusSelect)
Vue.component('BasicStatusSelect', BasicStatusSelect)
Vue.component('PaymentStatusSelect', PaymentStatusSelect)
Vue.component('PayStatusSelect', PayStatusSelect)
Vue.component(AuditDialog.name, AuditDialog)
Vue.component(FileUpload.name, FileUpload)
Vue.component(FileTable.name, FileTable)
Vue.component(FileRecord.name, FileRecord)
Vue.component('ProjectBelongTypeSelect', ProjectBelongTypeSelect)
Vue.component('EngineeringTypeSelect', EngineeringTypeSelect)
Vue.component('InvestmentTypeSelect', InvestmentTypeSelect)
Vue.component(EditTable.name, EditTable)
Vue.component('CheckCard', CheckCard)
Vue.component(SelectEquipmentDialog.name, SelectEquipmentDialog)
Vue.component(DateRange.name, DateRange)
Vue.component('SceneVisaSelect', SceneVisaSelect)
Vue.component('FileEdit', FileEdit)
Vue.component(DownloadByFileId.name, DownloadByFileId)
Vue.component(PreviewByFileId.name, PreviewByFileId)
Vue.component('PreviewUrl', PreviewUrl)
Vue.component(InputNumberCommon.name, InputNumberCommon)
Vue.config.productionTip = false
/**
 * 权限全局指令 v-privilege="options"
 */

Vue.directive('access', privilege)
/**
开发人员：耿为刚
日期：2020-05-22
任务类型：拖拽表单组件依赖
**/
import FormMaking from 'drag-form'
import 'drag-form/dist/FormMaking.css'

Vue.use(FormMaking)

/**
开发人员：耿为刚
日期：2020-03-27
任务类型：增加全局过滤器
**/
// 全局过滤器
import * as customFilters from './utils/filters'
Object.keys(customFilters).forEach(key => {
  Vue.filter(key, customFilters[key])
})
Vue.prototype.toFixed2 = toFixed2
Vue.filter('toFixed2', toFixed2)
/**
开发人员：耿为刚
日期：2020-03-28
任务类型：增加全局分页配置
**/
import pageConfig from './utils/page-config'
Vue.prototype.$pageConfig = pageConfig
/*
  是否有按钮操作权限
  true 有权限
  false 无权限
*/

Vue.prototype.$hasPower = e => {
  if (process.env.NODE_ENV === 'development' && localStorage.getItem('ignorePermissions') === 'true') {
    return true
  } else {
    return store.state.userPower.power.includes(e)
    // 临时放开所有按钮权限
    // return true
    // store.state.userPower.power.includes(e)
  }
}

Vue.prototype.$getPreviewUrlById = id => {
  return axios.file.defaults.baseURL + '/noToken/file/commonFile/onlinePreview/' + id
}

/**
开发人员：耿为刚
日期：2020-04-01
任务类型：增加全局枚举处理
**/
import Enum from 'vue-enum'
import enumInfo from './enumeration'
Vue.use(Enum, { enumInfo })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
