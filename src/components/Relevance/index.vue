<!--
 * @Description: 关联构件
 * @Version: 
 * @Autor: 
 * @Date: 2020-03-09 15:36:15
 * @LastEditTime: 2020-03-23 09:57:42
 -->
<template>
  <div>
    <!-- 左侧单体楼层、构件类型 -->
    <el-dialog title="BIM关联" :visible.sync="dialogVisible" width="800px" @close="handleClose">
      <!-- <div class="left">
        <p>单体楼层</p>
        <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all :props="defaultProps"></el-tree>
      </div>
      <div class="right"></div> -->
      <div class="btn-box"></div>
      <div id="relevance" ref="lo-viewer" class="lo-viewer"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [
        {
          id: 1,
          label: '土建',
          children: [
            {
              id: 2,
              label: '54#楼',
              children: [
                {
                  id: 3,
                  label: '1楼',
                  children: [
                    {
                      id: 4,
                      label: '钢筋梁顶'
                    },
                    {
                      id: 5,
                      label: '基础顶'
                    }
                  ]
                },
                {
                  id: 6,
                  label: '2楼',
                  children: [
                    {
                      id: 7,
                      label: '钢筋梁顶'
                    },
                    {
                      id: 8,
                      label: '基础顶'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.load3dviewer('/models/V2/3d.svf')
        console.log('加载模型')
      })
    },
    // 加载3D视图
    load3dviewer(url) {
      let key = '465758F8f2B54E72b6956A8ba3625a73'
      let secret = '5De5712e99b0435AB47a41673B2B1F97faf51014C47041fB97cc12c1bEb7b185'
      this.bimfishApp = new BimfishApp('relevance', key, secret, { MemoryLimited: true })
      this.bimfishApp.init(() => {
        this.bimfishApp.showModel([{ id: 3, modelUrl: location.origin + url }])
      })
    },
    // 画线
    async drawBIM() {
      await this.bimfishApp.initDrawArea()
      console.log(this.bimfishApp)
      let area = this.bimfishApp.areaDrawer
      this.drawArea()
    },
    async drawArea() {
      await this.bimfishApp.drawArea()
    },
    // bim编辑
    editBIM() {},
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
#relevance {
  height: 400px;
}
</style>
