<template>
  <div v-if="!hiddenFlow">
    <el-card class="box-card">
      <div id="viewBpmn" class="view-bpmn"></div>
      <!-- 自定义高亮箭头 start -->
      <marker
        id="sequenceflowHighLighted"
        viewBox="0 0 20 20"
        refX="11"
        refY="10"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
        ><path
          d="M 1 5 L 11 10 L 1 15 Z"
          :style="`fill: ${activeColor}; stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: ${activeColor};`"
        ></path>
      </marker>
      <!-- 自定义高亮箭头 end -->
    </el-card>
    <el-dialog :title="dialogParams.title" :visible.sync="dialogParams.show" width="680px">
      <div class="form-roll">
        <el-form v-if="dialogParams.data" label-width="150px">
          <el-form-item label="流程定义名称">
            <el-input :value="dialogParams.name" disabled autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template v-for="items in dialogParams.data">
          <div v-if="dialogParams.data" :key="items.taskId">
            <div class="form-line"></div>
            <el-form label-width="150px">
              <el-form-item :label="`${items.taskVariables.flag ? '审批人' : '申请人'}`">
                <el-input :value="items.taskVariables.taskDelegateName" disabled autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item :label="`${items.taskVariables.flag ? '审批时间' : '申请时间'}`">
                <el-input
                  :value="`${items.taskVariables.flag ? items.endTime : items.createTime}`"
                  disabled
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <!-- 读取自定义表单数据 - 排除附件 start -->
            <fm-generate-form v-if="items.jsonData" ref="generateFormRef" :data="items.jsonData" />
            <!-- 读取自定义表单数据 - 排除附件 end -->
            <!-- 自定义附件列表 start -->
            <el-form v-if="items.fileRecoverList && items.fileRecoverList.length > 0" label-width="150px">
              <template v-for="(item, i) in items.fileRecoverList">
                <el-form-item v-if="!dialogParams.isAdd" :key="i" :label="item.name">
                  <FileRecord :fileRecover="item.list"></FileRecord>
                </el-form-item>
              </template>
            </el-form>
            <!-- 自定义附件列表 end -->
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogParams.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
   任务名称：通用流程图显示组件开发
   开发人员：耿为刚
   日期：2020-04-16
   **/
// 引入绘图组件
import BpmnJS from 'bpmn-js'
import { setActiveIds } from './CustomRenderer/CustomRenderer'
import customModule from './CustomRenderer/CustomRenderer'
import $ from 'jquery'
import { workBenchApi } from '@/api/work-bench'
import { workFlowApi } from '../api/workflow-api'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 业务主键id
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    //这里存放数据
    return {
      fileRecover: [
        {
          id: '2cf75a22afd94abeba4080357ebbf3c7',
          fileName: 'test.jpg',
          fileNameSuffix: 'jpg',
          fileUrl: `/cim6d-file-storage${process.env.VUE_APP_BASE_API}/noToken/file/commonFile/download/2cf75a22afd94abeba4080357ebbf3c7`
        }
      ],
      activeColor: '#409eff', // 高亮颜色
      modelId: '47',
      processInstanceId: '12501',
      highLightedActivities: [], // 高亮节点
      highLightedFlows: [], // 高亮线
      dialogParams: {
        show: false,
        title: '审批记录',
        name: '',
        fileList: [],
        isAdd: false,
        data: ''
      },
      hiddenFlow: false, // 加载数据失败
      jsonData: {
        list: []
      },
      fileRecoverList: [] // 单独处理附件
    }
  },
  mounted() {
    this.getProcessLayout()
  },
  //方法集合
  methods: {
    // 获取工作流布局
    async getProcessLayout() {
      if (!this.id) {
        return
      }
      const result = await workFlowApi.getProcessLayout(this.id) //'371c6adb36d543cca7ee370831af7b79'
      let datas = result.data
      if (!datas) {
        this.hiddenFlow = true
        return
      }
      this.processInstanceId = datas.processInstanceId
      this.highLightedActivities = datas.highLightedActivities
      this.highLightedFlows = datas.highLightedFlows
      this.getModel(datas.bpmnXml)
    },
    // 初始化
    init(xml) {
      // 设置完成的任务节点
      setActiveIds({
        listIds: this.highLightedActivities,
        activeColor: this.activeColor
      })
      let flag
      let viewer = new BpmnJS({
        container: '#viewBpmn',
        additionalModules: [
          {
            __init__: ['customRenderer'],
            customRenderer: ['type', customModule]
          }
        ]
      })
      viewer.importXML(xml, err => {
        try {
          this.setFlowColor()
          let canvas = viewer.get('canvas')
          canvas.zoom('fit-viewport')
          let eventBus = viewer.get('eventBus')
          let self = this
          eventBus.on('element.click', function (e) {
            let activitieId = e.element.id
            let index = self.highLightedActivities.indexOf(activitieId)
            if (index >= 0) {
              self.dialogParams.title = `${e.element.businessObject.name}`
              self.dialogParams.isAdd = !!(index === 1)
              self.dialogParams.name = e.element.businessObject.$parent.name
              self.getTaskDetails(activitieId)
            }
          })
        } catch (e) {}
      })
    },
    // 获取任务详情
    async getTaskDetails(activityId) {
      const result = await workBenchApi.getTask(this.processInstanceId, activityId)
      let datas = result.data
      if (!datas || datas.length === 0) {
        return
      }
      let newList = []
      datas.map((items, i) => {
        let list = items.taskVariables.fileId ? items.taskVariables.fileId.split(',') : []
        let jsonData = JSON.parse(items.template)
        let fileRecoverList = []
        let jsonDataList = {
          list: []
        }
        jsonData.list.map(item => {
          item.options.disabled = true
          if (!item.options.hidden && (item.type === 'fileupload' || item.type === 'imgupload')) {
            let defaultValue = item.options.defaultValue
              .replace(/\[|]|{|}/g, '')
              .replace(/name=/g, 'name:')
              .replace(/, fileKey=/g, '|fileKey:')
            let defaultValueList = defaultValue.split(',')
            let newList = []
            defaultValueList.map(e => {
              let nameList = e.split('|')
              let name = nameList[0].replace('name:', '')
              let fileKey = nameList[1].replace('fileKey:', '')
              newList.push({
                name,
                fileKey,
                id: fileKey,
                fileName: name,
                fileNameSuffix: name.split('.')[1],
                fileUrl: `/cim6d-file-storage${process.env.VUE_APP_BASE_API}/noToken/file/commonFile/download/${fileKey}`
              })
            })
            // console.log(222, defaultValueList, newList)
            item.options.defaultValue = newList
            fileRecoverList.push({
              name: item.name,
              list: newList
            })
          } else {
            jsonDataList.list.push(item)
          }
        })
        // console.log(111, jsonData, jsonDataList)
        items.jsonData = jsonDataList
        items.fileRecoverList = fileRecoverList
        items.fileList = []
        list.map(e => {
          this.getFileUrl(e, i)
        })
        console.log(333, items)
        if (items.endTime) {
          newList.push(items)
        }
      })
      if (newList.length === 0) {
        this.$message.warning('审核中')
        return
      }
      console.log(222, datas, newList)
      this.dialogParams.data = newList
      this.dialogParams.show = true
    },
    // 获取任务表单
    async getTaskForm(id) {
      if (!id) {
        return
      }
      let result = await workFlowApi.getTaskForm(id)
      let datas = result.data
      if (!datas) {
        return
      }
      let jsonData = JSON.parse(datas.template)
    },
    // 获取文件详情
    async getFileUrl(id, index) {
      const result = await workBenchApi.getFileUrl(id)
      let datas = result.data
      this.dialogParams.data[index].fileList.push(datas)
    },
    // 获取流程模板数据
    getModel(xml) {
      if (!xml) {
        return
      }
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, 'text/xml')
      const haveName = !!xmlDoc.getElementsByTagName('process')[0].getAttribute('name')
      if (!haveName) {
        xmlDoc.getElementsByTagName('process')[0].setAttribute('name', this.$route.query.name)
        const s = new XMLSerializer()
        xml = s.serializeToString(xmlDoc)
      }
      this.init(xml)
    },
    // 设置线条颜色
    setFlowColor() {
      const self = this
      $('#viewBpmn defs')[0].append($('#sequenceflowHighLighted')[0])
      $('#viewBpmn g').each(function (e) {
        let id = $(this).attr('data-element-id')
        if (self.highLightedFlows.includes(id)) {
          $(this).find('path')[0].style.stroke = self.activeColor
          $(this).find('path')[0].style['marker-end'] = 'url(#sequenceflowHighLighted)'
        }
      })
    }
  } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.view-bpmn {
  height: 400px;
}
/deep/.bjs-powered-by {
  display: none;
}
.form-roll {
  padding-right: 10px;
  max-height: 600px;
  overflow-y: auto;
  .scrollbar;
}
.el-form {
  padding: 0;
}
.form-line {
  margin-bottom: 15px;
  width: 100%;
  border-bottom: 1px #eee solid;
}
</style>
