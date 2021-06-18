<template>
  <div style="height: 100%">
    <el-card class="box-card">
      <!-- <el-button @click="getGuid">查看选中的构件</el-button> -->
      <div v-if="!isInitComplete" class="loading-bim">
        <img src="../images/loading.png" />
      </div>
      <div v-else :id="idSelect" class="lo-viewer" :class="{ 'no-box-select': !isBoxSelect }"></div>
    </el-card>
  </div>
</template>

<script>
import { bimApi } from '../api/bim-api'
import toTree from '@/utils/toTree'
import axios from '@/utils/axios'
import ToolKit from '@/BIM/utils/Viewer.Toolkit'
export default {
  name: 'BIM',
  props: {
    // 是否初始化的时候隔离所有构件
    hideAll: {
      type: Boolean,
      default: false
    },
    // bim Dom
    idSelect: {
      type: String,
      default: 'Bim'
    },
    // 是否能框选
    isBoxSelect: {
      type: Boolean,
      default: false
    },
    // 是否加载全部模型
    isLoadAll: {
      type: Boolean,
      default: true
    },
    // 类型 默认渲染3d
    type: {
      type: String,
      default: '3d'
    },
    // 是否允许添加锚点
    isAddAnchor: {
      type: Boolean,
      default: false
    },
    // 锚点回显数据
    anchorData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 锚点类型
    anchorType: {
      type: String,
      default: 'quality'
    }
  },
  data() {
    return {
      isInitComplete: false, // 是否初始化完毕
      loadEntity: [], // 已加载的单体id
      selectEntityAll: [], // 所有单体
      modelUrlList: [], // 需要渲染的单体列表
      modelUrlListBack: [], // 需要渲染的单体列表备份，第二次筛选要用到
      // 锚点模态框
      anchorModal: {
        show: false,
        currentGuid: '',
        guidArray: [], // 锚点集合
        posArray: [], // 锚点坐标集合
        pos: {
          x: 0,
          y: 0,
          z: 1
        }
      },
      bimfishApp: null
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  destroyed() {
    // 卸载模型
    this.loadEntity.map(e => {
      // console.log('卸载模型', e)
      this.bimfishApp.unloadTheModel(e)
    })
  },
  mounted() {
    this.getProjectTreeData()
  },
  methods: {
    // bim 初始化
    bimInit(bimArray, isId) {
      if (!bimArray || bimArray.length === 0) {
        return
      }
      // 只传入id和label
      if (isId) {
        let type = this.type === '3d' ? '3d.svf' : 'primaryGraphics.f2d'
        bimArray.map(e => {
          e.modelName = e.name
          e.modelUrl = `${location.origin}${axios.gis.defaults.baseURL}/noToken/basic/commonFile/get/fdht/bim_${e.viewId}/${type}`
        })
      }
      this.isInitComplete = true
      let selectEntity = _.map(bimArray, 'id')
      this.loadEntity = [...selectEntity]
      this.load3dviewer(bimArray)
    },
    // 获取BIM树 - 加载所有模型
    async getProjectTreeData() {
      let res = await bimApi.getProjectTreeData(this.projectId)
      let datas = res.data
      let selectMonomer = []
      datas.map(e => {
        e.id = e.bimResourceId
        e.parent = e.bimResourcePid
        e.label = e.bimResourceName
        e.viewId = e.viewId
        if (e.type === 3) {
          selectMonomer.push(e)
          e.singleFlag = true
        } else {
          e.singleFlag = false
        }
      })
      let copy = toTree(datas, 'parent')
      // console.log(111, copy, selectMonomer)
      this.formatBimArray(selectMonomer)
    },
    // 处理bim数据
    formatBimArray(array, isChange = false) {
      let selectMonomer = []
      let type = this.type === '3d' ? '3d.svf' : 'primaryGraphics.f2d'
      array.map(e => {
        selectMonomer.push({
          id: e.id,
          viewId: e.viewId,
          modelName: e.bimResourceName,
          modelUrl: `${location.origin}${axios.gis.defaults.baseURL}/noToken/basic/commonFile/get/fdht/bim_${e.viewId}/${type}`
        })
      })
      let selectEntityAll = _.map(selectMonomer, 'id')
      this.selectEntityAll = selectEntityAll
      this.selectEntity = [...selectEntityAll]
      this.modelUrlList = selectMonomer
      this.modelUrlListBack = [...selectMonomer]
      if (this.isLoadAll) {
        this.bimInit(selectMonomer)
      }
    },
    // 加载3D视图
    load3dviewer(bimArray) {
      let key = '465758F8f2B54E72b6956A8ba3625a73'
      let secret = '5De5712e99b0435AB47a41673B2B1F97faf51014C47041fB97cc12c1bEb7b185'
      this.bimfishApp = new BimfishApp(this.idSelect, key, secret, { MemoryLimited: true })
      this.bimfishApp.init(() => {
        this.bimfishApp.showModel(bimArray, () => {
          // this.bimfishApp.setGhosting(false) // 设置隐藏构件虚影
          this.bimfishApp.setGhostOpacity(0.07) // 设置隐藏构件虚影透明度
          if (this.hideAll) {
            this.bimfishApp.hideAll()
          }
          // 锚点回显数据
          if (this.anchorData && this.anchorData.length > 0) {
            this.anchorData.map(e => {
              this.addDrawableIconMarkerByPos(e.guid, e.pos, e.status)
            })
          }
        })
        // BIM初始化完毕
        this.bimfishApp.viewer.addEventListener('geometryLoaded', event => {})
        if (this.isAddAnchor) {
          this.bimfishApp.pickPosition(e => {
            this.anchorModal.pos = Object.assign({}, e.point)
            // console.log('监听鼠标点击事件的对象，返回鼠标点击位置的屏幕坐标', e)
          })
          // 监听鼠标点击事件
          this.bimfishApp.viewer.addEventListener('selection', event => {
            this.bimfishApp.getComponentGuid((err, guid, entityId) => {
              // console.log('选择构件的Guid', guid, entityId)
              if (guid) {
                this.addAnchor('0_' + guid)
              }
            })
          })
        }
      })
    },
    // 添加锚点
    addAnchor(guid) {
      // console.log(111, guid, this.anchorModal.pos)
      // 返回添加的点位构件ID集合和坐标集合
      const changeAnchor = () => {
        this.$emit('changeAnchor', {
          componentIds: this.anchorModal.guidArray,
          componentPos: this.anchorModal.posArray
        })
      }
      let index = this.anchorModal.guidArray.indexOf(guid)
      let pos = `${this.anchorModal.pos.x}-${this.anchorModal.pos.y}-${this.anchorModal.pos.z}`
      if (index >= 0) {
        this.bimfishApp.clearOneIconDrawableMarker(guid)
        this.anchorModal.posArray[index] = pos
      } else {
        this.anchorModal.guidArray.push(guid)
        this.anchorModal.posArray.push(pos)
      }
      this.addDrawableIconMarkerByPos(guid, this.anchorModal.pos, 0)
      this.changeAnchor()
    },
    // 添加 2d 图标标注, 根据坐标
    addDrawableIconMarkerByPos(guid, pos, type) {
      const icon = !type
        ? require(`../images/${this.anchorType}.png`)
        : require(`../images/${this.anchorType}-active.png`)
      // console.log('添加 2d 图标标注, 根据坐标', guid, pos)
      this.bimfishApp.addDrawableIconMarkerByPos(guid, icon, pos, e => {
        if (this.isAddAnchor) {
          this.bimfishApp.clearOneIconDrawableMarker(e.id)
          this.deleteAnchor(e.id)
        }
      })
    },
    // 删除锚点
    deleteAnchor(id) {
      let index = this.anchorModal.guidArray.indexOf(id)
      this.anchorModal.posArray.splice(index, 1)
      this.anchorModal.guidArray.splice(index, 1)
      this.changeAnchor()
    },
    // 改变锚点
    changeAnchor() {
      this.$emit('changeAnchor', {
        componentIds: this.anchorModal.guidArray,
        componentPos: this.anchorModal.posArray
      })
    },
    // 获取模型构件guid
    getGuid() {
      this.bimfishApp.getComponentGuid((e, id) => {
        console.log('获取模型构件guid', id)
      })
    },
    // 左侧单体楼层+专业构件展示选中的构件
    watchModal(bimArray, guidArray) {
      this.selectEntity = _.map(bimArray, 'id')
      console.log('当前选择的------', bimArray, this.selectEntity)
      // 需要卸载的模型
      let unloadEntity = this.selectEntityAll.filter(e => !this.selectEntity.includes(e))
      // 要显示的模型
      let loadEntity = this.selectEntityAll.filter(e => this.selectEntity.includes(e))
      // Bim重新加载模型
      this.bimShowModel(unloadEntity, loadEntity, guidArray)
    },
    // Bim重新加载模型
    bimShowModel(unloadEntity, loadEntity, guidArray) {
      // console.log('---------Bim重新加载模型', guidArray)
      // 卸载模型
      unloadEntity.map(e => {
        let index = this.loadEntity.indexOf(e)
        this.bimfishApp.unloadTheModel(e)
        if (index >= 0) {
          this.loadEntity.splice(index, 1)
        }
      })
      // 判断要显示的模型是否已加载
      let list = this.modelUrlList.filter(e => loadEntity.includes(e.id) && !this.loadEntity.includes(e.id))
      let loadIds = _.map(list, 'id')
      console.log('卸载模型', unloadEntity)
      console.log('已加载的', this.loadEntity)
      console.log('被卸载需要重新加载的模型', list)
      if (list.length > 0) {
        // 加载模型
        this.bimfishApp.showModel(list, () => {
          this.isolate(guidArray)
        })
      } else {
        this.isolate(guidArray)
      }
      // 判断模型是否在已加载队列中
      loadIds.map(e => {
        if (!this.loadEntity.includes(e)) {
          this.loadEntity.push(e)
        }
      })
    },
    //隐藏构件
    isolate(guidArray) {
      if (!guidArray || guidArray.length === 0) {
        return
      }
      this.bimfishApp.isolate(guidArray)
    },
    // 进度上色
    planTaskColor(guidArray, colorArray = [1, 0.7333, 0.1608, 0.7]) {
      if (!guidArray || guidArray.length === 0) {
        return
      }
      // console.log('进度上色', guidArray)
      // 清除颜色
      this.bimfishApp.clearThemingColors()
      // 进度上色
      this.bimfishApp.setThemingColorArray(guidArray, ...colorArray)
    },
    // 质量标注
    qualityMarker(guidArray, type) {
      // console.log('BIM初始化完毕qualityMarker', 11111, guidArray, type)
      if (!guidArray || guidArray.length === 0) {
        return
      }
      const icon = type === 1 ? require('../images/quality.png') : require('../images/quality-active.png')
      this.bimfishApp.addDrawableIconMarkerByGUID(guidArray, icon, ({ guid }) => {
        // AppBimfish.getComponentGuid((err,guid, entityId) => {
        //   console.log('getComponentGuid:', guid, entityId)
        // })
        // console.log('screenPoint:', guid)
        // 定位
        this.bimfishApp.fitViewByGUID(guid)
      })
    },
    // 安全标注
    safeMarker(guidArray, type) {
      // this.bimfishApp.clearIconDrawableMarker()
      // console.log('BIM初始化完毕safeMarker', 2222, guidArray, type)
      if (!guidArray || guidArray.length === 0) {
        return
      }
      const icon = type === 1 ? require('../images/safe.png') : require('../images/safe-active.png')
      this.bimfishApp.addDrawableIconMarkerByGUID(guidArray, icon, ({ guid }) => {
        // AppBimfish.getComponentGuid((err,guid, entityId) => {
        //   console.log('getComponentGuid:', guid, entityId)
        // })
        // console.log('screenPoint:', guid)
        // 定位
        this.bimfishApp.fitViewByGUID(guid)
      })
    },
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
          let list = []
          list = await this.getPropertiesByGUID(dbIdRes[item.id].guids)
          if (this.bindType) {
            list = await this.getPropertiesByGUID(dbIdRes[item.id].guids)
          }
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
      console.log('框选数据', arr)
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
    async getExternalIdMapping(model) {
      return new Promise((resolve, reject) => {
        try {
          model.getExternalIdMapping(result => {
            resolve(result)
          })
        } catch (e) {
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
    // 根据{modelId:[guid]}转换为{modelId:{dbIds:[dbId],guids:[guid]}}
    async guidsTranslateDbId(modelIdMapping) {
      const modelGuidMapping = await this.getGuidMappingForMul2(this.bimfishApp.viewer)
      const modelArr = []
      for (let modelId in modelIdMapping) {
        modelArr.push({ modelId: modelId, guidMap: modelGuidMapping[modelId] })
      }
      let resMap = {}

      for (let item of modelArr) {
        let guidMap = item.guidMap //{guid:dbid}
        let targetDbIds = modelIdMapping[item.modelId]
        if (!targetDbIds) continue
        let guIdArray = []
        const guidMapInvert = _.invert(guidMap)
        for (let dbid of targetDbIds) {
          if (guidMapInvert[dbid]) {
            guIdArray.push(guidMapInvert[dbid])
          }
        }
        resMap[item.modelId] = {
          dbIds: targetDbIds,
          guids: guIdArray
        }
      }
      return resMap
    }
  }
}
</script>

<style lang="less" scoped>
.loading-bim {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #fcfcfc;
  img {
    width: auto;
    height: 70%;
  }
}
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
    height: calc(100%);
    padding: 0;

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
.no-box-select {
  /deep/#toolbar-markup3D,
  /deep/#markup {
    display: none;
  }
}
/deep/.svgImage {
  width: 15px !important;
  height: 15px !important;
}
</style>
