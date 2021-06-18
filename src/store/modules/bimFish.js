/*
 * @Description:
 * @Version:
 * @Autor:
 * @Date: 2020-03-04 16:13:14
 * @LastEditTime: 2020-03-04 16:55:13
 */
/*
图形model

gnd01 - loadViewer(context, {viewerContainer})     加载3d 模型
gnd02 - load2DViewer(context, { viewerContainer }) 加载2d 模型
gnd03 - watchGuid(context)                         实时监听选中构件的guid，debug用
gnd04 - locateComponent(context, {guid})           根据guid定位到构件(3D视图)
gnd05 - showAllRoutePath(context, { pathDataArray, speed, type }) 显示所有的逃生模拟路径(3D视图)
gnd06 - showOneRoutePath(context, { pathName, pathId, pathData }) 显示单条逃生模拟路径(3D视图)
gnd07 - show2DOneRoutePath(context,{pathName, pathId, pathData }) 显示单条逃生模拟路径(2D视图)
gnd09 - destoryRoutePath(context)                  销毁逃生路径
gnd10 - getComponentGuid(context, { callback })    获取选中构件的guid, debug用
gnd11 - showMarkerList(context, { data })          显示所有的标注
gnd12 - getBoundingBox(context, {dbId})            获取构件的boundingbox
gnd13 - getPos(context)                            采集鼠标点中的三维坐标
gnd14 - gotoViewport(context)                      视角转到home视角(3D视图)
gnd15 - locateComponent2d(context, {bboxStr})      定位到构件(2D视图)   
*/

import ToolKit from '@/BIM/Viewer.Toolkit'
import { SegmentLine3D } from '@/BIM/animationHelper.js'
import { MarkerManager, iconTextureManager } from '@/BIM/bufferPlan'
import EventTool from '@/BIM/Viewer.EventTool.js'
// import { markerApi } from '../../api/marker/marker'
import Toolkit from '@/BIM/Viewer.Toolkit'
import {
  syncLoadModel,
  showModel,
  fitBounding,
  loadDaeModel,
  drawPathTube,
  draw2dPathTube,
  add2dTriagle,
  addMeiKuangLight,
  initMakerTextuer,
  threeToTwo
} from '@/BIM/utils/bimUtils'

const homeViewport =
  '{"seedURN":"http://localhost:8080/models/V1/3d.svf","objectSet":[{"id":[],"isolated":[],"hidden":[],"explodeScale":0,"idType":"lmv"}],"viewport":{"name":"","eye":[2479.6438354753705,-1389.2378387825772,13342.986486494707],"target":[308.6799364561548,588.4013678454733,-157.11355860826188],"up":[0.004809908968819024,0.9895390894700876,0.14418479526781508],"worldUpVector":[0,0,1],"pivotPoint":[-191.060546875,2525.498046875,207.016845703125],"distanceToOrbit":13815.818553753068,"aspectRatio":1.790454016298021,"projection":"orthographic","isOrthographic":true,"orthographicHeight":13815.818553753024},"renderOptions":{"environment":"煤矿","ambientOcclusion":{"enabled":true,"radius":10,"intensity":1},"toneMap":{"method":1,"exposure":1,"lightMultiplier":-1},"appearance":{"ghostHidden":true,"ambientShadow":true,"antiAliasing":true,"progressiveDisplay":true,"swapBlackAndWhite":false,"displayLines":true,"displayPoints":true}},"cutplanes":[]}'
var BimFish = window.BimFish
var THREE = window.THREE
var routerTimer = null
var tube = null
var peopleObject = null
var pendingModels = {}

// 初始化标注

export default {
  namespaced: true,
  state: {
    viewer: null,
    isDebug: false,
    isShowLocationPanel: false,
    isShowMoniterPanel: false,
    guidMapping: {},
    currentSelectedMarkId: '',
    currentSelectedPos: {},
    is2d: false
  },
  mutations: {
    save(state, data) {
      state.viewer = data.viewer
      state.guidMapping = data.guidMapping
      state.is2d = data.is2d
    },
    updateSelectedMark(state, data) {
      state.currentSelectedMarkId = data.id
      state.currentSelectedPos = data.pos
    }
  },
  actions: {
    // 加载模型
    async loadViewer(context, { viewerContainer, callback }) {
      console.log()
      let viewer = null
      /*
      if (context.state.viewer) {
        viewer = context.state.viewer
        viewer.tearDown()
        viewer = new BimFish.Viewing.Private.GuiViewer3D(viewerContainer)
        BimFish.Viewing.Initializer({ env: 'Local' }, async () => {
          viewer.initialize()
          showModel(viewer, [
            { id: 4, modelUrl: location.origin + '/models/1209/3d.svf' }

          ])
          context.commit('save', { viewer: viewer , is2d:false})
        })
      } else {
      */
      viewer = new BimFish.Viewing.Private.GuiViewer3D(viewerContainer)

      BimFish.Viewing.Initializer(
        {
          env: 'Local'
        },
        async () => {
          viewer.initialize()
          // 设置环境光
          viewer.setLightPreset(5)

          showModel(viewer, [
            //{ id: 3, modelUrl: location.origin + '/models/1209/3d.svf' }
            { id: 'jian-hang-gong-cheng', modelUrl: location.origin + '/models/井巷工程/3d.svf' }
            //{id: 'jian-kong-jian-ce', modelUrl: location.origin + '/models/监控监测/3d.svf' },
            //{id: 'ren-yuan-ding-wei', modelUrl: location.origin + '/models/人员定位/3d.svf' },
            //{id: 'san-wei-di-zhi', modelUrl: location.origin + '/models/三维地质/3d.svf' },
            //{id: 'xi-tong-guan-xian', modelUrl: location.origin + '/models/系统管线/3d.svf' },
          ])

          // 初始化视点
          viewer.addEventListener(BimFish.Viewing.GEOMETRY_LOADED_EVENT, evt => {
            viewer.restoreState(JSON.parse(homeViewport))
          })

          // 添加环境光
          addMeiKuangLight(viewer, { viewerContainer })

          const guidMapping = await ToolKit.getGuidMappingForMul2(viewer)
          context.commit('save', {
            viewer: viewer,
            guidMapping: guidMapping,
            is2d: false
          })
        }
      )
      //}
      callback(viewer)
    },
    // 加载2D模型
    async load2DViewer(context, { viewerContainer, callback }) {
      let viewer = context.state.viewer
      viewer.tearDown()

      viewer = new BimFish.Viewing.Private.GuiViewer3D(viewerContainer)
      BimFish.Viewing.Initializer({ env: 'Local' }, async () => {
        viewer.initialize()

        await showModel(viewer, [
          { id: 4, modelUrl: location.origin + '/models/f3145781-5d7b-a902-aff9-7f668b0e6144_f2d/primaryGraphics.f2d' }
        ])

        viewer.setSwapBlackAndWhite(true)
        viewer.setBackgroundColor(0, 64, 255, 0, 163, 255)

        context.commit('save', { viewer: viewer, is2d: true })
        callback(viewer)
      })
    },
    // TODO: 加入一个模型
    async addOneModel(context, { id, modelUrl, callback }) {
      const viewer = context.state.viewer
      viewer.loadModel(modelUrl, { applyRefPoint: true }, model => {
        pendingModels[id] = model
      })
    },
    // TODO: 卸载一个模型
    async unloadModel(context, { id }) {
      const viewer = context.state.viewer
      if (pendingModels.hasOwnProperty(id)) {
        viewer.impl.unloadModel(pendingModels[id])
      }
    },
    // 获取guid
    // example: $store.dispatch('bimModel/watchGuid')
    async watchGuid(context) {
      console.log('watchGuid is invorked')
      if (!context.state.viewer) {
        return
      }

      const viewer = context.state.viewer
      viewer.addEventListener(BimFish.Viewing.SELECTION_CHANGED_EVENT, event => {
        if (event.dbIdArray && event.dbIdArray.length > 0) {
          const dbid = event.dbIdArray[0]
          viewer.model.getProperties(dbid, props => {
            console.log('8273 - props:', props)
          })
        }
      })
    },
    // 定位构件
    // example: $store.dispatch('bimModel/locateComponent', {guid:'3ff6f9b9-bfbb-4645-bb80-ad0998d50668-00120a8f'})
    async locateComponent(context, { guid }) {
      if (!context.state.viewer) {
        console.warn('图形尚未加载')
        return
      }
      if (!guid) {
        console.warn('没有guid')
        return
      }
      const viewer = context.state.viewer
      const guidMapping = context.state.guidMapping
      await ToolKit.fitViewByGUID(viewer, guid, guidMapping)
    },
    // 逃生模拟-所有路径
    async showAllRoutePath(context, { pathDataArray, speed, type }) {},
    // 逃生模拟-单个路径
    // pathData [298,3232,32,2324,234,234,23,4234,4343]
    async showOneRoutePath(context, { pathName, pathId, pathData }) {
      const viewer = context.state.viewer
      if (!viewer) {
        return
      }
      if (!pathData) {
        return
      }
      var posCenter = []
      var scale = 3.2808399
      var zOffset = 30
      var locationSegment = new SegmentLine3D()
      for (var i = 0; i < pathData.length; i += 3) {
        posCenter.push(
          new THREE.Vector3(pathData[i] * scale, pathData[i + 1] * scale, pathData[i + 2] * scale + zOffset)
        )
        locationSegment.addPoint(
          new THREE.Vector3(pathData[i] * scale, pathData[i + 1] * scale, pathData[i + 2] * scale + zOffset)
        )
      }
      let abox = ToolKit.getBoundingBoxByPos(posCenter)
      fitBounding(viewer, abox.min, abox.max)
      let arraw = null
      //在这里区分2D和3D
      tube = drawPathTube(viewer, posCenter)
      viewer.impl.scene.add(tube)
      viewer.impl.invalidate(false, true, true)
      if (routerTimer) {
        clearInterval(routerTimer)
        routerTimer = null
      }
      routerTimer = setInterval(() => {
        tube.material.map.offset.x -= 0.6
        viewer.impl.invalidate(false, true, true)
      }, 300)
    },
    // 2d 显示逃生路径
    async show2DOneRoutePath(context, { pathName, pathId, pathData }) {
      const viewer = context.state.viewer
      if (!viewer) {
        return
      }
      if (!pathData) {
        return
      }
      var posCenter = []
      var scale = 3.2808399
      var zOffset = 30
      var locationSegment = new SegmentLine3D()
      for (var i = 0; i < pathData.length; i += 3) {
        const twoPosition = threeToTwo(
          viewer,
          new THREE.Vector3(pathData[i] * scale, pathData[i + 1] * scale, pathData[i + 2] * scale)
        )
        posCenter.push(twoPosition)
      }
      let abox = ToolKit.getBoundingBoxByPos(posCenter)
      fitBounding(viewer, abox.min, abox.max)
      // 转换所有的点
      const tube2d = draw2dPathTube(viewer, posCenter)
      viewer.impl.createOverlayScene('mytube')
      viewer.impl.addOverlay('mytube', tube2d.tube)
      viewer.impl.addOverlay('mytube', tube2d.arraw)
      viewer.impl.invalidate(false, true, true)
    },

    // 关闭逃生模拟以及路径
    async destoryRoutePath(context) {
      const viewer = context.state.viewer
      if (tube) {
        viewer.impl.scene.remove(tube)
        tube = null
      }

      viewer.impl.fitToView(viewer.impl.selector.getAggregateSelection())

      if (routerTimer) {
        clearInterval(routerTimer)
        routerTimer = null
      }
    },

    // 获取guid
    async getComponentGuid(context, { callback }) {
      var viewer = context.state.viewer
      if (viewer) {
        const selection = viewer.impl.selector.getAggregateSelection()
        if (selection.length > 0) {
          const prop = await ToolKit.getPropertieObj(selection[0].model, selection[0].selection[0])
          console.log('prop:', prop)
          callback(prop.externalId)
        }
      }
    },

    // 显示标注
    // vueapp.$store.dispatch('bimModel/showMarkerList')
    async showMarkerList(context, { data }) {
      console.log('3946 - showMarkerList')
      return
      // 一大堆标注,每个标注都有guid,都有类型
      const res = await markerApi.getProductionMarkers()

      // 初始化标注
      await initMakerTextuer()

      console.log('3946 - res:', res)

      const viewer = context.state.viewer

      const markerManager = new MarkerManager(viewer)

      // 根据guid获取dbid
      // 根据dbid 获取 center

      if (viewer.model.is2d()) {
        for (let item of res) {
          if (!item.position) continue
          //2d
          //获取postion
          const position = item.position.split(',').map(res => parseFloat(res))

          //把position转化为2d
          const twoPosition = threeToTwo(viewer, new THREE.Vector3(position[0], position[1], position[2]))
          console.log('8272 - twoPosition:', twoPosition)
          //绘制
          markerManager.addMarker(item.id, item.type, item.value, twoPosition, 0.001)
        }
      } else {
        const guidMapping = await ToolKit.getExternalIdMapping(viewer.model)
        for (let item of res) {
          //3d
          if (!guidMapping[item.guid]) continue
          const dbId = guidMapping[item.guid]
          const bbox = await ToolKit.getWorldBoundingBox(viewer.model, dbId)
          const pos = bbox.center()
          markerManager.addMarker(item.id, item.type, item.value, pos, 1)
        }
      }
      viewer.impl.invalidate(true)

      markerManager.on('select', evt => {
        if (context.state.currentSelectedMarkId) {
          context.commit('updateSelectedMark', {
            id: '',
            pos: {}
          })
        } else {
          context.commit('updateSelectedMark', {
            id: evt.id,
            pos: evt.canvasPos
          })
        }
      })
    },

    // 通过dbid获取boundingbox
    async getBoundingBox(context, { dbId }) {
      const viewer = context.state.viewer
      const bbox = await ToolKit.getWorldBoundingBox(viewer.model, dbId)
      console.log('bbox:', bbox)
      console.log('bbox.center', bbox.center())
    },
    // 采集坐标
    async getPos(context) {
      const viewer = context.state.viewer
      if (viewer) {
        const eventTool = new EventTool(viewer)
        eventTool.activate()
        eventTool.on('singleclick', event => {
          const hitTest = viewer.clientToWorld(event.canvasX, event.canvasY, true)
          console.log('hitTest:', hitTest)
        })
      }
    },

    // 到达视点
    async gotoViewport(context) {
      context.state.viewer.restoreState(JSON.parse(homeViewport))
    },

    // 通过boundingbox 定位到构件, 用于二维
    async locateComponent2d(context, { bboxStr }) {
      if (!bboxStr) {
        console.warn('bboxStr is null')
        return
      }
      const viewer = context.state.viewer
      if (!viewer) {
        console.warn('图形尚未加载')
        return
      }
      if (!viewer.model.is2d()) {
        console.warn('2d专用')
        return
      }
      const bboxArray = bboxStr.split(',').map(res => parseFloat(res))
      // 转换坐标
      let offset = 10
      let min = new THREE.Vector3(bboxArray[0] - offset, bboxArray[1] - offset, bboxArray[2])
      let max = new THREE.Vector3(bboxArray[3] + offset, bboxArray[4] + offset, bboxArray[5])
      min = threeToTwo(viewer, min)
      max = threeToTwo(viewer, max)

      // 根据boundingbox定位
      fitBounding(viewer, min, max)
    }
  }
}
