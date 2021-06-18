// 封装 动画/ 角色/ 多段线

import ToolKit from './Viewer.Toolkit'

let timerId = 0

class Timer {
  stopped = false
  destoried = false

  constructor(func) {
    this.id = timerId++
    this.updater = func
  }

  stop() {
    this.stopped = true
  }

  start() {
    this.stopped = false
  }

  setUpdater(func) {
    this.updater = func
  }

  update(elapsed) {
    this.updater(elapsed, this)
  }

  reuse() {
    if (this.destoried) this.destoried = false
  }

  destory() {
    if (!this.destoried) this.destoried = true
  }
}

export class AnimationLoop {
  static get ExtensionId() {
    return 'BimFish.Extison.AnimationLoop'
  }

  timers = []
  running = false
  lastTime = 0

  addTimer(func) {
    for (let i = 0; i < this.timers.length; ++i) {
      let timer = this.timers[i]
      if (timer.destoried) {
        timer.setUpdater(func)
        timer.reuse()
        return timer
      }
    }

    const newTimer = new Timer(func)
    this.timers.push(newTimer)

    return newTimer
  }

  updateTimers() {
    let now = Date.now()
    for (let i = 0; i < this.timers.length; ++i) {
      let timer = this.timers[i]
      if (!timer.stopped && !timer.destoried) timer.update(now - this.lastTime)
    }
    this.lastTime = now
    if (this.running) {
      requestAnimationFrame(this.updateTimers.bind(this))
    }
  }

  start() {
    this.running = true
    this.lastTime = Date.now()
    this.updateTimers()
  }

  stop() {
    this.running = false
  }
}

/**
 * 计算移动的方向
 * @param {THREE.Vector3} src 起始点
 * @param {THREE.Vector3} dest 目标点
 * @return {THREE.Vector3}
 */
export function getMoveDirection(src, dest) {
  return dest
    .clone()
    .sub(src)
    .normalize()
}

/**
 * 计算包围盒
 * @param {BimFish.Viewer} viewer
 * @param {number[]} dbIds
 * @param {BimFish.Model} model
 * @return {THREE.Box3} 包围盒
 */
export function getBoudingBox(viewer, dbIds, model) {
  model = model || viewer.model
  const fragIds = dbIds.reduce((acc, dbId) => {
    return acc.concat(ToolKit.getLeafFragIds(model, dbId))
  }, [])
  var fragList = model.getFragmentList()

  var fragbBox = new THREE.Box3()
  var nodebBox = new THREE.Box3()

  fragIds.forEach(function(fragId) {
    fragList.getWorldBounds(fragId, fragbBox)
    nodebBox.union(fragbBox)
  })

  return nodebBox
}

/**
 * @class 多段线
 */
export class SegmentLine3D {
  /**
   * @param {THREE.Vetor3[]} points 多段线端点
   */
  constructor(points = []) {
    /**@member {THREE.Vector3[]} */
    this.points = points
    /**@member {number[]} */
    this.segLengthArr = this._calculateSegmentsLengths()
  }

  /**
   * @private
   * @return {number} 多段线线段数量
   */
  _getSegmentsCount() {
    return this.points.length < 2 ? 0 : this.points.length - 1
  }

  /**
   * @private
   * @return {number[]} 多段线各段长度
   */
  _calculateSegmentsLengths() {
    let segCount = this._getSegmentsCount()
    let segLengthArr = []
    for (let i = 1; i <= segCount; ++i) {
      const startPoint = this.points[i - 1]
      const endPoint = this.points[i]
      const length = endPoint
        .clone()
        .sub(startPoint)
        .length()

      segLengthArr.push(length)
    }
    this._totalLength = segLengthArr.reduce((acc, x) => acc + x, 0)
    return segLengthArr
  }

  /**
   *
   * @param {THREE.Vector3} point 多段线端点
   */
  addPoint(point) {
    this.points.push(point)
    this.segLengthArr = this._calculateSegmentsLengths()
  }

  /**
   * 获取对应下标多段线端点
   * @param {number} index 多段线端点下标
   * @return {THREE.Vector3} 端点坐标
   */
  getPointAtIndex(index) {
    if (index < 0) throw 'index underflow'
    if (index > this.points.length - 1) throw 'index overflow'

    return this.points[index]
  }

  /**
   * 获取多段线第一个端点
   * @return {THREE.Vector3}
   */
  getFirstPoint() {
    return this.getPointAtIndex(0)
  }

  /**
   * 获取多段线最后一个端点
   * @return {THREE.Vector3}
   */
  getLastPoint() {
    return this.getPointAtIndex(this.points.length - 1)
  }

  /**
   * 获取多段线总长度
   * @param null
   */
  getLength() {
    return this._totalLength
  }

  /**
   *
   * @param {THREE.Vector3[]} points 多段线端点
   */
  setPoints(points) {
    this.points = points
    this.segLengthArr = this._calculateSegmentsLengths()
  }

  /**
   * @private
   * @param {number} distance 移动的距离
   * @return {number} 面对的点的序号
   */
  _getFacingPointIndexByMoveAlongDistance(distance) {
    if (distance < 0) {
      throw 'distance underflow'
    } else if (distance > this._totalLength) {
      throw 'distance overflow'
    } else {
      if (distance === this._totalLength) {
        return this.points.length - 1
      } else if (distance === 0) {
        return 0
      } else {
        let remindDistance = distance
        let i = 0
        for (; i < this.segLengthArr.length; ++i) {
          if (remindDistance - this.segLengthArr[i] <= 0) {
            break
          }
          remindDistance -= this.segLengthArr[i]
        }

        return i + 1
      }
    }
  }

  /**
   * 获取沿着多段线移动后面对的点
   * @param {number} distance 沿多段线移动的距离
   * @return {THREE.Vector3} 面对的点
   */
  getFacingPointByMoveAlongDistance(distance) {
    return this.points[this._getFacingPointIndexByMoveAlongDistance(distance)]
  }

  /**
   * 计算从起始点移动一定距离后的位置
   * @param {number} distance 移动的距离
   * @return {THREE.Vector3} 移动后的位置
   */
  getPositionByMoveAlongDisance(distance) {
    let facingPointIndex = this._getFacingPointIndexByMoveAlongDistance(distance)
    let segStartPoint = this.points[facingPointIndex - 1]
    let segEndPoint = this.points[facingPointIndex]
    let remindDistance = distance - this.points.slice(0, facingPointIndex).reduce((acc, x) => acc + x, 0)[0]
    let addtion = segEndPoint
      .clone()
      .sub(segStartPoint)
      .multiplyScalar(remindDistance / this.segLengthArr[facingPointIndex - 1])
    return segStartPoint.clone().add(addtion)
  }

  /**
   * 通过沿多段线位移距离获取当前面对的方向
   * @param {number} distance 沿多段线位移的距离
   * @return {THREE.Vector3} 当前面对的方向
   */
  getFacingNormalFromMovingAlongDistance(distance) {
    const curPointIndex = this._getFacingPointIndexByMoveAlongDistance(distance)
    if (curPointIndex === 0) {
      return this.getFirstPoint()
        .clone()
        .normalize()
    } else {
      const facingPoint = this.points[curPointIndex]
      const prevPoint = this.points[curPointIndex - 1]

      return facingPoint
        .clone()
        .sub(prevPoint)
        .normalize()
    }
  }
}

/**
 * 可执行精灵的动画效果
 * @abstract
 */
class Effect {
  /**@member {Sprite3D} 效果绑定的精灵*/
  sprite = null

  /**
   * 绑定精灵与效果
   * @param {Sprite3D} sprite 需要绑定的精灵
   */
  bindToSprite(sprite) {
    this.sprite = sprite
  }

  *effectGenerator() {
    throw 'Implements [effectGenerator] in subclasses'
  }
}

export class TranslateByDistanceEffect extends Effect {
  /**
   * @constructor
   * @param { number } speed 平移速度(秒)
   * @param {THREE.Vector3} direction 位移方向
   * @param {number} distance 距离
   */
  constructor(speed, direction, distance) {
    super()
    /**@member {number} 效果作用距离*/
    this.distance = distance
    /**@member {number} 平移速度*/
    this.speed = speed
    /**@member {number} 效果作用的时间(秒)*/
    this.effectDuration = distance / speed
    /**@member {THREE.Vector3} 平移的方向*/
    this.direction = direction
  }

  /**
   * 计算经过固定时间后所执行的动画效果
   * @param {number} elapsedTime (秒)
   */
  getStateByTime(elapsedTime) {
    if (elapsedTime === 0) {
      return {
        value: {
          translatedDistance: 0
        },
        isDone: false
      }
    } else if (elapsedTime >= this.effectDuration) {
      return {
        value: {
          translatedDistance: this.distance
        },
        isDone: true
      }
    } else {
      const translatedDistance = this.speed * elapsedTime
      return {
        value: {
          translatedDistance
        },
        isDone: false
      }
    }
  }

  *effectGenerator() {
    let self = this
    let accumulatedTime = 0
    /**@type {number} */
    let elapsedTime = yield
    while (true) {
      accumulatedTime += elapsedTime
      if (accumulatedTime >= self.effectDuration) {
        let realEffectTime = elapsedTime + self.effectDuration - accumulatedTime
        const additionVector = self.direction.clone().multiplyScalar(self.speed * realEffectTime)
        return {
          additionVector,
          additionScalar: self.speed * realEffectTime,
          applyEffect: () => {
            if (!this.sprite) return
            this.sprite.translate(additionVector.x, additionVector.y, additionVector.z)
          }
        }
      } else {
        const additionVector = self.direction.clone().multiplyScalar(self.speed * elapsedTime)
        elapsedTime = yield {
          additionVector,
          additionScalar: self.speed * elapsedTime,
          applyEffect: () => {
            if (!this.sprite) return
            this.sprite.translate(additionVector.x, additionVector.y, additionVector.z)
          }
        }
      }
    }
  }
}

export class TranslateByTimeEffect extends Effect {
  /**
   * @constructor
   * @param {number} speed 移动速度(秒)
   * @param {THREE.Vector3} direction 移动方向
   * @param {number} duration 移动持续时间
   */
  constructor(speed, direction, duration) {
    super()
    /**@member {number} 移动速度(秒)*/
    this.speed = speed
    /**@member {THREE.Vector3} 移动方向*/
    this.direction = direction
    /**@member {number} 持续时间*/
    this.effectDuration = duration
  }

  /**
   * 计算经过固定时间后所执行的动画效果
   * @param {number} elapsedTime 经过的时间
   */
  getStateByTime(elapsedTime) {
    if (elapsedTime === 0) {
      return {
        value: {
          elapsedTime,
          /**@member {function} 当前位置 THREE.Vector3 -> THREE.Vector3 */
          currentPosition: src => src,
          translatedDistance: 0
        },
        isDone: false
      }
    } else if (elapsedTime >= this.effectDuration) {
      return {
        value: {
          elapsedTime,
          /**@member {function} 当前位置 THREE.Vector3 -> THREE.Vector3 */
          currentPosition: src => src.clone().add(this.direction.clone() * this.speed * this.effectDuration),
          translatedDistance: this.speed * this.effectDuration
        },
        isDone: true
      }
    } else {
      const translatedDistance = this.speed * elapsedTime

      return {
        value: {
          elapsedTime,
          currentPosition: src => src.clone().add(this.direction() * translatedDistance),
          translatedDistance
        },
        isDone: false
      }
    }
  }

  *effectGenerator() {
    let self = this
    let accumulatedTime = 0
    /**@type {number} */
    let elapsedTime = yield
    while (true) {
      accumulatedTime += elapsedTime
      if (accumulatedTime >= self.effectDuration) {
        let realEffectTime = elapsedTime + self.effectDuration - accumulatedTime
        const additionVector = self.direction.clone().multiplyScalar(self.speed * realEffectTime)
        return {
          additionVector,
          additionScalar: self.speed * realEffectTime,
          applyEffect: () => {
            if (!this.sprite) return
            this.sprite.translate(additionVector.x, additionVector.y, additionVector.z)
          }
        }
      } else {
        const additionVector = self.direction.clone().multiplyScalar(self.speed * elapsedTime)
        elapsedTime = yield {
          additionVector,
          additionScalar: self.speed * elapsedTime,
          applyEffect: () => {
            if (!this.sprite) return
            this.sprite.translate(additionVector.x, additionVector.y, additionVector.z)
          }
        }
      }
    }
  }
}

export class RotateByDegreeEffect extends Effect {
  /**
   *
   * @param {number} degree 旋转度数
   * @param {number} rotateSpeed 旋转速度(秒)
   * @param {THREE.Vector3} center 旋转中心点
   * @param {THREE.Vector3} axis 旋转轴
   */
  constructor(degree, rotateSpeed, center, axis) {
    super()
    /**@member {number} 旋转度数*/
    this.degree = degree
    /**@member {number} 旋转速度*/
    this.rotateSpeed = rotateSpeed
    /**@member {THREE.Vector3} 旋转中心*/
    this.center = center
    /**@member {THREE.Vector3} 旋转轴*/
    this.rotateAxis = axis
    /**@member {number} 旋转持续时间*/
    this.effectDuration = degree / rotateSpeed
  }

  /**
   *
   * @param {number} elapsedTime 经过的时间
   */
  getStateByTime(elapsedTime) {
    let quaternion = new THREE.Quaternion()
    if (elapsedTime === 0) {
      quaternion.setFromAxisAngle(this.rotateAxis, 0)
      return {
        value: {
          rotatedDegree: 0,
          rotationQuaternion: quaternion,
          center: this.center,
          elapsedTime
        },
        isDone: false
      }
    } else if (elapsedTime >= this.effectDuration) {
      quaternion.setFromAxisAngle(this.rotateAxis, this.degree)
      return {
        value: {
          rotatedDegree: this.degree,
          rotationQuaternion: quaternion,
          center: this.center,
          elapsedTime
        },
        isDone: true
      }
    } else {
      const rotatedDegree = this.rotateSpeed * elapsedTime
      quaternion.setFromAxisAngle(this.rotateAxis, rotatedDegree)
      return {
        value: {
          rotatedDegree,
          rotationQuaternion: quaternion,
          center: this.center,
          elapsedTime
        },
        isDone: false
      }
    }
  }

  *effectGenerator() {
    let accumulatedTime = 0
    /**@type {number} */
    let elapsedTime = yield
    while (true) {
      accumulatedTime += elapsedTime
      if (accumulatedTime >= this.duration) {
        let realEffectTime = elapsedTime + self.effectDuration - accumulatedTime
        let quaternion = new THREE.Quaternion()
        quaternion.setFromAxisAngle(this.rotateAxis, realEffectTime * this.rotateSpeed)
        const additionDegree = this.rotateSpeed * realEffectTime
        const center = typeof this.center === 'function' ? this.center() : this.center
        return {
          additionQuaternion: quaternion,
          additionDegree,
          rotateCenter: center,
          applyEffect: () => {
            if (!this.sprite) return

            this.sprite.rotate(additionDegree, center, this.rotateAxis)
          }
        }
      } else {
        let quaternion = new THREE.Quaternion()
        quaternion.setFromAxisAngle(this.rotateAxis, elapsedTime * this.rotateSpeed)
        const additionDegree = this.rotateSpeed * elapsedTime
        const center = typeof this.center === 'function' ? this.center() : this.center
        elapsedTime = yield {
          additionQuaternion: quaternion,
          additionDegree,
          rotateCenter: center,
          applyEffect: () => {
            if (!this.sprite) return
            const center = typeof this.center === 'function' ? this.center() : this.center
            this.sprite.rotate(additionDegree, center, this.rotateAxis)
          }
        }
      }
    }
  }
}

export class RotateByTimeEffect extends Effect {
  /**
   * @constructor
   * @param {number} rotateSpeed 旋转速度
   * @param {number} duration 持续时间
   * @param {THREE.Vector3} center 旋转中心
   * @param {THREE.Vector3} axis 旋转轴
   */
  constructor(rotateSpeed, duration, center, axis) {
    super()
    /**@member {number} 旋转速度*/
    this.rotateSpeed = rotateSpeed
    /**@member {number} 旋转时间*/
    this.effectDuration = duration
    /**@member {THREE.Vector3} 旋转中心*/
    this.center = center
    /**@member {THREE.Vector3} 旋转轴*/
    this.rotateAxis = axis
  }

  /**
   *
   * @param {number} elapsedTime 经过的时间
   */
  getStateByTime(elapsedTime) {
    let quaternion = new THREE.Quaternion()
    if (elapsedTime === 0) {
      quaternion.setFromAxisAngle(this.rotateAxis, 0)
      return {
        value: {
          elapsedTime,
          rotationQuaternion: quaternion,
          center: this.center
        },
        isDone: false
      }
    } else if (elapsedTime > this.effectDuration) {
      quaternion.setFromAxisAngle(this.rotateAxis, this.effectDuration * this.rotateSpeed)
      return {
        value: {
          elapsedTime,
          rotationQuaternion: quaternion,
          center: this.center
        },
        isDone: true
      }
    } else {
      quaternion.setFromAxisAngle(this.rotateAxis, elapsedTime * this.rotateSpeed)
      return {
        value: {
          elapsedTime,
          rotationQuaternion: quaternion,
          center: this.center
        },
        isDone: true
      }
    }
  }

  *effectGenerator() {
    let accumulatedTime = 0
    /**@type {number} */
    let elapsedTime = yield
    while (true) {
      accumulatedTime += elapsedTime
      if (accumulatedTime >= elapsedTime) {
        let realEffectTime = elapsedTime + self.effectDuration - accumulatedTime
        let quaternion = new THREE.Quaternion()
        quaternion.setFromAxisAngle(this.rotateAxis, realEffectTime * this.rotateSpeed)
        const additionDegree = this.rotateSpeed * realEffectTime
        const center = typeof this.center === 'function' ? this.center() : this.center
        return {
          additionQuaternion: quaternion,
          additionDegree,
          rotateCenter: center,
          applyEffect: () => {
            if (!this.sprite) return

            this.sprite.rotate(additionDegree, center, this.rotateAxis)
          }
        }
      } else {
        let quaternion = new THREE.Quaternion()
        quaternion.setFromAxisAngle(this.rotateAxis, elapsedTime * this.rotateSpeed)
        const additionDegree = this.rotateSpeed * elapsedTime
        const center = typeof this.center === 'function' ? this.center() : this.center
        elapsedTime = yield {
          additionQuaternion: quaternion,
          additionDegree,
          rotateCenter: center,
          applyEffect: () => {
            if (!this.sprite) return
            const center = typeof this.center === 'function' ? this.center() : this.center
            this.sprite.rotate(additionDegree, center, this.rotateAxis)
          }
        }
      }
    }
  }
}

/**
 * 动画精灵
 */
export class Sprite3D {
  /**
   * @constructor
   * @param {string} name
   * @param {BimFish.Viewer} viewer
   * @param {number[]} dbIds
   * @param {BimFish.Model} model
   */
  constructor(name, viewer, dbIds, model) {
    /**@member {string}  精灵名称*/
    this.name = name
    /**@member {BimFish.Viewer} */
    this.viewer = viewer
    /**@member {number[]} */
    this.dbIds = dbIds
    /**@member {BimFish.Model} */
    this.model = model
    /**@member {THREE.Box3} 包围盒*/
    this.boudingBox = getBoudingBox(viewer, dbIds, model)
    /**@member {number[]} fragId */
    this.fragIds = this.dbIds.reduce((acc, dbId) => {
      return acc.concat(ToolKit.getLeafFragIds(model, dbId))
    }, [])
  }

  /**
   * 更新包围盒
   */
  updateBoundingBox() {
    this.boudingBox = getBoudingBox(this.viewer, this.dbIds, this.model)
  }

  /**
   * 获取精灵中心点
   * @return {THREE.Vector3}
   */
  getCenter() {
    this.updateBoundingBox()
    const minVec = this.boudingBox.min.clone()
    const maxVec = this.boudingBox.max.clone()
    return minVec.add(maxVec).divideScalar(2)
  }

  /**
   * 位移
   * @param {numner} x x轴平移方向
   * @param {number} y y轴平移方向
   * @param {number} z z轴平移方向
   */
  translate(x, y, z) {
    const offset = new THREE.Vector3(x, y, z)
    this.fragIds.forEach(fragId => {
      const fragProxy = this.viewer.impl.getFragmentProxy(this.model, fragId)
      fragProxy.getAnimTransform()
      fragProxy.position = fragProxy.position.add(offset)
      fragProxy.updateAnimTransform()
      this.model.setVisibility(fragId, true)
    })
    this.viewer.impl.invalidate(true, true, true)
  }

  /**
   *
   * @param {number} angle 旋转度数
   * @param {THREE.Vector3} center 旋转中心
   * @param {THREE.Vector3} axis 旋转轴
   */
  rotate(angle, center, axis) {
    var quaternion = new THREE.Quaternion()
    const model = this.model
    quaternion.setFromAxisAngle(axis, angle)
    this.fragIds.forEach(fragId => {
      const fragProxy = this.viewer.impl.getFragmentProxy(model, fragId)
      fragProxy.getAnimTransform()

      var position = new THREE.Vector3(
        fragProxy.position.x - center.x,
        fragProxy.position.y - center.y,
        fragProxy.position.z - center.z
      )

      position.applyQuaternion(quaternion)

      position.add(center)

      fragProxy.position = position

      fragProxy.quaternion.multiplyQuaternions(quaternion, fragProxy.quaternion)
      fragProxy.updateAnimTransform()
      this.model.setVisibility(fragId, true)
    })
    this.viewer.impl.invalidate(true, true, true)
  }
}

/**
 * 动画精灵编组
 */
export class Sprite3DGroup {
  /** @member {Sprite3D[]} */
  sprites = []

  /**
   * 添加精灵
   * @param {Sprite3D} sprite
   */
  addSprite(sprite) {
    if (this.containsSprite(sprite.name)) return
    this.sprites.push(sprite)
  }

  /**
   * 判断是否已经包含对应名称精灵
   * @param {string} name
   * @return {boolean}
   */
  containsSprite(name) {
    return this.sprites.some(s => s.name == name)
  }

  /**
   * 获取对应名称精灵
   * @param {string} name 精灵名称
   * @return {Sprite3D | null}
   */
  getSprite(name) {
    for (let i = 0; i < this.sprites.length; ++i) {
      if (this.sprites[i].name === name) return this.sprites[i]
    }

    return null
  }

  /**
   * 删除对应名称精灵
   * @param {string} name 精灵名称
   * @return {boolean} 是否删除成功
   */
  removeSprite(name) {
    if (!this.containsSprite(name)) return false

    this.sprites = this.sprites.filter(s => s.name !== name)

    return true
  }
}

/**类似Promise.all */
export class AllEffectCombiner {
  /**@type {Effect[]}  并行执行的所有effect*/
  effects = []

  /**
   * 添加effect
   * @param {Effect} effect 添加的effect
   */
  addEffect(effect) {
    this.effects.push(effect)
  }

  /**
   * 获取效果执行器
   */
  getExecutor() {
    let generators = this.effects.map(e => e.effectGenerator())
    generators.forEach(g => g.next())
    //let stateStack = [];
    return {
      /**
       *
       * @param {number} elapsedTime 执行下一步效果
       */
      next: elapsedTime => {
        let curState = generators.map(g => g.next(elapsedTime))
        if (curState.every(s => s.done)) {
          if (typeof this.onEffectDone === 'function') {
            this.onEffectDone()
          }

          return {
            done: true
          }
        } else {
          curState.forEach(s => {
            if (!s.done) {
              s.value.applyEffect()
            }
          })

          return {
            done: false
          }
        }
      }
    }
  }
}

/**类似Promise.race */
export class RaceEffectCombiner {
  /**@type {Effect[]}  并行执行的所有effect*/
  effects = []

  /**
   * 添加effect
   * @param {Effect} effect 添加的effect
   */
  addEffect(effect) {
    this.effects.push(effect)
  }

  /**
   * 获取效果执行器
   */
  getExecutor() {
    let generators = this.effects.map(e => e.effectGenerator())
    generators.forEach(g => g.next())
    //let stateStack = [];
    return {
      /**
       *
       * @param {number} elapsedTime 执行下一步效果
       */
      next: elapsedTime => {
        let curState = generators.map(g => g.next(elapsedTime))
        if (curState.some(s => s.done)) {
          if (typeof this.onEffectDone === 'function') {
            this.onEffectDone()
          }

          return {
            done: true
          }
        } else {
          curState.forEach(s => {
            if (!s.done) {
              s.value.applyEffect()
            }
          })

          return {
            done: false
          }
        }
      }
    }
  }
}

export class CompareBoxGenerator {
  _actualProgress = 0
  _planProgress = 0

  /**
   * 设置实际工作进度
   * @param {number} progress 实际工作进度
   */
  setActualProgress(progress) {
    this._actualProgress = progress
  }

  /**
   * 设置计划工作进度
   * @param {number} progress 计划工作进度
   */
  setPlanProgress(progress) {
    this._planProgress = progress
  }
}

/**
 * 通过进深获取已切割煤层区域
 * @param {SegmentLine3D} upHdSegments 上顺槽多段线
 * @param {SegmentLine3D} downHdSegments 下顺槽多段线
 * @param {number} insisionsCount 刀数
 * @param {number} perInsisionLength 每刀进深
 * @return {THREE.Vector3[]} [上顺槽起点, 上顺槽终点, 下顺槽起点, 下顺槽终点]
 *
 *
 * 下顺槽终点    上顺槽终点
 *    -            -
 *    |            |     ∧
 *    |            |     |
 *    |            |     |
 *    |            |   采煤方向
 *    -            —
 * 下顺槽起点    上顺槽起点
 */
export function getMineAreaByInsisionLength(upHdSegments, downHdSegments, insisionsCount, perInsisionLength) {
  const stepLength = insisionsCount * perInsisionLength
  const upStartPoint = upHdSegments.getFirstPoint()
  const downStartPoint = downHdSegments.getFirstPoint()
  const upEndPoint = upHdSegments.getPositionByMoveAlongDisance(stepLength)
  const downEndPoint = downHdSegments.getPositionByMoveAlongDisance(stepLength)

  return [
    new THREE.Vector3(upStartPoint.x, upStartPoint.y, 0),
    new THREE.Vector3(upEndPoint.x, upEndPoint.y, 0),
    new THREE.Vector3(downStartPoint.x, downStartPoint.y, 0),
    new THREE.Vector3(downEndPoint.x, downEndPoint.y, 0)
  ]
}

/**
 * 通过进深获取已切割煤层区域
 * @param {SegmentLine3D} upHdSegments 上顺槽多段线
 * @param {SegmentLine3D} downHdSegments 下顺槽多段线
 * @param {SegmentLine3D} reaperSegments 割煤机多段线
 * @param {number} insisionsCount 刀数
 * @param {number} perInsisionLength 每刀进深
 * @param {number} additionLength 额外采掘长度
 * @return {THREE.Vector3[]} [上顺槽起点, 上顺槽终点, 下顺槽起点, 下顺槽终点, 额外开采部分顺槽起点， 额外开采部分顺槽终点， 额外开采部分采煤机起点， 额外开采部分采煤机终点]
 *
 * 上顺槽、下顺槽同 getMineAreaByInsisionLength
 *
 *  起始槽终点┌---┐采煤机终点  ┐
 * 起始槽起点 |---┘采煤机起点  |     ∧
 *          |               |     |
 *          |               |   采煤方向
 *          -               —
 *
 */
export function getMineAreaAndAdditionAreaByInsisionLength(
  upHdSegments,
  downHdSegments,
  reaperSegments,
  insisionsCount,
  perInsisionLength,
  additionLength
) {
  const stepLength = insisionsCount * perInsisionLength
  const [upStartPoint, upEndPoint, downStartPoint, downEndPoint] = getMineAreaByInsisionLength(
    upHdSegments,
    downHdSegments,
    insisionsCount,
    perInsisionLength
  )
  let additionHdStart, // 额外开采顺槽起始点
    additionHdSegment // 额外开采顺槽多段线
  if (insisionsCount % 2 === 0) {
    additionHdStart = downEndPoint
    additionHdSegment = downHdSegments
  } else {
    additionHdStart = upEndPoint
    additionHdSegment = upHdSegments
  }

  const reaperCenterPosition = reaperSegments.getPositionByMoveAlongDisance(stepLength)
  const reaperFacingNormal = reaperSegments.getFacingNormalFromMovingAlongDistance(stepLength)
  const curHdFacingNormal = additionHdSegment.getFacingNormalFromMovingAlongDistance(stepLength)
  // 额外开采顺槽终点
  const additionHdEnd = additionHdStart.clone().add(curHdFacingNormal.multiplyScalar(perInsisionLength))
  // 额外开采采煤机起点
  const additionReaperStart = additionHdStart.clone().add(
    reaperCenterPosition
      .sub(additionHdStart)
      .normalize()
      .multiplyScalar(additionLength)
  )
  // 额外开采采煤机终点
  const additionReaperEnd = additionReaperStart.clone().add(reaperFacingNormal.multiplyScalar(perInsisionLength))

  return [
    upStartPoint,
    upEndPoint,
    downStartPoint,
    downEndPoint,
    additionHdStart,
    additionHdEnd,
    additionReaperStart,
    additionReaperEnd
  ]
}

const isPointInPolygon = `
bool isSameSide(vec3 a, vec3 b, vec3 c, vec3 p)
{
    vec3 ap = p - a;
    vec3 ab = b - a;
    vec3 ac = c - a;
    return dot(cross(ab, ac), cross(ab, ap)) >= 0.0;
}

bool pointInTriangle(vec3 a, vec3 b, vec3 c, vec3 p)
{
    return isSameSide(a, b, c, p) &&
        isSameSide(b, c, a, p) &&
        isSameSide(c, a, b, p);
}

bool isPointInPolygon(vec3 point, mat3 polygon) {
    vec3 p = vec3(point.xy, 0.0);
    vec3 polygonPoints[4];

    polygonPoints[0] = vec3(polygon[0][0],polygon[1][0], 0.0);
    polygonPoints[1] = vec3(polygon[2][0],polygon[0][1], 0.0);
    polygonPoints[2] = vec3(polygon[1][1],polygon[2][1], 0.0);
    polygonPoints[3] = vec3(polygon[0][2],polygon[1][2], 0.0);

    return pointInTriangle(
        polygonPoints[0],
        polygonPoints[1],
        polygonPoints[2],
        p
    ) ||
    pointInTriangle(
        polygonPoints[0],
        polygonPoints[2],
        polygonPoints[3],
        p
    ) ||
    false;
}
`

export const coalCompareMatVertexShader = `

uniform vec3 u_diffuse;
uniform float u_opacity;
uniform mat3 u_unionPloygen;
uniform mat3 u_differencePolygon;
uniform float u_isAhead;
uniform vec3 u_emissive;
uniform float u_started;
uniform sampler2D baseTexture;

varying vec3 vLightFront;
varying vec2 vUv;
varying vec4 vVertexColor;
varying float v_inDiffArea;
varying float v_isAhead;
varying float v_isInDifference;
varying float v_isInUnion;

#define kPI 3.14159265358979;

${isPointInPolygon}

void main() {
    vUv = uv;
    vLightFront = vec3(0.5, -0.2, -0.06);
    vec3 N = normalize(normalMatrix * normal);

    // Normalized light direction
    vec3 L = normalize(vLightFront);

    // Dot product of the normal product and negative light direction vector
    float lambertTerm = dot(N, -L);
    // Calculating the diffuse color based on the Lambertian reflection model
    vec3 Id = u_diffuse * vLightFront * lambertTerm;
    vVertexColor = vec4(Id, u_opacity);

    v_isInDifference = 0.0;
    v_isInUnion = 0.0;
    vec4 tmp = modelMatrix * vec4(position, 1.0);

    if (u_started > 0.0) {
        if(u_differencePolygon[2][2] > 0.0 && isPointInPolygon(tmp.xyz, u_differencePolygon)) {
            v_isInDifference = 1.0;
            v_isInUnion = 0.0;
        } else if (isPointInPolygon(tmp.xyz, u_unionPloygen)) {
            v_isInDifference = 0.0;
            v_isInUnion = 1.0;

        }
    }

    v_isAhead = u_isAhead;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

export const coalCompareMatFragmentShader = `
uniform vec3 u_diffuse;
uniform float u_opacity;
varying vec4 vVertexColor;
varying float v_isAhead;
varying vec2 vUv;
varying float v_isInDifference;
varying float v_isInUnion;
uniform sampler2D baseTexture;

void main() {
    vec4 baseColor = texture2D( baseTexture, vUv );
    baseColor.a = u_opacity;
    gl_FragColor = baseColor;
    float x =mix(baseColor.r,vVertexColor.r,u_opacity);
    float y =mix(baseColor.g,vVertexColor.g,u_opacity);
    float z =mix(baseColor.b,vVertexColor.b,u_opacity);
    if(v_isInUnion > 0.0){
        gl_FragColor = vec4(x, y, z, u_opacity);
    } else if (v_isInDifference > 0.0){
        if (v_isAhead > 0.0) {
            float aheadY = mix(y, 1.0, u_opacity);
            gl_FragColor = vec4(0.0, 1.0 ,0.0, 1.0);
        } else {
            float behindX = mix(x, 1.0, u_opacity);
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    } else {
        gl_FragColor = vec4(x,y,z,1.0);
    }
}
`

const stateMatVertexShader = `

uniform vec3 u_diffuse;
uniform float u_opacity;
uniform mat3 u_dailyPart;
uniform mat3 u_additionPart;
uniform vec3 u_emissive;
uniform sampler2D baseTexture;
uniform float u_started;

varying vec3 vLightFront;
varying vec2 vUv;
varying vec4 vVertexColor;
varying float v_inCollectedArea;


#define kPI 3.14159265358979;

${isPointInPolygon}

void main() {
    vUv = uv;
    vLightFront = vec3(0.5, -0.2, -0.06);
    vec3 N = normalize(normalMatrix * normal);

    // Normalized light direction
    vec3 L = normalize(vLightFront);

    // Dot product of the normal product and negative light direction vector
    float lambertTerm = dot(N, -L);
    // Calculating the diffuse color based on the Lambertian reflection model
    vec3 Id = u_diffuse * vLightFront * lambertTerm;
    vVertexColor = vec4(Id, u_opacity);
    vec4 tmp = modelMatrix * vec4(position, 1.0);

    if((u_dailyPart[2][2] > 0.0 && isPointInPolygon(tmp.xyz, u_dailyPart)) || (u_additionPart[2][2] > 0.0 && isPointInPolygon(position, u_additionPart))) {
        v_inCollectedArea = 1.0;
    } else {
        v_inCollectedArea = 0.0;
    }


    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const stateMatFragShader = `
uniform vec3 u_diffuse;
uniform float u_opacity;
uniform float u_started;
uniform sampler2D baseTexture;

varying vec4 vVertexColor;
varying vec2 vUv;
varying float v_inCollectedArea;

void main() {
    vec4 baseColor = texture2D( baseTexture, vUv );
    baseColor.a = u_opacity;
    gl_FragColor = baseColor;
    float x =mix(baseColor.r, vVertexColor.r, u_opacity);
    float y =mix(baseColor.g, vVertexColor.g, u_opacity);
    float z =mix(baseColor.b, vVertexColor.b, u_opacity);
    if(v_inCollectedArea > 0.0){
        gl_FragColor = vec4(x, y, z, u_opacity);
    } else {
        gl_FragColor = vec4(x, y, z, 1.0);
    }
}
`

var lavaTexture = new THREE.ImageUtils.loadTexture('../../assets/img/meiceng.png')
lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping

/**
 * @class
 */
// 进度模拟
export class CoelCompareShaderMatManager {
  /**
   *
   * @param {SegmentLine3D} upHdSegments 上顺槽多段线
   * @param {SegmentLine3D} downHdSegments 下顺槽多段线
   */
  constructor(upHdSegments, downHdSegments) {
    this.upHdSegments = upHdSegments
    this.downHdSegments = downHdSegments

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { type: 't', value: lavaTexture },
        u_isAhead: { type: 'f', value: 1 },
        u_started: { type: 'f', value: 0 },
        u_unionPloygen: { type: 'm3', value: new THREE.Matrix3() },
        u_differencePolygon: { type: 'm3', value: new THREE.Matrix3() },
        u_emissive: { type: 'v3', value: new THREE.Vector3(0.25 / 8, 0.25 / 8, 0.25 / 8) },
        u_diffuse: { type: 'v3', value: new THREE.Vector3(0.5, 0.5, 0.5) },
        u_opacity: { type: 'f', value: 0.0 }
      },
      vertexShader: coalCompareMatVertexShader,
      fragmentShader: coalCompareMatFragmentShader,
      transparent: true,
      depthTest: false
    })
  }

  getMaterial() {
    return this.mat
  }

  /**
   * 更新对比模式材质显示
   * @param {number} actualLength 实际挖掘距离
   * @param {number} planLength 计划采掘距离
   */
  // 对比
  updateCompareModeMaterialWith(actualLength, planLength) {
    ;(this.mat.uniforms.u_started = { type: 'f', value: planLength || actualLength }),
      (this.mat.uniforms.u_isAhead = { type: 'f', value: actualLength > planLength ? 1 : 0 })
    if (actualLength > planLength) [actualLength, planLength] = [planLength, actualLength]
    const [pus, pue, pds, pde] = getMineAreaByInsisionLength(this.upHdSegments, this.downHdSegments, 1, actualLength)
    const [aus, aue, ads, ade] = getMineAreaByInsisionLength(this.upHdSegments, this.downHdSegments, 1, planLength)
    this.mat.uniforms.u_unionPloygen = {
      type: 'm3',
      value: new THREE.Matrix3().set(pus.x, pus.y, pue.x, pue.y, pde.x, pde.y, pds.x, pds.y, 0)
    }
    this.mat.uniforms.u_differencePolygon = {
      type: 'm3',
      value: new THREE.Matrix3().set(pue.x, pue.y, aue.x, aue.y, ade.x, ade.y, pde.x, pde.y, 1)
    }
    this.mat.needsUpdate = true

    return [pus, pue, pds, pde, aus, aue, ads, ade]
  }

  /**
   * 更新材质为当前采掘进度显示
   * @param {number} curLength 采掘距离
   */
  // 不对比
  updateNomalModeMaterialWith(curLength) {
    this.mat.uniforms.u_started = { type: 'f', value: curLength }
    const [pus, pue, pds, pde] = getMineAreaByInsisionLength(this.upHdSegments, this.downHdSegments, 1, curLength)
    this.mat.uniforms.u_unionPloygen = {
      type: 'm3',
      value: new THREE.Matrix3().set(pus.x, pus.y, pue.x, pue.y, pde.x, pde.y, pds.x, pds.y, 0)
    }
    this.mat.uniforms.u_differencePolygon = { type: 'm3', value: new THREE.Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0) }
    this.mat.needsUpdate = true
  }
}

// 设备模拟
export class CoelStateShaderMatManager {
  /**
   *
   * @param {SegmentLine3D} upHdSegments 上顺槽多段线
   * @param {SegmentLine3D} downHdSegments 下顺槽多段线
   * @param {SegmentLine3D} diggerSegments 采煤机多段线
   */
  constructor(upHdSegments, downHdSegments, diggerSegments) {
    this.upHdSegments = upHdSegments
    this.downHdSegments = downHdSegments
    this.diggerSegments = diggerSegments

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { type: 't', value: lavaTexture },
        u_additionPart: { type: 'm3', value: new THREE.Matrix3() },
        u_dailyPart: { type: 'm3', value: new THREE.Matrix3() },
        u_emissive: { type: 'v3', value: new THREE.Vector3(0.25 / 8, 0.25 / 8, 0.25 / 8) },
        u_diffuse: { type: 'v3', value: new THREE.Vector3(0.5, 0.5, 0.5) },
        u_opacity: { type: 'f', value: 0.2 }
      },
      vertexShader: stateMatVertexShader,
      fragmentShader: stateMatFragShader,
      transparent: true
    })
  }

  /**
   * 更新材质显示
   * @param {number} insisionsCount 采掘刀数
   * @param {number} lengthPerKnife 采掘机每刀进深
   * @param {number} additionLength 采掘机沿着轨道移动的长度
   */
  updateMaterialWith(insisionsCount, lengthPerKnife, additionLength) {
    const [ups, upe, downs, downe, ahds, ahde, ads, ade] = getMineAreaAndAdditionAreaByInsisionLength(
      this.upHdSegments,
      this.downHdSegments,
      this.diggerSegments,
      insisionsCount,
      lengthPerKnife,
      additionLength
    )
    this.mat.uniforms.u_additionPart = {
      type: 'm3',
      value: new THREE.Matrix3().set(
        ahds.x,
        ahds.y,
        ahde.x,
        ahde.y,
        ade.x,
        ade.y,
        ads.x,
        ads.y,
        additionLength > 0 ? 1 : 0
      )
    }
    this.mat.uniforms.u_dailyPart = {
      type: 'm3',
      value: new THREE.Matrix3().set(
        ups.x,
        ups.y,
        upe.x,
        upe.y,
        downe.x,
        downe.y,
        downs.x,
        downs.y,
        insisionsCount * lengthPerKnife > 0 ? 1 : 0
      )
    }
    this.mat.needsUpdate = true
  }

  getMaterial() {
    return this.mat
  }
}

export class VectorAccumulator {
  constructor() {
    this.accums = {}
  }

  /**
   * 累加
   * @param {string} name 累加的名称
   * @param {THREE.Vector3} vec 累加的向量
   */
  add(name, vec) {
    if (!this.accums[name]) this.accums[name] = new THREE.Vector3()
    this.accums.add(vec)
  }

  /**
   * 获取累加值
   * @param {THREE.Vector3} name 获取累加值的名称
   * @return {THREE.Vector3} 累加值
   */
  getAccumulation(name) {
    if (!this.accums[name]) return new THREE.Vector3()
    else return this.accums[name]
  }

  /**
   * 清空指定的累加值
   * @param {string} name 清空累加值，不传此参数清空所有
   */
  clearAccumulation(name = '') {
    if (!name) this.accums = {}
    else delete this.accums[name]
  }
}
