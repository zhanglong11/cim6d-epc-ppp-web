/* 
图形主要的工具类

函数索引

gnd01-guid 获取一个随机guid
gnd02-mobile 获取用户的平台
gnd03-loadDocument 载入urn
gnd04-getViewableItems
gnd05-createButton ui-创建一个按钮
gnd06-createControlGroup 创建一个controlgroup
gnd07-getLeafNodes 获取叶子节点
gnd08-getFragIds 获取fragid
gnd09-getLeafFragIds 获取叶子fragid
gnd10-getWorldBoundingBox 获取世界范围的bounding
gnd11-getProperties 根据dbid获取属性
gnd12-getProperty 根据dbid获取属性
gnd13-getPropertieObj 
gnd14-getPropertyList(viewer, dbIds, model = null) 根据dbid列表获取属性列表
gnd15-getBulkPropertiesAsync (model, dbIds, propFilter) 同步的方式获取属性
gnd16-mapComponentsByProp (model, propFilter, components, defaultProp) 属性和构件的mapping
gnd17-runTaskOnDataTree(root, taskFunc) 
gnd18-drawBox (viewer, min, max, material, overlayId) 绘制box
gnd19-setMaterial(model, dbId, material) 设置材质
gnd20-setMaterialById(model, dbId, materialId) 设置材质同上
gnd21-buildModelTree (model, createNodeFunc = null) 构件模型树
gnd22-executeTaskOnModelTree (model, task) 
gnd23-hide (viewer, dbIds = [], model = null) 隐藏构件
gnd24-show (viewer, dbIds = [], model = null) 显示构件
gnd25-isolateFull (viewer, dbIds = [], model = null) 根据dbid隔离
gnd26-rotateFragments (viewer, fragIds, axis, angle, center, model = null) 旋转
gnd27-restoreStateWithPivot (viewer, state, filter = null, immediate = false) 恢复state
gnd28-getComponentsByParentName (name, model) 获取components 根据 parentname
gnd29-buildComponentGeometry (viewer, model, dbId, faceFilter) Creates a standard THREE.Mesh out of a Viewer
gnd30-buildComponentMesh (viewer, model, dbId, faceFilter, material) Creates a standard THREE.Mesh out of a Viewer
gnd31-selectiveExplode (viewer, scale, excludedFragIds, model = null)  
gnd32-transparentByDbId (dbIds, model, newMaterial) 通过dbid透明构件
gnd33-getAllModelDbId (viewer) 获取所有的dbid
gnd34-hideAll(viewer) 隐藏所有构件
gnd35-getExternalIdMapping (model) 获取guidmapping - 单模
gnd36-getGuidMappingForMul(viewer) 获取guidmapping - 多模 - 按照 modelid-dbid 字符串方式返回
gnd37-getGuidMappingForMul2(viewer) 获取guidmapping - 多模 - 按照 {model:dbidarry} 对象方式返回
gnd38-setThemingColor(viewer, guidArray, color, guidMapping) 为构件设置颜色
gnd39-clearThemingColors(viewer) 清除构件上的颜色
gnd40-clearThemingColorsByGuids(viewer, guidArray, guidMapping) 清除构件的颜色
gnd41-showParts(viewer, guidArray, guidMapping) 通过guid显示构件
gnd42-selectByGuids(viewer, guidArray, guidMapping) 通过guid选择构件
gnd43-hideByGuids(viewer, guidArray, guidMapping)  通过guid隐藏构件
gnd44-isolateByGuids(viewer, guidArray, guidMapping) 通过guid隔离
gnd45-fitViewByGUID(viewer, guid, guidMapping) 根据guid定位到模型
gnd46-getPropertiesByGUID(guid) 根据guid获取属性
gnd47-search (viewer, model, text, attributeNames) 搜索
gnd48-searchForMul(viewer, text, attributeNames) 多模搜索
gnd49-getTreeChildrenIds(model, nodeId) 获取所有子节点数据
gnd50-getPropertieList(model, dbId)  获取所有子节点数据//buildModelTree
gnd51-toArray(obj) key value 专程拜访数组
gnd52-updatemodelMaterial (model,guidArray,material) 更新模型材质
gnd53-getGuidMappingByGuidForSingle(viewer,guidArray) 获取相关guid和dbid信息
gnd54-setMaterialByColor(viewer, fragid, color, matid ) 改变构件的材质颜色
gnd55-getBoundingBoxByPos(positions) 根据传入的点组, 获取boundingBox
*/

const THREE = window.THREE
const BimFish = window.BimFish

export default class Toolkit {
  ///////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////
  static guid(format = 'xxxxxxxxxxxx') {
    var d = new Date().getTime()

    var guid = format.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16)
    })

    return guid
  }

  /////////////////////////////////////////////
  //mobile detection
  //
  /////////////////////////////////////////////
  static get mobile() {
    return {
      getUserAgent: function() {
        return navigator.userAgent
      },
      isAndroid: function() {
        return this.getUserAgent().match(/Android/i)
      },
      isBlackBerry: function() {
        return this.getUserAgent().match(/BlackBerry/i)
      },
      isIOS: function() {
        return this.getUserAgent().match(/iPhone|iPad|iPod/i)
      },
      isOpera: function() {
        return this.getUserAgent().match(/Opera Mini/i)
      },
      isWindows: function() {
        return this.isWindowsDesktop() || this.isWindowsMobile()
      },
      isWindowsMobile: function() {
        return this.getUserAgent().match(/IEMobile/i)
      },
      isWindowsDesktop: function() {
        return this.getUserAgent().match(/WPDesktop/i)
      },
      isAny: function() {
        return this.isAndroid() || this.isBlackBerry() || this.isIOS() || this.isWindowsMobile()
      }
    }
  }

  /////////////////////////////////////////////////////////
  // Load a document from URN
  //
  /////////////////////////////////////////////////////////
  static loadDocument(urn) {
    return new Promise((resolve, reject) => {
      const paramUrn = !urn.startsWith('urn:') ? 'urn:' + urn : urn

      BimFish.Viewing.Document.load(
        paramUrn,
        doc => {
          resolve(doc)
        },
        error => {
          reject(error)
        }
      )
    })
  }

  /////////////////////////////////////////////////////////
  // Return viewables
  //
  /////////////////////////////////////////////////////////
  static getViewableItems(doc, roles = ['3d', '2d']) {
    const rootItem = doc.getRootItem()

    let items = []

    const roleArray = roles ? (Array.isArray(roles) ? roles : [roles]) : []

    roleArray.forEach(role => {
      items = [
        ...items,
        ...BimFish.Viewing.Document.getSubItemsWithProperties(
          rootItem,
          {
            type: 'geometry',
            role
          },
          true
        )
      ]
    })

    return items
  }

  /////////////////////////////////////////////////////////
  // Toolbar button
  //
  /////////////////////////////////////////////////////////
  static createButton(id, className, tooltip, handler) {
    var button = new BimFish.Viewing.UI.Button(id)

    button.icon.style.fontSize = '24px'

    button.icon.className = className

    button.setToolTip(tooltip)

    button.onClick = handler

    return button
  }

  /////////////////////////////////////////////////////////
  // Control group
  //
  /////////////////////////////////////////////////////////
  static createControlGroup(viewer, ctrlGroupName) {
    var viewerToolbar = viewer.getToolbar(true)

    if (viewerToolbar) {
      var ctrlGroup = new BimFish.Viewing.UI.ControlGroup(ctrlGroupName)

      viewerToolbar.addControl(ctrlGroup)

      return ctrlGroup
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static getLeafNodes(model, dbIds) {
    return new Promise((resolve, reject) => {
      try {
        const instanceTree = model.getData().instanceTree || model.getFragmentMap()

        dbIds = dbIds || instanceTree.getRootId()

        const dbIdArray = Array.isArray(dbIds) ? dbIds : [dbIds]

        const leafIds = []

        const getLeafNodeIdsRec = id => {
          let childCount = 0

          instanceTree.enumNodeChildren(id, childId => {
            getLeafNodeIdsRec(childId)
            ++childCount
          })

          if (childCount === 0) {
            leafIds.push(id)
          }
        }

        dbIdArray.forEach(dbId => {
          getLeafNodeIdsRec(dbId)
        })

        return resolve(leafIds)
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////
  // get node fragIds
  //
  /////////////////////////////////////////////////////////
  static getFragIds(model, dbIds) {
    return new Promise(async (resolve, reject) => {
      try {
        const it = model.getData().instanceTree

        dbIds = dbIds || it.getRootId()

        const dbIdArray = Array.isArray(dbIds) ? dbIds : [dbIds]

        const leafIds = it ? await Toolkit.getLeafNodes(model, dbIdArray) : dbIdArray

        let fragIds = []

        for (var i = 0; i < leafIds.length; ++i) {
          if (it) {
            it.enumNodeFragments(leafIds[i], fragId => {
              fragIds.push(fragId)
            })
          } else {
            const leafFragIds = Toolkit.getLeafFragIds(model, leafIds[i])

            fragIds = [...fragIds, ...leafFragIds]
          }
        }

        return resolve(fragIds)
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////
  // get leaf node fragIds
  //
  /////////////////////////////////////////////////////////
  static getLeafFragIds(model, leafId) {
    if (model.getData().instanceTree) {
      const it = model.getData().instanceTree

      const fragIds = []

      it.enumNodeFragments(leafId, fragId => {
        fragIds.push(fragId)
      })

      return fragIds
    } else {
      const fragments = model.getData().fragments

      const fragIds = fragments.dbId2fragId[leafId]

      return !Array.isArray(fragIds) ? [fragIds] : fragIds
    }
  }

  /////////////////////////////////////////////////////////
  // Node bounding box
  //
  /////////////////////////////////////////////////////////
  static getWorldBoundingBox(model, dbId) {
    return new Promise(async (resolve, reject) => {
      try {
        var fragIds = await Toolkit.getFragIds(model, dbId)

        if (!fragIds.length) {
          return reject('No geometry, invalid dbId?')
        }

        var fragList = model.getFragmentList()

        var fragbBox = new THREE.Box3()
        var nodebBox = new THREE.Box3()

        fragIds.forEach(function(fragId) {
          fragList.getWorldBounds(fragId, fragbBox)
          nodebBox.union(fragbBox)
        })

        return resolve(nodebBox)
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////
  // Gets properties from component
  //
  /////////////////////////////////////////////////////////
  static getProperties(model, dbId, requestedProps = null) {
    return new Promise((resolve, reject) => {
      try {
        const dbIdInt = parseInt(dbId)

        if (isNaN(dbIdInt)) {
          return reject(dbId + ' is not a valid integer')
        }

        if (requestedProps) {
          const propTasks = requestedProps.map(displayName => {
            return Toolkit.getProperty(model, dbIdInt, displayName, 'Not Available')
          })

          Promise.all(propTasks).then(properties => {
            resolve(properties)
          })
        } else {
          model.getProperties(dbIdInt, result => {
            if (result.properties) {
              return resolve(result.properties)
            }

            return reject('No Properties')
          })
        }
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static getProperty(model, dbId, displayName, defaultValue) {
    return new Promise((resolve, reject) => {
      try {
        model.getProperties(dbId, result => {
          if (result.properties) {
            result.properties.forEach(prop => {
              prop.dbId = dbId

              if (typeof displayName === 'function') {
                if (displayName(prop.displayName)) {
                  resolve(prop)
                }
              } else if (displayName === prop.displayName) {
                resolve(prop)
              }
            })

            if (defaultValue) {
              return resolve({
                displayValue: defaultValue,
                displayName,
                dbId
              })
            }

            reject(new Error('Not Found'))
          } else {
            reject(new Error('Error getting properties'))
          }
        })
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  // 获取peopertie对象包含guid和name
  static getPropertieObj(model, dbId) {
    return new Promise((resolve, reject) => {
      try {
        model.getProperties(dbId, result => {
          resolve(result)
        })
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////
  // Gets all existing properties from component  dbIds
  //
  /////////////////////////////////////////////////////////
  static getPropertyList(viewer, dbIds, model = null) {
    return new Promise(async (resolve, reject) => {
      try {
        model = model || viewer.activeModel || viewer.model

        var propertyTasks = dbIds.map(dbId => {
          return Toolkit.getProperties(model, dbId)
        })

        var propertyResults = await Promise.all(propertyTasks)

        var properties = []

        propertyResults.forEach(propertyResult => {
          propertyResult.forEach(prop => {
            if (properties.indexOf(prop.displayName) < 0) {
              properties.push(prop.displayName)
            }
          })
        })

        return resolve(properties.sort())
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static getBulkPropertiesAsync(model, dbIds, propFilter) {
    return new Promise(async (resolve, reject) => {
      if (typeof propFilter === 'function') {
        const propTasks = dbIds.map(dbId => {
          return this.getProperty(model, dbId, propFilter, 'Not Found')
        })

        const propRes = await Promise.all(propTasks)

        const filteredRes = propRes.filter(res => {
          return res.displayValue !== 'Not Found'
        })

        resolve(
          filteredRes.map(res => {
            return {
              properties: [res],
              dbId: res.dbId
            }
          })
        )
      } else {
        const propFilterArray = Array.isArray(propFilter) ? propFilter : [propFilter]

        model.getBulkProperties(
          dbIds,
          propFilterArray,
          result => {
            resolve(result)
          },
          error => {
            reject(error)
          }
        )
      }
    })
  }

  /////////////////////////////////////////////////////////
  // Maps components by property
  //
  /////////////////////////////////////////////////////////
  static mapComponentsByProp(model, propFilter, components, defaultProp) {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await Toolkit.getBulkPropertiesAsync(model, components, propFilter)

        const propertyResults = results.map(result => {
          const prop = result.properties[0]

          return Object.assign({}, prop, {
            dbId: result.dbId
          })
        })

        var componentsMap = {}

        propertyResults.forEach(result => {
          var value = result.displayValue

          if (typeof value === 'string') {
            value = value.split(':')[0]
          }

          if (!componentsMap[value]) {
            componentsMap[value] = []
          }

          componentsMap[value].push(result.dbId)
        })

        return resolve(componentsMap)
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  /////////////////////////////////////////////////////////////
  // Runs recursively the argument task on each node
  // of the data tree
  //
  /////////////////////////////////////////////////////////////
  static runTaskOnDataTree(root, taskFunc) {
    var tasks = []

    var runTaskOnDataTreeRec = (node, parent = null) => {
      if (node.children) {
        node.children.forEach(childNode => {
          runTaskOnDataTreeRec(childNode, node)
        })
      }

      var task = taskFunc(node, parent)

      tasks.push(task)
    }

    runTaskOnDataTreeRec(root)

    return Promise.all(tasks)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static drawBox(viewer, min, max, material, overlayId) {
    const geometry = new THREE.Geometry()

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))
    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))
    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))
    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))
    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))

    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))

    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))

    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))

    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))

    const lines = new THREE.Line(geometry, material, THREE.LinePieces)

    viewer.impl.addOverlay(overlayId, lines)

    viewer.impl.invalidate(true, true, true)

    return lines
  }

  /////////////////////////////////////////////////////////
  // Set component material
  //
  /////////////////////////////////////////////////////////
  static async setMaterial(model, dbId, material) {
    const fragIds = await Toolkit.getFragIds(model, dbId)

    const fragList = model.getFragmentList()

    fragIds.forEach(fragId => {
      fragList.setMaterial(fragId, material)
    })
  }

  static async setMaterialById(model, dbId, materialId) {
    const fragIds = await Toolkit.getFragIds(model, dbId)

    const fragList = model.getFragmentList()

    fragIds.forEach(fragId => {
      fragList.setMaterialById(fragId, materialId)
    })
  }

  /////////////////////////////////////////////////////////
  // Recursively builds the model tree
  //
  /////////////////////////////////////////////////////////
  static buildModelTree(model, createNodeFunc = null) {
    //builds model tree recursively
    function _buildModelTreeRec(node) {
      instanceTree.enumNodeChildren(node.dbId, function(childId) {
        var childNode = null

        if (createNodeFunc) {
          childNode = createNodeFunc(childId)
        } else {
          node.children = node.children || []

          childNode = {
            dbId: childId,
            name: instanceTree.getNodeName(childId)
          }

          node.children.push(childNode)
        }

        _buildModelTreeRec(childNode)
      })
    }

    //get model instance tree and root component
    var instanceTree = model.getData().instanceTree

    var rootId = instanceTree.getRootId()

    var rootNode = {
      dbId: rootId,
      name: instanceTree.getNodeName(rootId)
    }

    _buildModelTreeRec(rootNode)

    return rootNode
  }

  /////////////////////////////////////////////////////////
  // Recursively execute task on model tree
  //
  /////////////////////////////////////////////////////////
  static executeTaskOnModelTree(model, task) {
    const taskResults = []

    function executeTaskOnModelTreeRec(dbId) {
      instanceTree.enumNodeChildren(dbId, function(childId) {
        taskResults.push(task(model, childId))

        executeTaskOnModelTreeRec(childId)
      })
    }

    //get model instance tree and root component
    const instanceTree = model.getData().instanceTree

    const rootId = instanceTree.getRootId()

    executeTaskOnModelTreeRec(rootId)

    return taskResults
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static hide(viewer, dbIds = [], model = null) {
    try {
      model = model || viewer.activeModel || viewer.model

      viewer.hide(dbIds)

      const targetIds = Array.isArray(dbIds) ? dbIds : [dbIds]

      const tasks = targetIds.map(dbId => {
        return new Promise(resolve => {
          viewer.impl.visibilityManager.setNodeOff(dbId, true)

          resolve()
        })
      })

      return Promise.all(tasks)
    } catch (ex) {
      return Promise.reject(ex)
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static show(viewer, dbIds = [], model = null) {
    try {
      model = model || viewer.activeModel || viewer.model

      viewer.show(dbIds)

      const targetIds = Array.isArray(dbIds) ? dbIds : [dbIds]

      targetIds.forEach(dbId => {
        viewer.impl.visibilityManager.setNodeOff(dbId, false)
      })

      return Promise.resolve()
    } catch (ex) {
      return Promise.reject(ex)
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static async isolateFull(viewer, dbIds = [], model = null) {
    try {
      model = model || viewer.activeModel || viewer.model

      const vizMng = viewer.impl.visibilityManager

      vizMng.isolate(dbIds, model)

      const targetIds = Array.isArray(dbIds) ? dbIds : [dbIds]

      const targetLeafIds = await Toolkit.getLeafNodes(model, targetIds)

      const leafIds = await Toolkit.getLeafNodes(model)

      const leafTasks = leafIds.map(dbId => {
        return new Promise(resolveLeaf => {
          const show = !targetLeafIds.length || targetLeafIds.indexOf(dbId) > -1

          vizMng.setNodeOff(dbId, !show, model)

          resolveLeaf()
        })
      })

      return Promise.all(leafTasks)
    } catch (ex) {
      return Promise.reject(ex)
    }
  }

  ///////////////////////////////////////////////////////////////////
  // Rotate selected fragments
  //
  ///////////////////////////////////////////////////////////////////
  static rotateFragments(viewer, fragIds, axis, angle, center, model = null) {
    var quaternion = new THREE.Quaternion()

    quaternion.setFromAxisAngle(axis, angle)

    model = model || viewer.activeModel || viewer.model

    fragIds.forEach(fragId => {
      var fragProxy = viewer.impl.getFragmentProxy(model, fragId)

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
    })
  }

  /////////////////////////////////////////////////////////
  // A fix for viewer.restoreState
  // that also restores pivotPoint
  //
  /////////////////////////////////////////////////////////
  static restoreStateWithPivot(viewer, state, filter = null, immediate = false) {
    const onStateRestored = () => {
      viewer.removeEventListener(BimFish.Viewing.VIEWER_STATE_RESTORED_EVENT, onStateRestored)

      const pivot = state.viewport.pivotPoint

      setTimeout(
        () => {
          viewer.navigation.setPivotPoint(new THREE.Vector3(pivot[0], pivot[1], pivot[2]))
        },
        immediate ? 0 : 1250
      )
    }

    viewer.addEventListener(BimFish.Viewing.VIEWER_STATE_RESTORED_EVENT, onStateRestored)

    viewer.restoreState(state, filter, immediate)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static getComponentsByParentName(name, model) {
    const instanceTree = model.getData().instanceTree

    const rootId = instanceTree.getRootId()

    let parentId = 0

    instanceTree.enumNodeChildren(rootId, childId => {
      const nodeName = instanceTree.getNodeName(childId)

      if (nodeName.indexOf(name) > -1) {
        parentId = childId
      }
    })

    return parentId > 0 ? Toolkit.getLeafNodes(model, parentId) : []
  }

  /////////////////////////////////////////////////////////
  // Creates a standard THREE.Mesh out of a Viewer
  // component
  //
  /////////////////////////////////////////////////////////
  static buildComponentGeometry(viewer, model, dbId, faceFilter) {
    // first we assume the component dbId is a leaf
    // component: ie has no child so contains
    // geometry. This util method will return all fragIds
    // associated with that specific dbId
    const fragIds = Toolkit.getLeafFragIds(model, dbId)

    let matrixWorld = null

    const meshGeometry = new THREE.Geometry()

    fragIds.forEach(fragId => {
      // for each fragId, get the proxy in order to access
      // THREE geometry
      const renderProxy = viewer.impl.getRenderProxy(model, fragId)

      matrixWorld = matrixWorld || renderProxy.matrixWorld

      const geometry = renderProxy.geometry

      const attributes = geometry.attributes

      const positions = geometry.vb ? geometry.vb : attributes.position.array

      const indices = attributes.index.array || geometry.ib

      const stride = geometry.vb ? geometry.vbstride : 3

      const offsets = [
        {
          count: indices.length,
          index: 0,
          start: 0
        }
      ]

      for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {
        var start = offsets[oi].start
        var count = offsets[oi].count
        var index = offsets[oi].index

        for (var i = start, il = start + count; i < il; i += 3) {
          const a = index + indices[i]
          const b = index + indices[i + 1]
          const c = index + indices[i + 2]

          const vA = new THREE.Vector3()
          const vB = new THREE.Vector3()
          const vC = new THREE.Vector3()

          vA.fromArray(positions, a * stride)
          vB.fromArray(positions, b * stride)
          vC.fromArray(positions, c * stride)

          if (!faceFilter || faceFilter(vA, vB, vC)) {
            const faceIdx = meshGeometry.vertices.length

            meshGeometry.vertices.push(vA)
            meshGeometry.vertices.push(vB)
            meshGeometry.vertices.push(vC)

            const face = new THREE.Face3(faceIdx, faceIdx + 1, faceIdx + 2)

            meshGeometry.faces.push(face)
          }
        }
      }
    })

    meshGeometry.applyMatrix(matrixWorld)

    return meshGeometry
  }

  /////////////////////////////////////////////////////////
  // Creates a standard THREE.Mesh out of a Viewer
  // component
  //
  /////////////////////////////////////////////////////////
  static buildComponentMesh(viewer, model, dbId, faceFilter, material) {
    const meshGeometry = Toolkit.buildComponentGeometry(viewer, model, dbId, faceFilter)

    meshGeometry.computeFaceNormals()
    meshGeometry.computeVertexNormals()

    // creates THREE.Mesh
    const mesh = new THREE.Mesh(meshGeometry, material)

    mesh.dbId = dbId

    return mesh
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static selectiveExplode(viewer, scale, excludedFragIds, model = null) {
    model = model || viewer.activeModel || viewer.model

    var svf = model.getData()

    var mc = model.getVisibleBounds(true).center()

    var fragList = model.getFragmentList()

    var pt = new THREE.Vector3()

    //Input scale is in the range 0-1, where 0
    //means no displacement, and 1 maximum reasonable displacement.
    scale *= 2

    //If we have a full part hierarchy we can use a
    //better grouping strategy when exploding
    if (svf.instanceTree && svf.instanceTree.nodeAccess.nodeBoxes && scale !== 0) {
      var scaledExplodeDepth = scale * (svf.instanceTree.maxDepth - 1) + 1
      var explodeDepth = 0 | scaledExplodeDepth
      var currentSegmentFraction = scaledExplodeDepth - explodeDepth

      var it = svf.instanceTree
      var tmpBox = new Float32Array(6)

      ;(function explodeRec(nodeId, depth, cx, cy, cz, ox, oy, oz) {
        var oscale = scale * 2

        // smooth transition of this tree depth
        // from non-exploded to exploded state
        if (depth == explodeDepth) oscale *= currentSegmentFraction

        it.getNodeBox(nodeId, tmpBox)

        var mycx = 0.5 * (tmpBox[0] + tmpBox[3])
        var mycy = 0.5 * (tmpBox[1] + tmpBox[4])
        var mycz = 0.5 * (tmpBox[2] + tmpBox[5])

        if (depth > 0 && depth <= explodeDepth) {
          var dx = (mycx - cx) * oscale
          var dy = (mycy - cy) * oscale
          var dz = (mycz - cz) * oscale

          //var omax = Math.max(dx, Math.max(dy, dz));
          ox += dx
          oy += dy
          oz += dz
        }

        svf.instanceTree.enumNodeChildren(
          nodeId,
          function(dbId) {
            explodeRec(dbId, depth + 1, mycx, mycy, mycz, ox, oy, oz)
          },
          false
        )

        svf.instanceTree.enumNodeFragments(
          nodeId,
          function(fragId) {
            if (excludedFragIds.indexOf(fragId.toString()) < 0) {
              pt.x = ox
              pt.y = oy
              pt.z = oz

              fragList.updateAnimTransform(fragId, null, null, pt)
            }
          },
          false
        )
      })(svf.instanceTree.getRootId(), 0, mc.x, mc.y, mc.x, 0, 0, 0)
    } else {
      var boxes = fragList.fragments.boxes

      var nbFrags = fragList.getCount()

      for (var fragId = 0; fragId < nbFrags; ++fragId) {
        if (excludedFragIds.indexOf(fragId.toString()) < 0) {
          if (scale == 0) {
            fragList.updateAnimTransform(fragId)
          } else {
            var box_offset = fragId * 6

            var cx = 0.5 * (boxes[box_offset] + boxes[box_offset + 3])
            var cy = 0.5 * (boxes[box_offset + 1] + boxes[box_offset + 4])
            var cz = 0.5 * (boxes[box_offset + 2] + boxes[box_offset + 5])

            cx = scale * (cx - mc.x)
            cy = scale * (cy - mc.y)
            cz = scale * (cz - mc.z)

            pt.x = cx
            pt.y = cy
            pt.z = cz

            fragList.updateAnimTransform(fragId, null, null, pt)
          }
        }
      }
    }
  }

  /////////////////////////////////////////////////////////
  // 透明构件
  // @param dbIds 传入的dbid数组
  // @param model 传入model
  // @return oldMaterial 更改之前的 material key-value
  /////////////////////////////////////////////////////////
  static transparentByDbId(dbIds, model, newMaterial) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!model) {
          reject('model is null')
        }
        let dbIdArray = []
        let oldMaterial = []
        if (dbIds instanceof Array) {
          dbIdArray = dbIds
        } else {
          dbIdArray.push(dbIds)
        }

        var fragList = model.getFragmentList()

        for (let dbId of dbIdArray) {
          const fragIds = await Toolkit.getFragIds(model, dbId)
          fragIds.forEach(fragId => {
            var material = fragList.getMaterial(fragId)
            //oldMaterial[`${model.id}-${dbId}`] = material.id;
            oldMaterial.push({
              key: `${model.id}-${dbId}`,
              material: material
            })
            fragList.setMaterial(fragId, newMaterial)
          })
        }
        resolve(oldMaterial)
      } catch (e) {
        reject(e)
      }
    })
  }

  static async getAllModelDbId(viewer) {
    const models = viewer.impl.modelQueue().getModels()
    let allDbIds = []
    for (let model of models) {
      let dbIds = await Toolkit.getLeafNodes(model)
      for (let dbid of dbIds) {
        allDbIds.push(`${model.id}-${dbid}`)
      }
    }
    return allDbIds
  }

  // 隐藏所有的构件，支持多模
  static async hideAll(viewer) {
    const models = viewer.impl.modelQueue().getModels()
    for (let model of models) {
      const instanceTree = model.getData().instanceTree
      if (!instanceTree || instanceTree == 'undefined') continue

      const rootId = instanceTree.getRootId()
      if (!rootId || rootId == 'undefined') continue
      viewer.hide(rootId, model)
    }
  }

  // 获取guid mapping
  static async getExternalIdMapping(model) {
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
  }

  /*
   * 获取guid和dbid,适配多模
   */
  static async getGuidMappingForMul(viewer) {
    return new Promise(async (resolve, reject) => {
      try {
        const models = viewer.impl.modelQueue().getModels()
        //console.log("getGuidMappingForMul :", models);
        let guidMapping = {}
        for (let model of models) {
          const result = await Toolkit.getExternalIdMapping(model)
          for (let guid of Object.keys(result)) {
            //guidMapping[guid] = {dbId: result[guid],modelId:model.id}
            guidMapping[guid] = `${model.id}-${result[guid]}`
          }
        }

        resolve(guidMapping)
      } catch (e) {
        reject(e)
      }
    })
  }

  /*
   * 获取guid和dbid,适配多模, 按照对象方式返回
   */
  static async getGuidMappingForMul2(viewer) {
    return new Promise(async (resolve, reject) => {
      try {
        //console.time("map2:")
        const models = viewer.impl.modelQueue().getModels()
        //console.log("getGuidMappingForMul :", models);
        let ModelGuidMapping = {}
        for (let model of models) {
          const result = await Toolkit.getExternalIdMapping(model)
          ModelGuidMapping[model.id] = result
        }
        //console.timeEnd("map2");
        resolve(ModelGuidMapping)
      } catch (e) {
        reject(e)
      }
    })
  }

  /*
   * 设置颜色
   */
  static async setThemingColor(viewer, guidArray, color, guidMapping) {
    return new Promise(async (resolve, reject) => {
      try {
        const modelGuidMapping = guidMapping ? guidMapping : await Toolkit.getGuidMappingForMul2(viewer)

        var modelIdMap = {}
        let keyModelIds = Object.keys(modelGuidMapping)
        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelGuidMapping[modelId] || modelGuidMapping[modelId] == 'undefined') continue
          const guidMapping = modelGuidMapping[modelId]
          let dbIdArray = []
          for (let i = 0; i < guidArray.length; i++) {
            let guid = guidArray[i]
            if (!guidMapping[guid] || guidMapping[guid] == 'undefined') continue
            //dbIdArray.push( guidMapping[guid] );
            dbIdArray.push(parseInt(guidMapping[guid]))
          }
          modelIdMap[modelId] = dbIdArray
        }

        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelIdMap[modelId] || modelIdMap[modelId] == 'undefined') continue
          const dbIdArray = modelIdMap[modelId]

          const model = viewer.impl.findModel(parseInt(modelId))

          for (let dbidIndex = 0; dbidIndex < dbIdArray.length; dbidIndex++) {
            viewer.setThemingColor(dbIdArray[dbidIndex], color, model)
          }
        }

        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  static async clearThemingColors(viewer) {
    const models = viewer.impl.modelQueue().getModels()
    for (let model of models) {
      viewer.clearThemingColors(model)
    }
  }

  // 根据guid清除颜色
  static async clearThemingColorsByGuids(viewer, guidArray, guidMapping) {
    const modelGuidMapping = guidMapping ? guidMapping : await Toolkit.getGuidMappingForMul2(viewer)
    //const modelGuidMapping = await Toolkit.getGuidMappingForMul2(viewer);

    //console.time("showmodel1");
    var modelIdMap = {}
    let keyModelIds = Object.keys(modelGuidMapping)
    for (let j = 0; j < keyModelIds.length; j++) {
      let modelId = keyModelIds[j]
      if (!modelGuidMapping[modelId] || modelGuidMapping[modelId] == 'undefined') continue
      const guidMapping = modelGuidMapping[modelId]
      let dbIdArray = []
      for (let i = 0; i < guidArray.length; i++) {
        let guid = guidArray[i]
        if (!guidMapping[guid] || guidMapping[guid] == 'undefined') continue
        dbIdArray.push(guidMapping[guid].toString())
      }
      modelIdMap[modelId] = dbIdArray
    }

    for (let j = 0; j < keyModelIds.length; j++) {
      let modelId = keyModelIds[j]
      if (!modelIdMap[modelId] || modelIdMap[modelId] == 'undefined') continue
      const dbIdArray = modelIdMap[modelId]

      const model = viewer.impl.findModel(parseInt(modelId))
      viewer.clearThemingColorsByids(model, dbIdArray)
    }
  }

  // 通过guid数组显示构件
  static async showParts(viewer, guidArray, guidMapping) {
    return new Promise(async (resolve, reject) => {
      try {
        const modelGuidMapping = guidMapping ? guidMapping : await Toolkit.getGuidMappingForMul2(viewer)

        var modelIdMap = {}
        let keyModelIds = Object.keys(modelGuidMapping)
        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelGuidMapping[modelId] || modelGuidMapping[modelId] == 'undefined') continue
          const guidMapping = modelGuidMapping[modelId]
          let dbIdArray = []
          for (let i = 0; i < guidArray.length; i++) {
            let guid = guidArray[i]
            if (!guidMapping[guid] || guidMapping[guid] == 'undefined') continue
            dbIdArray.push(parseInt(guidMapping[guid]))
          }
          modelIdMap[modelId] = dbIdArray
        }

        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelIdMap[modelId] || modelIdMap[modelId] == 'undefined') continue
          const dbIdArray = modelIdMap[modelId]

          const model = viewer.impl.findModel(parseInt(modelId))
          viewer.show(dbIdArray, model)
        }

        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 通过guid选择构件
  static async selectByGuids(viewer, guidArray, guidMapping) {
    return new Promise(async (resolve, reject) => {
      try {
        const modelGuidMapping = guidMapping ? guidMapping : await Toolkit.getGuidMappingForMul2(viewer)
        var modelIdMap = {}
        let keyModelIds = Object.keys(modelGuidMapping)
        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelGuidMapping[modelId] || modelGuidMapping[modelId] == 'undefined') continue
          const guidMapping = modelGuidMapping[modelId]
          let dbIdArray = []
          for (let i = 0; i < guidArray.length; i++) {
            let guid = guidArray[i]
            if (!guidMapping[guid] || guidMapping[guid] == 'undefined') continue
            dbIdArray.push(parseInt(guidMapping[guid]))
          }
          modelIdMap[modelId] = dbIdArray
        }

        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelIdMap[modelId] || modelIdMap[modelId] == 'undefined') continue
          const dbIdArray = modelIdMap[modelId]

          const model = viewer.impl.findModel(parseInt(modelId))

          for (let item of dbIdArray) {
            // toggleSelect 不能传dbid数组
            viewer.toggleSelect(item, model)
          }
        }

        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 通过guid隐藏构件
  static async hideByGuids(viewer, guidArray, guidMapping) {
    return new Promise(async (resolve, reject) => {
      try {
        const modelGuidMapping = guidMapping ? guidMapping : await Toolkit.getGuidMappingForMul2(viewer)
        var modelIdMap = {}
        let keyModelIds = Object.keys(modelGuidMapping)
        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelGuidMapping[modelId] || modelGuidMapping[modelId] == 'undefined') continue
          const guidMapping = modelGuidMapping[modelId]
          let dbIdArray = []
          for (let i = 0; i < guidArray.length; i++) {
            let guid = guidArray[i]
            if (!guidMapping[guid] || guidMapping[guid] == 'undefined') continue
            dbIdArray.push(parseInt(guidMapping[guid]))
          }
          modelIdMap[modelId] = dbIdArray
        }

        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelIdMap[modelId] || modelIdMap[modelId] == 'undefined') continue
          const dbIdArray = modelIdMap[modelId]

          const model = viewer.impl.findModel(parseInt(modelId))
          //viewer.select(dbIdArray, model);
          viewer.hide(dbIdArray, model)
        }

        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 通过guid隔离构件
  static async isolateByGuids(viewer, guidArray, guidMapping) {
    return new Promise(async (resolve, reject) => {
      try {
        Toolkit.hideAll(viewer)
        const modelGuidMapping = guidMapping ? guidMapping : await Toolkit.getGuidMappingForMul2(viewer)
        var modelIdMap = {}
        let keyModelIds = Object.keys(modelGuidMapping)
        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelGuidMapping[modelId] || modelGuidMapping[modelId] == 'undefined') continue
          const guidMapping = modelGuidMapping[modelId]
          let dbIdArray = []
          for (let i = 0; i < guidArray.length; i++) {
            let guid = guidArray[i]
            if (!guidMapping[guid] || guidMapping[guid] == 'undefined') continue
            dbIdArray.push(parseInt(guidMapping[guid]))
          }
          modelIdMap[modelId] = dbIdArray
        }

        for (let j = 0; j < keyModelIds.length; j++) {
          let modelId = keyModelIds[j]
          if (!modelIdMap[modelId] || modelIdMap[modelId] == 'undefined') continue
          const dbIdArray = modelIdMap[modelId]

          const model = viewer.impl.findModel(parseInt(modelId))
          //viewer.select(dbIdArray, model);
          viewer.show(dbIdArray, model)
        }

        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 定位到某个模型
  static async fitViewByGUID(viewer, guid, guidMapping) {
    return new Promise(async (resolve, reject) => {
      try {
        const modelGuidMapping = guidMapping ? guidMapping : await Toolkit.getGuidMappingForMul2(viewer)
        var modelIdMap = {}
        let keyModelIds = Object.keys(modelGuidMapping)
        let dbIds = []
        let modelId = null
        for (let j = 0; j < keyModelIds.length; j++) {
          modelId = keyModelIds[j]
          if (!modelGuidMapping[modelId] || modelGuidMapping[modelId] == 'undefined') continue
          const guidMapping = modelGuidMapping[modelId]

          if (guidMapping[guid] && guidMapping[guid] != 'undefined') {
            dbIds.push(parseInt(guidMapping[guid]))
            break
          }
        }

        if (dbIds && dbIds.length > 0 && modelId) {
          const model = viewer.impl.findModel(parseInt(modelId))
          viewer.select(dbIds, model)
          viewer.fitToView(dbIds, model)
        }

        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 根据guid获取属性
  static async getPropertiesByGUID(viewer, guid, guidMapping) {
    return new Promise(async (resolve, reject) => {
      try {
        const modelGuidMapping = guidMapping ? guidMapping : await Toolkit.getGuidMappingForMul2(viewer)
        var modelIdMap = {}
        let keyModelIds = Object.keys(modelGuidMapping)
        let dbId = null
        let modelId = null
        for (let j = 0; j < keyModelIds.length; j++) {
          modelId = keyModelIds[j]
          if (!modelGuidMapping[modelId] || modelGuidMapping[modelId] == 'undefined') continue
          const guidMapping = modelGuidMapping[modelId]

          if (guidMapping[guid] && guidMapping[guid] != 'undefined') {
            dbId = parseInt(guidMapping[guid])
            break
          }
        }

        if (dbId && modelId) {
          const model = viewer.impl.findModel(parseInt(modelId))
          const res = await Toolkit.getProperties(model, dbId)
          resolve(res)
        } else {
          resolve(null)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  // 搜索
  static async search(viewer, model, text, attributeNames) {
    return new Promise(async (resolve, reject) => {
      try {
        model.search(
          text,
          res => {
            resolve(res)
          },
          err => {},
          attributeNames
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  // 搜索，适配多模
  // @param: text 文字
  // @attributeNames: 属性数组，可以多个属性
  static async searchForMul(viewer, text, attributeNames) {
    return new Promise(async (resolve, reject) => {
      try {
        //console.time("map2:")
        const models = viewer.impl.modelQueue().getModels()
        //console.log("getGuidMappingForMul :", models);
        let ModelGuidMapping = {}
        let guidSearched = []
        for (let model of models) {
          const res = await Toolkit.search(viewer, model, text, attributeNames)
          for (let i = 0; i < res.length; i++) {
            const prop = await Toolkit.getPropertieObj(model, res[i])
            guidSearched.push(prop.externalId)
          }
        }
        resolve(guidSearched)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 获取所有子节点数据
  static getTreeChildrenIds(model, nodeId) {
    return new Promise((resolve, reject) => {
      try {
        var retlist = []
        var instanceTree = model.getData().instanceTree

        instanceTree.enumNodeChildren(
          nodeId,
          childId => {
            retlist.push(childId)
          },
          false
        )

        resolve(retlist)
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  // 获取所有子节点数据//buildModelTree
  static getPropertieList(model, dbId) {
    return new Promise((resolve, reject) => {
      try {
        resolve(dbId)
      } catch (ex) {
        return reject(ex)
      }
    })
  }

  // key-value map 转数组
  static toArray(obj) {
    return obj ? (Array.isArray(obj) ? obj : [obj]) : []
  }

  // 更新模型材质
  static updatemodelMaterial(model, guidArray, material) {
    return new Promise(async (resolve, reject) => {
      try {
        /*
        const propsHelper = new PropsHelper(this.viewer);
        let guidMapping = new Object();
        

        const result = await propsHelper.getExternalIdMapping(model);
        */

        let fragIds = []

        const result = await Toolkit.getExternalIdMapping(model)
        //var fragIds = this.viewer.model.getData().instanceTree.nodeAccess.dbIdToIndex;
        var fragId2Dbid = model.getFragmentList().fragments.fragId2dbId
        //console.log("modelHelper:fragId2Dbid:",fragId2Dbid);
        for (let guid of guidArray) {
          //guidMapping[guid] = {dbId: result[guid],modelId:modelId}
          let dbid = result[guid]
          for (let j = 0; j < fragId2Dbid.length; ++j) {
            if (fragId2Dbid[j] == dbid) {
              fragIds.push(j)
            }
          }
        }
        console.log('fragIds', fragIds)
        const fragList = model.getFragmentList()
        Toolkit.toArray(fragIds).forEach(fragId => {
          var fragIdValue = parseInt(fragId)
          console.log('fragIdValue:', fragIdValue)
          fragList.setMaterial(fragIdValue, material)
        })
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 绘制平面
  static drawPlane(viewer, min, max, material, overlayId) {
    // p1 -577.069880126322 -2582.2797854921873 133.41298966881848
    // p2 -368.60244346404534 -2582.2797854921873 132.51183364154326
    // p3 -368.9028288194665 -2582.2797854921873 -24.289315104344908
    // p4 -576.1687240600586 -2582.2797854921873 -24.890085789195027
    // w 64777
    // h 48117

    const width = 64777
    const height = 48117
    var geom = new THREE.PlaneGeometry(width, height)
    const _material = new THREE.MeshBasicMaterial({
      color: '#ff0000'
    })
    var plane = new THREE.Mesh(geom, _material)
    plane.position.set(0, 0, 0)

    viewer.impl.addOverlay('a-plane', plane)
  }

  // 获取相关guid和dbid信息
  static async getGuidMappingByGuidForSingle(viewer, guidArray) {
    return new Promise(async (resolve, reject) => {
      try {
        const models = viewer.impl.modelQueue().getModels()
        let ModelGuidMapping = {}
        const result = await Toolkit.getExternalIdMapping(models[0])
        var dbIdArray = []
        for (let i = 0; i < guidArray.length; i++) {
          let guid = guidArray[i]
          if (!result[guid] || result[guid] == 'undefined') continue
          dbIdArray.push(parseInt(result[guid]))
        }
        ModelGuidMapping[models[0].id] = dbIdArray
        resolve(ModelGuidMapping)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 改变构件的材质颜色
  static async setMaterialByColor(viewer, fragid, color, matid) {
    const oldMaterial = viewer.model.getFragmentList().getMaterial(fragid)
    const newMaterial = oldMaterial.clone()
    newMaterial.color = new THREE.Color(color)
    viewer.impl.matman().removeMaterial(matid)
    viewer.impl.matman().addMaterial(matid, newMaterial, true)
    viewer.model.getFragmentList().setMaterial(fragid, newMaterial)
    viewer.impl.invalidate(true)
  }

  // 根据传入的点组, 获取boundingBox
  static getBoundingBoxByPos(positions) {
    var ptLength = positions.length
    if (ptLength < 2) {
      return null
    }
    var ptMin = new THREE.Vector3().copy(positions[0])
    var ptMax = new THREE.Vector3().copy(positions[0])
    for (var i = 1; i < ptLength; ++i) {
      if (ptMin.x > positions[i].x) {
        ptMin.x = positions[i].x
      }
      if (ptMin.y > positions[i].y) {
        ptMin.y = positions[i].y
      }
      if (ptMin.z > positions[i].z) {
        ptMin.z = positions[i].z
      }
      if (ptMax.x < positions[i].x) {
        ptMax.x = positions[i].x
      }
      if (ptMax.y < positions[i].y) {
        ptMax.y = positions[i].y
      }
      if (ptMax.z < positions[i].z) {
        ptMax.z = positions[i].z
      }
    }
    return {
      min: ptMin,
      max: ptMax
    }
  }
}
