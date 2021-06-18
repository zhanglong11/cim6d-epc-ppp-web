// 标注类

class Box {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  getSpace() {
    return this.width * this.height
  }
}

class SpaceManager {
  constructor(width, height) {
    this.boxes = []
    this.spaces = [new Box(0, 0, width, height)]
  }

  isSpaceToPlace(width, height) {
    return this._findMininmumFindSpaceIndex(width, height) < this.spaces.length
  }

  addBox(width, height) {
    if (!this.isSpaceToPlace(width, height)) {
      console.log(width, height, this.spaces)
      return { result: false, box: null }
    } else {
      let spaceIdx = this._findMininmumFindSpaceIndex(width, height)
      let space = this.spaces[spaceIdx]
      //this.boxes.push(new Box(space.x, space.y, width, height));
      this._splitSpaceAt(spaceIdx, width, height)
      return { result: true, box: { x: space.x, y: space.y, width, height } }
    }
  }

  releaseBox(x, y, width, height) {
    this.spaces.push(new Box(x, y, width, height))
    this._reorderSpace()
  }

  _findMininmumFindSpaceIndex(width, height) {
    let space = width * height
    let idx = 0
    let len = this.spaces.length
    while (
      idx < len &&
      (this.spaces[idx].getSpace() < space || this.spaces[idx].width < width || this.spaces[idx].height < height)
    ) {
      idx++
    }

    return idx
  }

  _splitSpaceAt(index, width, height) {
    let space = this.spaces.splice(index, 1)[0]
    let newSpaces = []
    if (space.width > width) {
      newSpaces.push(new Box(space.x + width, space.y, space.width - width, height))
    }

    if (space.height > height) {
      newSpaces.push(new Box(space.x, space.y + height, width, space.height - height))
    }

    if (space.width > width && space.height > height) {
      newSpaces.push(new Box(space.x + width, space.y + height, space.width - width, space.height - height))
    }
    this.spaces = [...this.spaces, ...newSpaces]
  }

  _reorderSpace() {
    this.spaces.sort((a, b) => a.getSpace() - b.getSpace())
  }
}

/**
 *
 * @param {number} value
 */
function ceilPowerOfTwo(value) {
  return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2))
}

/**
 *
 * @param {number} value
 */
function floorPowerOfTwo(value) {
  return Math.pow(2, Math.floor(Math.log(value) / Math.LN2))
}

class EntityTexture {
  constructor(url) {
    this._texUrl = url
    this.texture = THREE.ImageUtils.loadTexture(url)
    this.texture.flipY = false
  }

  bindToMesh(mesh) {
    this._belongTo = mesh
  }

  refresh(newUrl) {
    this.texture = THREE.ImageUtils.loadTexture(newUrl)
    this.texture.flipY = false

    if (this._belongTo) {
      this._belongTo.material.map = this.texture
      this._belongTo.material.needsUpdate = true
    }
  }
}

class LabelTextureManager {
  constructor(maxSideLength, fontSize = 14, lineHeight = 24, padding = 6, borderRadius = 4) {
    maxSideLength = floorPowerOfTwo(maxSideLength)
    this._texSideLength = maxSideLength
    this._padding = padding * 2
    this._fontSize = fontSize * 2
    this._lineHeight = lineHeight * 2
    this._borderRadius = borderRadius * 2

    this._textures = {}

    let firstCanvas = document.createElement('canvas')
    firstCanvas.width = firstCanvas.height = maxSideLength
    this.canvas = [firstCanvas]
    this.spaceManagers = [new SpaceManager(maxSideLength, maxSideLength)]
  }

  _createNewCanvas() {
    const newCanvas = document.createElement('canvas')
    newCanvas.width = newCanvas.height = this._texSideLength
    const newSpaceManager = new SpaceManager(this._texSideLength, this._texSideLength)
    this.canvas.push(newCanvas)
    this.spaceManagers.push(newSpaceManager)
  }

  _findApproprateCanvas(text) {
    let i = 0
    let canvasLen = this.canvas.length
    for (; i < canvasLen; i++) {
      let ctx = this.canvas[i].getContext('2d')
      ctx.save()
      ctx.font = `${this._fontSize}px Arial`
      let { width } = ctx.measureText(text)
      ctx.restore()
      if (
        this.spaceManagers[i].isSpaceToPlace(Math.ceil(width) + 2 * this._padding, this._lineHeight + 2 * this._padding)
      ) {
        return i
      }
    }
    this._createNewCanvas()
    return i
  }

  _drawLabelToCanvas(text, x, y, width, height, ctx) {
    ctx.save()
    ctx.font = `${this._fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#ff0000'
    ctx.fillText(text, x + width / 2, y + height / 2)
    ctx.restore()
  }

  createLabelTexture(text) {
    if (this._textures[text]) {
      let cachedTexture = this._textures[text]
      let canvas = this.canvas[cachedTexture.canvasIndex]

      return {
        textureUrl: canvas.toDataURL(),
        textureUvs: cachedTexture.textureUvs
      }
    }

    let canvasIndex = this._findApproprateCanvas(text)
    let spManager = this.spaceManagers[canvasIndex]
    let canvas = this.canvas[canvasIndex]
    let ctx = canvas.getContext('2d')
    ctx.save()
    ctx.font = `${this._fontSize}px Arial`
    let { width: textWidth } = ctx.measureText(text)
    ctx.restore()
    let labelWidth = Math.ceil(textWidth + 2 * this._padding)
    let labelHeight = this._lineHeight + 2 * this._padding
    let {
      result,
      box: { x, y, height, width }
    } = spManager.addBox(labelWidth, labelHeight)
    console.log(x, y, width, height)
    if (!result) throw 'Can not add new box to canvas: ' + canvasIndex

    this._drawLabelToCanvas(text, x, y, labelWidth, labelHeight, ctx)

    let textureUrl = canvas.toDataURL()
    console.log(textureUrl)
    let leftBottom = [x, y + labelHeight]
    let leftTop = [x, y]
    let rightTop = [x + labelWidth, y]
    let rightBottom = [x + labelWidth, y + labelHeight]

    let uvPoints = [leftTop, rightTop, rightBottom, leftBottom].reverse()
    console.log(uvPoints)
    let textureUvs = uvPoints.reduce((acc, point) => {
      const [x, y] = point
      return [...acc, x / this._texSideLength, y / this._texSideLength]
    }, [])

    this._textures[text] = {
      canvasIndex,
      textureUvs,
      drawInfo: { x, y, width, height }
    }

    return {
      textureUrl,
      textureUvs,
      width,
      height
    }
  }

  /**
   *
   * @param {string} fromText
   * @param {string} toText
   */
  switchTextTo(fromText, toText) {
    if (this._textures[fromText]) {
      let tex = this._textures[fromText]
      let { x, y, width, height } = tex.drawInfo
      this.spaceManagers[tex.canvasIndex].releaseBox(x, y, width, height)
      delete this._textures[fromText]
    }

    return this.createLabelTexture(toText)
  }
}

class IconTextureManager {
  constructor(canvasSideLength = 512) {
    this._canvasSideLength = canvasSideLength
    this._spaceManger = new SpaceManager(canvasSideLength, canvasSideLength)
    this._canvas = document.createElement('canvas')
    this._canvas.width = this._canvas.height = canvasSideLength

    this._definedIcons = {}
  }

  /**
   *
   * @param {string} name
   * @param {HTMLImageElement | string} pic
   * @return {Promise}
   */
  defineIcon(name, pic) {
    if (this._definedIcons[name]) {
      return Promise.resolve(this._definedIcons[name])
    }

    if (typeof pic === 'string') {
      return new Promise((resolve, reject) => {
        let image = new Image()

        image.onload = () => {
          let {
            result,
            box: { x, y, width, height }
          } = this._spaceManger.addBox(image.width, image.height)
          if (!result) {
            reject(new Error('Do not have enough space'))
          }
          let ctx = this._canvas.getContext('2d')
          ctx.drawImage(image, x, y)
          let textureUrl = this._canvas.toDataURL()
          let leftBottom = [x, y + height]
          let leftTop = [x, y]
          let rightTop = [x + width, y]
          let rightBottom = [x + width, y + height]

          let uvPoints = [leftTop, rightTop, rightBottom, leftBottom].reverse()
          let textureUvs = uvPoints.reduce((acc, point) => {
            const [x, y] = point
            return [...acc, x / this._canvasSideLength, y / this._canvasSideLength]
          }, [])
          console.log(width, height)
          let texture = new EntityTexture(textureUrl)

          this._definedIcons[name] = {
            width: image.width,
            height: image.height,
            texture,
            textureUvs
          }

          resolve(this._definedIcons[name])
        }

        image.onerror = () => {
          reject(new Error('image load failure error'))
        }

        image.crossOrigin = true

        image.src = pic
      })
    } else {
      return new Promise(resolve => {
        let {
          result,
          box: { x, y, width, height }
        } = this._spaceManger.addBox(pic.width, pic.height)
        if (!result) {
          reject(new Error('Do not have enough space'))
        }
        let ctx = this._canvas.getContext('2d')
        ctx.drawImage(pic, x, y)

        let textureUrl = this._canvas.toDataURL()
        let leftBottom = [x, y + height]
        let leftTop = [x, y]
        let rightTop = [x + width, y]
        let rightBottom = [x + width, y + height]

        let uvPoints = [leftTop, rightTop, rightBottom, leftBottom].reverse()
        let textureUvs = uvPoints.reduce((acc, point) => {
          const [x, y] = point
          return [...acc, x / this._canvasSideLength - 1, y / this._canvasSideLength - 1]
        }, [])
        let texture = new EntityTexture(textureUrl)
        texture.flipY = false
        this._definedIcons[name] = {
          width: pic.width,
          height: pic.height,
          texture,
          textureUvs
        }

        resolve(this._definedIcons[name])
      })
    }
  }

  /**
   *
   * @param {string} name
   */
  getIconTexture(name) {
    return this._definedIcons[name]
  }

  /**
   *
   * @param {string | string[]} name icon名称
   */
  isIconsDefined(name) {
    if (!Array.isArray(name)) name = [name]

    return name.every(n => !!this._definedIcons[n])
  }
}

const entityVertexShader = `
  uniform vec2 uViewport;
  uniform vec2 uEntitySize;
  uniform vec3 uEntityPosition;
  uniform mat4 uRotation;
  varying vec2 vUv;

  void main() {
      vUv = uv;
      vec4 pointPos = uRotation * vec4(position, 1.0);
      vec4 pointPos2 = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec4 pos = projectionMatrix * modelViewMatrix  * vec4(uEntityPosition , 1.0);
      //gl_Position = vec4(pointPos.xy, pointPos2.z, 1.0) + vec4(pos.xy, 0.0, 0.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const entityFragmentShader = `
  uniform sampler2D uMap;
  varying vec2 vUv;

  void main() {
      gl_FragColor = texture2D(uMap, vUv);
  }
`

class Entity {
  /**
   *
   * @param {string} id
   * @param {THREE.Vector3} pos
   * @param {THREE.BufferGeometry} geo
   * @param {EntityTexture} texture
   */
  constructor(id, pos, width, height, uvs, texture) {
    this.id = id
    this.position = pos
    this.texture = texture
    this.width = width
    this.height = height
    this.viewport = new THREE.Vector2(0, 0)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { type: 't', value: texture.texture },
        uViewport: { type: 'v2', value: this.viewport },
        uEntitySize: { type: 'v2', value: new THREE.Vector2(this.width, this.height) },
        uEntityPosition: { type: 'v3', value: this.position },
        uRotation: { type: 'm4', value: new THREE.Matrix4() }
      },
      vertexShader: entityVertexShader,
      fragmentShader: entityFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true
    })
    this.width = texture.width
    this.height = texture.height
    this.geo = createMarkerGeo(width, height, uvs)
    this.mesh = new THREE.Mesh(this.geo, this.material)
    if (typeof texture.bindToMesh === 'function') texture.bindToMesh(this.mesh)
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  setPosition(x, y, z) {
    this.position.set(x, y, z)
    this.material.needsUpdate = true
  }

  /**
   *
   * @param {EntityTexture} texture
   */
  setTexture(textureInfo) {
    let texture = new EntityTexture(textureInfo.textureUrl)
    console.log(textureInfo)
    this.material.uniforms.uMap.value = texture.texture
    this.material.needsUpdate = true
    let newGeo = createMarkerGeo(textureInfo.width, textureInfo.height, textureInfo.textureUvs)
    this.geo.attributes.position.set(newGeo.attributes.position.array)
    this.geo.attributes.position.needsUpdate = true
    this.geo.attributes.index.set(newGeo.attributes.index.array)
    this.geo.attributes.index.needsUpdate = true
    this.geo.attributes.uv.set(newGeo.attributes.uv.array)
    this.geo.attributes.uv.needsUpdate = true
    console.log(this.mesh)

    this.geo.needsUpdate = true
  }

  setViewport(width, height) {
    this.viewport.set(width, height)
  }

  setRotation(eulerRotation) {
    let mat = new THREE.Matrix4()
    mat.makeRotationFromEuler(eulerRotation)

    this.material.uniforms.uRotation.value = mat
    this.material.needsUpdate = true
  }
}

class EntityMananger {
  constructor() {
    /**@type {Entity[]} */
    this.entities = []
  }

  /**
   *
   * @param {Entity} entity
   */
  addEntity(entity) {
    this.entities.push(entity)
  }
}

function createMarkerGeo(width, height, uvs) {
  console.log('8732 - width:', width)
  console.log('8732 - height:', height)
  let geo = new THREE.BufferGeometry()
  let positions = new Float32Array([0, 0, 0, width, 0, 0, width, height, 0, 0, height, 0])

  let indices = new Uint16Array([3, 0, 1, 3, 1, 2])
  geo.addAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.addAttribute('index', new THREE.BufferAttribute(indices, 1))
  geo.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))

  return geo
}

const labelTextureManager = new LabelTextureManager(1024)
export const iconTextureManager = new IconTextureManager(1024)

iconTextureManager.defineIcon('test', '/assets/img/icon.png')

class Marker {
  /**
   *
   * @param {string} id
   * @param {string} type Marker类别
   * @param {string} label
   * @param {THREE.Vector3} pos Marker的位置
   * @param {float} scale 图标缩放的倍数
   */
  constructor(id, type, label, pos, scale = 1) {
    this.id = id
    this.type = type
    this.isHide = false
    this.label = label
    let _label = label

    let labelTexInfo = labelTextureManager.createLabelTexture(label)
    let labelTexture = new EntityTexture(labelTexInfo.textureUrl)
    this._label = new Entity(
      `${id}_label`,
      new THREE.Vector3(0, 0, 0),
      labelTexInfo.width * scale,
      labelTexInfo.height * scale,
      labelTexInfo.textureUvs,
      labelTexture
    )
    let iconTexInfo = iconTextureManager.getIconTexture(type)
    this._icon = new Entity(
      `${id}_icon`,
      new THREE.Vector3(0, 0, 0),
      iconTexInfo.width * scale,
      iconTexInfo.height * scale,
      iconTexInfo.textureUvs,
      iconTexInfo.texture
    )
    this._label.id = this._icon.id = id
    this._label.mesh.userData['id'] = id
    this._icon.mesh.userData['id'] = id
    this._label.mesh.userData['type'] = this.type
    this._icon.mesh.userData['type'] = this.type

    // Object.defineProperty(this, 'label', {
    //     get() {
    //         return _label;
    //     },
    //     set(newVal) {
    //         let newLabelTexture = labelTextureManager.switchTextTo(_label, newVal);
    //         labelGeo.getAttribute('uv').set(new Uint16Array(newLabelTexture.textureUvs));
    //         labelTexture.refresh(newLabelTexture.textureUrl);
    //         _lable = newVal;
    //     }
    // })
    this._marker = new THREE.Object3D()
    this._marker.add(this._label.mesh)
    this._marker.add(this._icon.mesh)
    this._label.setPosition(pos)
    this._icon.setPosition(pos)
    this._label.mesh.position.set(iconTexInfo.width, 0, 0)
    this._marker.position.set(pos.x, pos.y, pos.z)
  }

  /**
   *
   * @param {THREE.Vector3} pos
   */
  setPosition(pos) {
    this._marker.position.set(pos.x, pos.y, pos.z)
  }

  setLabel(newLabel) {
    let newLabelTextureInfo = labelTextureManager.switchTextTo(this.label, newLabel)
    this.label = newLabel
    console.log(newLabelTextureInfo)
    this._label.setTexture(newLabelTextureInfo)
  }
}

class EventEmitter {
  constructor() {
    this._callbacks = {}
  }

  on(type, fn, thisArg = fn) {
    if (!this._callbacks[type]) {
      this._callbacks[type] = []
    }

    this._callbacks[type].push({ fn, thisArg })
  }

  emit(type, ...args) {
    if (this._callbacks[type]) {
      for (let cb of this._callbacks[type]) {
        cb.fn.call(cb.thisArg, ...args)
      }
    }
  }

  off(type, fn) {
    let cbs = this._callbacks[type]
    if (cbs) {
      return
    }

    let fnIdx = cbs.findIndex(cb => cb.fn === fn)

    cbs.split(fnIdx, 1)
  }
}

export class MarkerManager extends EventEmitter {
  /**
   *
   * @param {BIMFish.Viewer} viewer
   */
  constructor(viewer) {
    super()
    /**@type { [key: string]: Marker } */
    this.markerMap = {}
    this._hidedMarkers = {}
    this.viewer = viewer
    this._initialPos = viewer.impl.camera.position.clone()
    this._mouse = new THREE.Vector2()
    this._raycaster = new THREE.Raycaster()

    viewer.addEventListener(BimFish.Viewing.CAMERA_CHANGE_EVENT, this._handleCameraChange)
    viewer.impl.canvas.addEventListener('click', this._handleMouseClick)
  }

  _handleCameraChange = evt => {
    let camera = evt.camera
    let rotation = camera.rotation
    let matrix = evt.camera.matrix
    let nowPos = camera.position
    for (let k in this.markerMap) {
      let marker = this.markerMap[k]
      marker._marker.setRotationFromMatrix(matrix)
      marker._label.setRotation(rotation)
      marker._icon.setRotation(rotation)
      // let initialDistance = this._initialPos.distanceTo(marker.position);
      // let nowDistance = nowPos.distanceTo(marker.position);
      // let scale =  1 - (initialDistance - nowDistance ) / initialDistance;
      //marker.scale.set(scale, scale, scale);
    }
  }

  _handleMouseClick = evt => {
    let canvas = evt.target
    let camera = this.viewer.impl.camera
    let ray = this._raycaster
    let { left, top } = canvas.getBoundingClientRect()
    let { clientX: x, clientY: y } = evt
    let mouseX = x - left
    let mouseY = y - top
    console.log(evt, canvas.getBoundingClientRect())

    const pointerVector = new THREE.Vector3()
    const pointerDir = new THREE.Vector3()

    if (camera.isPerspective) {
      pointerVector.set((mouseX / canvas.width) * 2 - 1, 1 - (mouseY / canvas.height) * 2, 0.5)
      pointerVector.unproject(camera)
      ray.set(camera.position, pointerVector.sub(camera.position).normalize())
    } else {
      pointerVector.set((mouseX / canvas.width) * 2 - 1, 1 - (mouseY / canvas.height) * 2, -1)
      pointerVector.unproject(camera)
      pointerDir.set(0, 0, -1)
      ray.set(pointerVector, pointerDir.transformDirection(camera.matrixWorld))
    }

    let objs = Object.keys(this.markerMap).reduce((acc, m) => {
      let marker = this.markerMap[m]
      let label = marker._label.mesh
      let icon = marker._icon.mesh
      // label.updateMatrixWorld();
      // icon.updateMatrixWorld();
      return [...acc, icon, label]
    }, [])
    var intersects = this._raycaster.intersectObjects(objs, true)
    if (intersects[0]) {
      this.emit('select', {
        canvasPos: { x: mouseX, y: mouseY },
        id: intersects[0].object.userData.id,
        type: intersects[0].object.userData.type
      })
    }
  }

  addMarker(id, type, label, pos, scale = 1) {
    let marker = new Marker(id, type, label, pos, scale)
    this.markerMap[id] = marker
    let rotation = this.viewer.impl.camera.rotation
    marker._marker.setRotationFromMatrix(this.viewer.impl.camera.matrix)
    marker._label.setRotation(rotation)
    marker._icon.setRotation(rotation)
    //this.viewer.impl.scene.add(marker._marker);
    this.viewer.impl.createOverlayScene('amarker' + id)
    this.viewer.impl.addOverlay('amarker' + id, marker._marker)
  }

  removeMarker(id) {
    let marker = this.markerMap[id]
    if (!marker) {
      return false
    }
    this.viewer.impl.scene.remove(marker._marker)
    delete this.markerMap[id]

    return true
  }

  removeAllMarkers() {
    let markers = Object.keys(this.markerMap)
    for (let markerId of markers) {
      let marker = this.markerMap[markerId]
      this.viewer.impl.scene.remove(marker._marker)
    }

    this.markerMap = {}

    return true
  }

  showMarker(id) {
    let hidedMarker = this._hidedMarkers[id]
    if (!hidedMarker) {
      return false
    }

    this.viewer.impl.scene.add(hidedMarker._marker)
    delete this._hidedMarkers[id]

    return true
  }

  showAllMarkers() {
    let markerIds = Object.keys(this._hidedMarkers)
    for (let markerId of markerIds) {
      let marker = this._hidedMarkers[markerId]
      this.viewer.impl.scene.add(marker._marker)
    }
    this._hidedMarkers = {}
  }

  hideMarker(id) {
    if (this._hidedMarkers[id]) {
      return true
    }

    let marker = this.markerMap[id]
    if (!marker) {
      return false
    }

    this._hidedMarkers[id] = marker
    this.viewer.impl.remove(marker._marker)

    return true
  }

  hideAllMarkers() {
    let markers = Object.keys(this.markerMap)
    for (let markerId of markers) {
      this.hideMarker(markerId)
    }
  }

  /**
   *
   * @param {string} id MarkerId
   * @param {string} newText 标签文字
   */
  setMarkerText(id, newText) {
    let marker = this.markerMap[id]
    if (!marker) return false

    return marker.setLabel(newText)
  }
}
