<template>
  <div class="bpm-main is-footer">
    <!-- <el-tabs v-model="activeName" type="card" class="bpm-tabs">
      <el-tab-pane label="表单设计" name="0"></el-tab-pane>
      <el-tab-pane label="流程设计" name="1"></el-tab-pane>
    </el-tabs>
    <div v-show="activeName === '0'" class="form-making">
      <fm-making-form
        ref="dragFormRef"
        :data="jsonData"
        preview
        generate-code
        generate-json
        clearable
        :down-load-action="downLoadAction"
        :basicFields="basicFields"
        :action="action"
      />
    </div> -->
    <div id="bpmn"></div>
    <div id="properties-wrap">
      <CustomProperties v-if="mounted" v-once id="properties-extend" :modeler="modeler"></CustomProperties>
      <div id="properties"></div>
    </div>
    <div class="footer-btn">
      <template v-if="activeName === '0'">
        <el-button type="primary" @click="save(0)">保存</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click="exportDiagram(true)">导出XML</el-button>
        <el-button type="primary" @click="exportSVG(true)">导出SVG</el-button>
        <el-button type="primary" @click="save(0)">保存</el-button>
        <el-button type="primary" @click="save(1)">保存并部署</el-button>
      </template>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>

<script>
// 引入绘图组件
import bpmnJs from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import '../bpmnAssets/css/app.css'
import propertiesPanelModule from '../bpmnAssets/properties-panel'
import propertiesProviderModule from '../bpmnAssets/properties-panel/provider/activiti'
import activitiModdleDescriptor from '../bpmnAssets/activiti.json' // 自动关联属性
import customTranslate from '../bpmnAssets/customTranslate/customTranslate' // 中文编码
import customControlsModule from '../bpmnAssets/customControls'
import CustomProperties from '../components/CustomProperties'
import customRendererModule from '../lib/customRender'
const customTranslateModule = {
  translate: ['value', customTranslate]
}
export default {
  name: 'Bpmn',
  components: { CustomProperties },
  props: ['id'],
  data() {
    return {
      activeName: 1,
      modeler: {},
      form: {},
      mounted: false,
      downLoadAction: `/cim6d-file-storage${process.env.VUE_APP_BASE_API}/noToken/file/commonFile/download/`,
      action: `/cim6d-file-storage${process.env.VUE_APP_BASE_API}/noToken/file/commonFile/visitor/upload/drag-form`,
      jsonData: {},
      // 自定义表单配置
      basicFields: [
        'input',
        'textarea',
        'number',
        'radio',
        'checkbox',
        'time',
        'date',
        'rate',
        'color',
        'select',
        'switch',
        'slider',
        'imgupload',
        'fileupload',
        'cascader'
      ],
      taskConfigList: [], // 模型-任务配置
      flowConfigList: [] // 模型-连线配置
    }
  },
  created() {
    this.$store.dispatch('workflow/getFormList')
    this.$store.dispatch('workflow/getRoleList')
  },
  mounted() {
    this.initBpmn()
  },
  methods: {
    // 初始化绘图
    initBpmn() {
      const modeler = new bpmnJs({
        container: '#bpmn',
        propertiesPanel: {
          parent: '#properties'
        },
        additionalModules: [
          propertiesPanelModule, // 右侧属性面板
          propertiesProviderModule,
          customTranslateModule, // 中文编码
          customControlsModule,
          customRendererModule
        ],
        moddleExtensions: {
          activiti: activitiModdleDescriptor // 自动关联属性
        }
      })
      this.modeler = modeler
      this.extendBpmnJs()
      this.mounted = true
      this.refresh()
      this.getDetails()
    },
    // 根据ID获取自定义表单信息
    async getDetails() {
      let template = {
        list: [
          {
            id: '',
            type: 'input',
            icon: 'icon-input',
            options: {
              width: '100%',
              defaultValue: '',
              required: true,
              dataType: 'string',
              pattern: '',
              placeholder: '请输入',
              disabled: false,
              hidden: false,
              halfLine: false,
              remoteFunc: 'func_1597297325000_63044'
            },
            name: '单行文本',
            key: '1597297325000_63044',
            model: 'input_1597297325000_63044',
            rules: [
              { required: true, message: '单行文本必须填写' },
              { type: 'string', message: '单行文本格式不正确' }
            ]
          },
          {
            id: '',
            type: 'textarea',
            icon: 'icon-diy-com-textarea',
            options: {
              width: '100%',
              defaultValue: '',
              required: false,
              disabled: false,
              pattern: '',
              placeholder: '请输入',
              hidden: false,
              halfLine: false,
              remoteFunc: 'func_1597297326000_97256'
            },
            name: '多行文本',
            key: '1597297326000_97256',
            model: 'textarea_1597297326000_97256',
            rules: []
          }
        ],
        config: { labelWidth: 150, labelPosition: 'right', size: 'small' }
      }
      // this.$refs['dragFormRef'].setJSON(template)
    },
    // 扩展绘图组件 - 增加描述显示功能
    extendBpmnJs() {
      let tools = document.getElementsByClassName('entry')
      tools.forEach(e => {
        let title = e.getAttribute('title')
        let toolSpan = `<span class="title">${title}</span>`
        e.innerHTML = toolSpan
      })
    },
    // 刷新
    async refresh() {
      this.axios.workflow.get('activiti/model/xml/' + this.id).then(async res => {
        let datas = res.data
        datas.modelFormPermission = datas.modelFormPermission || []
        this.form = datas
        let xml = datas.model
        if (!xml) {
          xml = await fetch('/blank.bpmn').then(res => res.text())
        }
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xml, 'text/xml')
        const haveName = !!xmlDoc.getElementsByTagName('process')[0].getAttribute('name')
        if (!haveName) {
          xmlDoc.getElementsByTagName('process')[0].setAttribute('name', this.$route.query.name)
          const s = new XMLSerializer()
          xml = s.serializeToString(xmlDoc)
        }
        this.modeler.importXML(xml)
        let modelTaskConfig = datas.modelTaskConfig || []
        modelTaskConfig.map(item => {
          item.type = item.type + ''
          item.auditMode = item.auditMode + ''
        })
        this.flowConfigList = datas.modelFlowConfig || []
        this.taskConfigList = modelTaskConfig
      })
    },
    // 导出XML
    exportDiagram(status) {
      let xmlName = `${this.form.description}.xml`
      return new Promise((resolve, reject) => {
        this.modeler.saveXML({ format: true }, (err, res) => {
          if (err) reject(err)
          else resolve(res)
          if (status) {
            this.downLoad(res, xmlName)
          }
        })
      })
    },
    // 导出SVG
    exportSVG(status) {
      let svgName = `${this.form.description}.svg`
      return new Promise((resolve, reject) => {
        this.modeler.saveSVG((err, res) => {
          if (err) reject(err)
          else resolve(res)
          if (status) {
            this.downLoad(res, svgName)
          }
        })
      })
    },
    // 下载导出的内容
    downLoad(file, fileName) {
      let blob = ''
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候）
      if (window.navigator.msSaveOrOpenBlob) {
        blob = new Blob([file], { type: 'text/plain' })
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        let eleLink = document.createElement('a')
        eleLink.download = fileName
        eleLink.style.display = 'none'
        blob = new Blob([file]) // 字符内容转变成blob地址
        eleLink.href = URL.createObjectURL(blob)
        document.body.appendChild(eleLink) // 触发点击
        eleLink.click()
        document.body.removeChild(eleLink) // 然后移除
      }
    },
    // 保存
    async save(type) {
      let bpmn_xml = await this.exportDiagram()
      let svg_xml = await this.exportSVG()
      let url = type ? '/activiti/model/saveAndDeploy' : '/activiti/model/save'
      let params = {
        ..._.pick(this.form, ['name']),
        bpmn_xml,
        svg_xml,
        modelId: this.id,
        name: this.modeler._definitions.rootElements[0].name,
        list: this.form.modelFormPermission || [],
        taskConfigList: this.taskConfigList,
        flowConfigList: this.flowConfigList
      }
      this.axios.workflow.post(url, params).then(res => {
        this.$message.success('操作成功')
        this.$router.back()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.bpm-main {
  // background-color: #fff;
  position: relative;
  // width: 100vw;
  // height: 100vh;
  display: flex;
  // overflow: hidden;
  .bpm-tabs {
    padding: 15px;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
  .form-making {
    padding: 0 15px;
    position: absolute;
    width: 100%;
    top: 75px;
    left: 0;
    height: 100%;
    z-index: 2;
  }
  #bpmn {
    // height: 100%;
    flex: 1;
  }
  // 绘图右侧属性
  #properties-wrap {
    height: 100%;
    // width: 360px;
    max-width: 360px;
    background: #f5f5f5;
    position: absolute;
    top: 0;
    right: 0;
    #properties {
      overflow: auto;
      width: 100%;
      display: none;
      /deep/.bpp-properties-panel {
        background: none;
        .bpp-properties-header,
        .bpp-properties-tab-bar,
        .group-label,
        .bpp-textfield {
          display: none;
        }
      }
    }
  }

  footer {
    padding: 15px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  /deep/.bjs-powered-by {
    display: none;
  }
  /deep/.djs-context-pad {
    transition: all 0.4s;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: 1px #ddd solid;
    border-radius: 6px;
    padding: 10px;
    .group {
      display: flex;
      flex-direction: column;
      .entry {
        margin: 5px 0;
        font-size: 26px;
        min-width: 26px;
        width: auto;
        height: 26px;
        transition: all 0.4s;
        display: flex;
        align-items: center;
        cursor: pointer;

        &.bpmn-icon-intermediate-event-none,
        &.bpmn-icon-task,
        &.bpmn-icon-call-activity,
        &.bpmn-icon-text-annotation {
          display: none;
        }
        &:after {
          margin-left: 5px;
          font-size: 12px;
          color: #666;
          white-space: nowrap;
        }
        &.bpmn-icon-end-event-none {
          &:after {
            content: '结束';
          }
        }
        &.bpmn-icon-gateway-none {
          &:after {
            content: '网关';
          }
        }
        &.bpmn-icon-user-task {
          &:after {
            content: '任务';
          }
        }
        &.bpmn-icon-screw-wrench {
          &:after {
            content: '设置';
          }
        }
        &.bpmn-icon-trash {
          &:after {
            content: '移除';
          }
        }
        &.bpmn-icon-connection-multi {
          &:after {
            content: '关联';
          }
        }
        &:hover {
          color: #409eff;
          background: none;
          transform: scale(1.1);
          font-weight: bold;
          &:after {
            color: #409eff;
          }
        }
      }
    }
  }
  /deep/.djs-popup-header {
    display: none !important;
  }
  /deep/div[data-container-id*='StartEvent_'] {
    .bpmn-icon-screw-wrench,
    .bpmn-icon-trash {
      display: none !important;
    }
  }
  /deep/.djs-element {
    &.selected .djs-outline {
      stroke: #409eff;
      stroke-width: 2px;
    }
    &:hover .djs-outline {
      stroke: #f56c6c;
      stroke-width: 2px;
    }
  }
  /deep/.djs-popup {
    border: 0;
    background: none;
    .djs-popup-body {
      transition: all 0.4s;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border: 1px #ddd solid;
      border-radius: 6px;
      padding: 5px;
      .entry {
        margin: 5px 0;
        transition: all 0.4s;
        cursor: pointer;
        &::before {
          font-size: 20px;
        }
        span {
          font-size: 12px;
          color: #666;
        }
        &:hover {
          color: #409eff;
          background: none;
          transform: scale(1.1);
          font-weight: bold;
          span {
            color: #409eff;
          }
        }
      }
      .bpmn-icon-gateway-eventbased {
        display: none;
      }
      // div[class*='-message'],
      // div[class*='-timer'],
      // div[class*='-condition'],
      // div[class*='-signal'],
      // div[class*='-escalation'],
      // div[class*='-error'],
      // div[class*='-compensation'],
      // div[class*='-terminate'],
      // div[class*='-intermediate-event-none'],
      // .bpmn-icon-task,
      // .bpmn-icon-send,
      // .bpmn-icon-receive,
      // .bpmn-icon-manual,
      // .bpmn-icon-business-rule,
      // .bpmn-icon-service,
      // .bpmn-icon-script,
      // .bpmn-icon-call-activity,
      // .bpmn-icon-subprocess-collapsed,
      // .bpmn-icon-subprocess-expanded {
      //   display: none;
      // }
    }
  }
  /deep/.djs-label {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif !important;
  }

  // 绘图工具左侧工具栏
  /deep/.djs-palette {
    display: none;
    padding: 10px 0;
    width: auto;
    .group {
      display: flex;
      flex-direction: column;
    }
    .entry {
      padding: 0 10px;
      position: relative;
      display: flex;
      align-items: center;
      //width: auto;
      height: auto;
      line-height: 40px;
      .title {
        padding-left: 10px;
        font-size: 11px;
        white-space: nowrap;
        color: #999;
        flex: 1;
        text-align: left;
      }
      &:hover {
        .title {
          color: rgb(255, 116, 0);
        }
      }
    }
  }
  /deep/.bpp-properties {
    .bpp-properties-group {
      padding: 0 15px;
      & > .group-label {
        font-style: normal;
      }
    }
    .bpp-properties-entry {
      margin-bottom: 5px;
    }
  }
  /deep/.bpp-properties-panel label {
    font-weight: normal;
  }
}
</style>
<style lang="less">
svg {
  .agree {
    stroke: #f00 !important;
  }
}
</style>
