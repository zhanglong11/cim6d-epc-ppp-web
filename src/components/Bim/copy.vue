<!--
 * @Description:
 * @Version:
 * @Autor:
 * @Date: 2020-03-10 16:42:10
 * @LastEditTime: 2020-04-15 20:16:56
 -->
<template>
  <div style="height: 100%">
    <el-card class="box-card">
      <div slot="header" class="flex">
        <div>
          <span>模型预览</span>
        </div>
        <div v-if="!versionSatus">
          <el-button type="primary" @click="watchModal">查看模型</el-button>
          <!-- <el-button type="primary" @click="addText">文字标注</el-button> -->
          <!-- <el-button type="primary" @click="drawBIM">画线</el-button> -->
          <!-- <el-button type="primary" @click="relevance">关联</el-button> -->
        </div>
        <p v-if="versionSatus">审核状态：{{ versionSatus }}</p>
      </div>
      <!-- 内容 -->
      <div :id="idSelect" class="lo-viewer"></div>
    </el-card>
  </div>
</template>

<script>
import Api from '@/api/model/tree'
import ToolKit from '@/BIM/utils/Viewer.Toolkit'
import toFlat from '@/utils/toFlat'
import axios from '@/utils/axios'
export default {
  name: 'BIM',
  props: {
    // 模型版本状态
    versionSatus: {
      type: [String, Number],
      default: null
    },
    // bim的id
    idSelect: {},
    height: {},
    // 各模块的flag：表示一般常用的上下树形式(默认：normal)、清单关联的flag(listing)、模型版本(version)
    flag: {
      type: String,
      default: 'normal'
    },
    // 如果不符合上述类型，可直接传入callBack
    callBack: {
      type: Function
    }
  },
  data() {
    return {
      bimfishApp: null,
      // 所选
      singleModels: {},
      majorModels: {},
      // 所有的model信息
      modelArr: []
    }
  },
  mounted() {
    this.getProjectTreeData()
  },
  methods: {
    async getExternalIdMapping(model) {
      return new Promise((resolve, reject) => {
        try {
          model.getExternalIdMapping(result => {
            resolve(result)
          })
        } catch (e) {
          console.log(e)
          reject(e)
        }
      })
    },
    async getGuidMappingForMul2(viewer) {
      return new Promise(async (resolve, reject) => {
        try {
          const models = viewer.impl.modelQueue().getModels()
          let ModelGuidMapping = {}
          for (let model of models) {
            const result = await this.getExternalIdMapping(model)
            ModelGuidMapping[model.id] = result
          }
          resolve(ModelGuidMapping)
        } catch (e) {
          reject(e)
        }
      })
    },
    /**
     * @description: 根据{modelId:[guid]}转换为{modelId:{dbIds:[dbId],guids:[guid]}}
     * @param {Object} modelIdMapping {modelId:[guid]}
     * @return:
     * @author: 申豪强
     */
    async guidsTranslateDbId(modelIdMapping) {
      const modelGuidMapping = await this.getGuidMappingForMul2(this.bimfishApp.viewer)
      const modelArr = []
      for (let modelId in modelIdMapping) {
        modelArr.push({ modelId: modelId, guidMap: modelGuidMapping[modelId] })
      }
      let resMap = {}
      // 根据modelId:guids生成modelId:dbIds；
      for (let item of modelArr) {
        let guidMap = item.guidMap //{guid:dbid}
        let targetDbIds = modelIdMapping[item.modelId]
        if (!targetDbIds) continue
        let guIdArray = []
        for (let dbid of targetDbIds) {
          for (let guid in guidMap) {
            if (!guidMap[guid] || guidMap[guid] === 'undefined') continue
            if (guidMap[guid] === dbid) {
              guIdArray.push(guid)
            }
          }
        }
        resMap[item.modelId] = {
          dbIds: targetDbIds,
          guids: guIdArray
        }
      }
      return resMap
    },
    /*
     * @任务编号: 2522 | 提供获取框选数据接口
     * @开发人员:申豪强
     * @日期:2020-03-23
     * @任务类型: 新代码
     */
    // 提供框选接口
    async relevance() {
      let viewer = this.bimfishApp.viewer
      let selections = viewer.getAggregateSelection()
      // 这是经过处理的modelId:模型
      let modelObj = this.bimfishApp._pendingModels
      //  模型返回数据
      let componentList = []
      let dbidObj = {}
      for (let item of selections) {
        dbidObj[item.model.id] = item.selection
      }
      let dbIdRes = await this.guidsTranslateDbId(dbidObj)
      // 关联数据示例：
      /*
      {
        "componentId": "",
        "componentQuantity": 0,
        "modelId": "",
        "spaceId": ""
      }
      */
      // 对象取交集
      for (let key in modelObj) {
        let id = modelObj[key].id
        if (dbIdRes[id]) {
          let obj = {
            id: id,
            modelId: key
          }
          componentList.push(obj)
        }
      }

      // return出去的数据
      let arr = []
      if (componentList.length > 0) {
        for (let item of componentList) {
          let list = await this.getPropertiesByGUID(dbIdRes[item.id].guids)
          let guids = dbIdRes[item.id].guids
          guids.forEach((guid, index) => {
            let obj = {
              componentId: guid,
              componentQuantity: list[index] ? list[index] : 0, //工程量
              modelId: item.modelId,
              spaceId: null
            }
            arr.push(obj)
          })
        }
      }
      console.log(arr)
      return arr
    },
    // 根据guidArray进行模型的展示
    showModelByGuids(guids) {
      this.bimfishApp.hideAll()
      this.bimfishApp.show(guids)
    },
    // 根据guid获取属性
    async getPropertiesByGUID(guids) {
      let arr = []
      for (let guid of guids) {
        let props = await ToolKit.getPropertiesByGUID(this.bimfishApp.viewer, guid)
        let target = props.find(item => item.displayName === '工程量')
        arr.push(target ? target.displayValue.split(' ')[0] : null)
      }
      return arr
    },
    addText() {
      let app = this.bimfishApp
      app.getComponentGuid((e, f) => {
        console.log(f)
      })
      app.addDrawableTextMarkerByGUID(['845608b8-b044-41f2-a124-f00b214c2d47-0009f496'], '文字图标')
    },
    /*
     * @任务编号: 2522 || 树与模型交互,获取模型id：dbids，然后取对象交集，再取数组交集
     * @开发人员:申豪强
     * @日期:2020-03-20
     * @任务类型: 新代码
     */
    // 多维数组转一维数组
    flatten(arr) {
      return [].concat(...arr.map(x => (Array.isArray(x) ? this.flatten(x) : x)))
    },
    // 去重
    unique(arr) {
      if (!Array.isArray(arr)) {
        console.log('type error!')
        return
      }
      arr = arr.sort()
      var arrry = [arr[0]]
      for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i - 1]) {
          arrry.push(arr[i])
        }
      }
      return arrry
    },
    // 取交集
    arrayIntersection(a, b) {
      let intersection = a.filter(function (val) {
        return b.indexOf(val) > -1
      })
      return intersection
    },
    // 模型展示
    showModal() {
      let app = this.bimfishApp
      app.hideAll()
      // 组成新的model：dbids对象，然后取交集
      let obj = {}
      //组成新对象:取对象交集
      if (_.isEmpty(this.singleModels)) {
        obj = JSON.parse(JSON.stringify(this.majorModels))
      } else if (_.isEmpty(this.majorModels)) {
        obj = JSON.parse(JSON.stringify(this.singleModels))
      } else {
        //对象交集、数组交集
        for (let modelId in this.singleModels) {
          let arr = this.arrayIntersection(this.singleModels[modelId], this.majorModels[modelId])
          obj[modelId] = arr
        }
      }
      console.log(obj)
      for (let key in obj) {
        let model = app.findModelByid(key)
        app.viewer.show(obj[key], model)
      }
    },
    //生成modal：dbids
    checkedNodesFilter(checkedNodes) {
      console.log(checkedNodes)
      let modelIds = []
      if (Object.prototype.hasOwnProperty.call(checkedNodes[0], 'singleFlag')) {
        modelIds = checkedNodes
          .filter(item => item.singleFlag)
          .map(item => {
            let id = item.bimResourceId.split('_')[0]
            return id
          })
      } else {
        // bug修改，无bug号：清单关联bim修改 申豪强 2020-04-15
        modelIds = this.unique(
          checkedNodes
            .map(item => {
              let id = item.modelId ? item.modelId.split('_')[0] : null
              return id
            })
            .filter(item => item)
        )
      }

      let obj = {}
      modelIds.forEach(id => {
        let ids = checkedNodes
          .filter(item => item.modelId === id && item.components && item.components.length > 0)
          .map(item => item.components)
        let dbids = this.flatten(ids)
        // modelId:dbids
        obj[id] = dbids
      })
      return obj
    },
    // 单体楼层选中
    singleCheckChange() {
      let checkedNodes = this.$store.state.bim.singleChecks
      // 模型ids
      if (checkedNodes.length === 0) {
        this.singleModels = {}
        return
      }
      let obj = this.checkedNodesFilter(checkedNodes)
      this.singleModels = obj || {}
    },
    // 专业构件选择
    majorCheckChange() {
      let checkedNodes = this.$store.state.bim.majorChecks
      // 模型ids
      if (checkedNodes.length === 0) {
        this.majorModels = {}
        return
      }
      let obj = this.checkedNodesFilter(checkedNodes)
      this.majorModels = obj || {}
    },
    // 点击切换版本
    switchVersion(path) {
      // this.load3dviewer(path)
    },
    // 获取框选选中的构建guidList
    async getModal() {
      if (!this.bimfishApp) {
        this.$message.error('请先框选构件')
        return false
      }
      let area = this.bimfishApp.areaDrawer
      // 要上传的list
      let list = area.areaDrawTool.getComps()
      const mapping = await ToolKit.getExternalIdMapping(this.bimfishApp.viewer.model)
      let hash = {}
      let guidList = []
      // 获取所有guidList
      list.forEach(l => {
        hash[l.dbId] = true
      })
      _.forIn(mapping, (val, key) => {
        if (hash[val]) guidList.push(key)
      })
      return guidList
    },
    // 画线
    async drawBIM() {
      await this.bimfishApp.initDrawArea()
      let area = this.bimfishApp.areaDrawer
      this.drawArea()
    },
    async drawArea() {
      await this.bimfishApp.drawArea()
    },
    // 无任务号 切换bim地址 申豪强 2020-03-30
    // 当左侧是版本列表时：
    showModelVersion() {
      let modelIds = this.$store.state.bim.versionModelIds
      console.log(modelIds)
      if (modelIds.length === 0) return this.$message.error('请至少选择一个单体')
      let arr = modelIds.map(item => {
        let obj = {
          id: item.split('_')[0],
          modelUrl:
            location.origin + axios.gis.defaults.baseURL + `/noToken/old/basic/commonFile/get/fdht/bim_${item}/3d.svf`
        }
        return obj
      })
      this.load3dviewer(arr)
    },
    // 左侧单体楼层+专业构件展示选中的构件
    watchModal() {
      if (this.flag === 'normal') {
        this.singleCheckChange()
        this.majorCheckChange()
        this.showModal()
      } else if (this.flag === 'version') {
        this.showModelVersion()
        /*
         * @任务编号: 2522 || 新增清单绑定
         * @开发人员:申豪强
         * @日期:2020-03-20
         * @任务类型: 新代码
         */
      } else if (this.flag === 'listing') {
        //清单
        let nodes = this.$store.state.bim.inventory

        let obj = this.checkedNodesFilter(nodes)
        let app = this.bimfishApp
        app.hideAll()
        for (let key in obj) {
          let model = app.findModelByid(key)
          app.viewer.show(obj[key], model)
        }
      } else {
        this.callBack()
      }
    },
    // 获取模型构件guid
    getGuid() {
      this.bimfishApp.getComponentGuid((e, id) => {
        console.log(id)
      })
    },
    // 加载3D视图
    load3dviewer(arr) {
      this.modelArr = arr
      let key = '465758F8f2B54E72b6956A8ba3625a73'
      let secret = '5De5712e99b0435AB47a41673B2B1F97faf51014C47041fB97cc12c1bEb7b185'
      this.bimfishApp = new BimfishApp(this.idSelect, key, secret)
      console.log(this.bimfishApp)
      this.bimfishApp.init(() => {
        this.bimfishApp.showModel(arr)
      })
    },
    // 获取模型数据
    async getProjectTreeData() {
      let res = await Api.getProjectTreeData(localStorage.getItem('projectId'))
      console.log(res)
      // 转换成一维数组
      // return
      let list = toFlat(res.data, 'pid', 'bimResourceId')
      let modelList = list.filter(item => item.type === 3)
      if (modelList.length > 0) {
        // location.origin到时候更换
        let arr = modelList.map(item => {
          let obj = {
            id: item.bimResourceId.split('_')[0],
            modelUrl:
              location.origin +
              axios.gis.defaults.baseURL +
              `/noToken/old/basic/commonFile/get/fdht/bim_${item.bimResourceId}/3d.svf`
          }
          return obj
        })
        this.load3dviewer(arr)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
.lo-viewer {
  position: relative;
}
.box-card {
  height: 100%;
  /deep/ .el-card__body {
    height: 87%;
    > div {
      .el-card {
        height: calc(100% - 60px);
        .el-card__body {
          height: calc(100% - 60px);
        }
      }
    }
  }
}
</style>
<style lang="less"></style>
