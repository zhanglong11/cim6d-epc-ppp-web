// 图形工具类

import { MarkerManager, iconTextureManager } from './bufferPlan'

export const syncLoadModel = (viewer, url) => {
  return new Promise((resolve, reject) => {
    try {
      viewer.loadModel(
        url,
        {
          applyRefPoint: true
        },
        model => {
          resolve(model)
        }
      )
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

export const showModel = async (viewer, nodeArray) => {
  for (let node of nodeArray) {
    const model = await syncLoadModel(viewer, node.modelUrl)
    //this._pendingModels[node.id] = model
    //return model
  }
}

export const fitBounding = (viewer, min, max) => {
  let boundingBox = new THREE.Box3(min, max)
  viewer.navigation.fitBounds(false, boundingBox)
}

export const loadDaeModel = viewer => {
  return new Promise((resolve, reject) => {
    var loader = new THREE.ColladaLoader()
    loader.options.convertUpAxis = true
    var dae
    loader.load(location.origin + '/models/worker3/111.DAE', collada => {
      dae = collada.scene
      console.log('9823 - collada:', collada)
      dae.scale.x = dae.scale.y = dae.scale.z = 10
      dae.rotation.x = Math.PI / 2
      dae.updateMatrix()
      resolve(dae)
    })
  })
}

// 绘制路径管道
export const drawPathTube = (viewer, posCenter) => {
  var curve = new THREE.CatmullRomCurve3(posCenter)
  var tubeGeometry = new THREE.TubeGeometry(curve, 100, 3.0, 100, false)
  tubeGeometry.computeVertexNormals()

  var texture = new THREE.ImageUtils.loadTexture('./img/arrow2.jpg')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.x = 100
  texture.repeat.y = 8
  texture.needsUpdate = true

  var tubeMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: false,
    side: THREE.DoubleSide,
    depthWrite: true,
    depthTest: true
    //color:0xff0000
  })

  viewer.impl.matman().removeMaterial('ashaderMaterial')
  viewer.impl.matman().addMaterial('ashaderMaterial', tubeMaterial, true)

  tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
  return tube
}

export const draw2dPathTube = (viewer, points) => {
  var path = new THREE.CatmullRomCurve3(points)
  var tube = new THREE.Mesh(
    new THREE.TubeGeometry(path, 10, 0.003, 8, false),
    new THREE.MeshBasicMaterial({
      color: 0xffff00
    })
  )

  var arraw = add2dTriagle(points[points.length - 1], points[points.length - 2])

  return {
    tube,
    arraw
  }
}

export const add2dTriagle = (position, positionFrom) => {
  var triangleShape = new THREE.Shape()
  triangleShape.moveTo(0, 0)
  triangleShape.lineTo(0.01, 0)
  triangleShape.lineTo(0, 0.01)
  triangleShape.lineTo(-0.01, 0)
  triangleShape.lineTo(0, 0)

  var rectMesh = new THREE.Mesh(
    new THREE.ShapeGeometry(triangleShape),
    new THREE.MeshBasicMaterial({
      color: 0xffff00
    })
  )

  // 取最后一个点的位置就是当前点
  rectMesh.position.set(position.x, position.y, position.z)

  // 取最后一个和倒数第二个点
  var pos1 = position
  var pos2 = positionFrom

  pos1.sub(pos2)

  var ang = new THREE.Vector3(0, 1, 0).angleTo(pos1)

  rectMesh.rotation.z = -ang
  return rectMesh
}

// 添加煤矿环境光
export const addMeiKuangLight = viewer => {
  const preset = window.BimFish.Viewing.Private.LightPresets[0]
  const myPreset = {}
  window.BimFish.Viewing.Private.copyLightPreset(preset, myPreset)

  myPreset.name = '煤矿'
  myPreset.path = 'SharpHighlights'
  myPreset.tonemap = 1
  myPreset.E_bias = 1
  myPreset.bgColorGradient = [0, 64, 255, 0, 163, 255]
  myPreset.directLightColor = [1, 1, 1]
  myPreset.ambientColor = [0.03125, 0.03125, 0.03125]
  myPreset.lightMultiplier = 0.5
  myPreset.lightDirection = [0.1, -0.55, -1.0]
  myPreset.darkerFade = false

  BimFish.Viewing.Private.LightPresets.push(myPreset)

  const idx = BimFish.Viewing.Private.LightPresets.indexOf(myPreset)
  viewer.setLightPreset(idx)
}

// 初始化marker icon
export const initMakerTextuer = async () => {
  await iconTextureManager.defineIcon('broadcast', './img/broadcast.png')
  await iconTextureManager.defineIcon('fire', './img/fire.png')
  await iconTextureManager.defineIcon('flood', './img/flood.png')
  await iconTextureManager.defineIcon('gas', './img/gas.png')
  await iconTextureManager.defineIcon('pressure', './img/pressure.png')
  await iconTextureManager.defineIcon('staff', './img/staff.png')
  await iconTextureManager.defineIcon('video', './img/video.png')
}

// 3d坐标转2D
export const threeToTwo = (viewer, position) => {
  var center = new THREE.Vector3(37602330.2207, 3855602.8621, 0)
  var scale = 0.3048
  var v3d = new THREE.Vector3(position.x * scale, position.y * scale, position.z * scale)
  if (viewer.model.is2d()) {
    // 此处用1有隐患
    var vpXform = viewer.model.getPageToModelTransform(1)
    var inverseVpxFrom = new THREE.Matrix4().getInverse(vpXform)
    v3d.add(center)
    v3d.applyMatrix4(inverseVpxFrom)
    v3d.z = 0
    return v3d
  }
}
