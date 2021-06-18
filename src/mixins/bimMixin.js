/*
 * @Description:模型混合
 * @Version:
 * @Autor:
 * @Date: 2020-03-07 10:10:36
 * @LastEditTime: 2020-03-23 09:57:54
 */
import ToolKit from '@/BIM/utils/Viewer.Toolkit'
export default {
  data() {
    return {
      bimfishApp: null,
      // bimId是为了便于某些特殊的bim，独立的id
      bimId: 'lo-viewer',
      guidList: []
    }
  },
  mounted() {
    // 写在这里会报错
    // this.load3dviewer()
  },
  methods: {
    // 点击切换版本
    switchVersion(path) {
      this.load3dviewer(path)
    },
    // 获取框选选中的构建guidList
    async getModal() {
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
    // 左侧单体楼层+专业构件展示选中的构件
    watchModal(tree) {
      let guids = []
      let list = tree.getCheckedNodes()
      if (list.length > 0) {
        guids = list.filter(item => item.guid).map(item => item.guid)
      }
      this.bimfishApp.hideAll()
      this.bimfishApp.show(guids)
    },
    // 获取模型构件guid
    getGuid() {
      this.bimfishApp.getComponentGuid((e, id) => {
        console.log(id)
      })
    },
    // 加载3D视图
    load3dviewer(url) {
      let key = '465758F8f2B54E72b6956A8ba3625a73'
      let secret = '5De5712e99b0435AB47a41673B2B1F97faf51014C47041fB97cc12c1bEb7b185'
      this.bimfishApp = new BimfishApp(this.bimId, key, secret, { MemoryLimited: true })
      this.bimfishApp.init(() => {
        this.bimfishApp.showModel([{ id: 3, modelUrl: location.origin + url }])
      })
    }
  }
}
