<template>
  <div class="main">
    <div class="task-list-wrap">
      <div class="aside">
        <el-card class="box-card" style="min-height: 450px">
          <div slot="header" class="clearfix">
            <span>模型列表</span>
          </div>
          <div>
            <el-tree
              ref="tree"
              :data="treeData"
              show-checkbox
              node-key="id"
              default-expand-all
              :props="defaultProps"
              @check-change="handleCheckChange"
              @check="checkChange"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>
                  {{ node.label }}
                  <span v-if="data.isCategory == 0">{{ data.modelVersion ? '(v' + data.modelVersion + ')' : '' }}</span>
                </span>
                <!--     <el-dropdown v-if="data.isCategory == 0" :hide-on-click="false" trigger="click">
                  <el-button
                    class="el-dropdown-link"
                    type="text"
                    size="mini"
                    @click="() => getModelVersionList(data.id)"
                  >
                    <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in modelVersionList" :key="item.id" divided>
                      <span style="margin-right:15px;">v{{ item.version }}.0</span>
                      <el-button size="mini" @click="() => handleApply(data, item)">应用</el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>-->
              </span>
            </el-tree>
          </div>
        </el-card>
        <!--        <el-card class="box-card" style="margin-top:10px;min-height:300px;">-->
        <!--          <div slot="header" class="clearfix">-->
        <!--            <span>当前模型版本明细</span>-->
        <!--          </div>-->
        <!--          <div>-->
        <!--            <vxe-table ref="table" border :data="tableData" auto-resize>-->
        <!--              <vxe-table-column field="title" title="单体名称" />-->
        <!--              <vxe-table-column field="modelVersion" title="模型版本" />-->
        <!--            </vxe-table>-->
        <!--          </div>-->
        <!--        </el-card>-->
      </div>
      <div class="box-card task-list">
        <BIM ref="BIM" idSelect="modelVersion" flag="version" />
      </div>
    </div>
    <footer class="main-footer">
      <el-button size="normal" @click="handleCancle">取消</el-button>
      <el-button size="normal" @click="handleSubmit((status = 0))">保存</el-button>
      <el-button type="primary" size="normal" @click="handleSubmit((status = 1))">提交</el-button>
    </footer>
  </div>
</template>

<script>
import Api from '@/api/model/modelVersion'
import toTree from '@/utils/toTree'
import treeForEach from '@/utils/treeForEach'
import toFlat from '@/utils/toFlat'
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
export default {
  name: 'AddModel',
  data() {
    return {
      status: 0,
      defaultProps: {},
      treeData: [],
      treeList: [],
      tableData: [],
      modelVersionList: [],
      formData: {},
      selectData: [],
      categoryList: [],
      sourceList: []
    }
  },
  async created() {
    await this.getTreeData()
    let form = JSON.parse(localStorage.getItem('lastEditModel'))
    this.formData = form
    if (this.formData.id) {
      this.getEntityTree(form.id)
    }
  },
  mounted() {},
  methods: {
    checkChange(data, checkedNodes) {
      let list = checkedNodes.checkedNodes
      this.getVersionModelIds(list)
    },
    // 获取所选单体的数据
    getVersionModelIds(data) {
      // data:是一个一维数组
      let list = data.filter(item => item.type === 3).map(item => item.bimResourceId + '_' + item.modelVersion)
      console.log(list)
      this.$store.commit('bim/changeVersionModelIds', list)
    },
    async getEntityTree(id) {
      let res = await Api.getEntityTree(id)
      let idList = []
      treeForEach(res.data, e => {
        if (e.type === 3) {
          const bimResourceId = e.bimResourceId.split('_')[0]
          idList.push(bimResourceId)
          this.tableData.push(this.treeList.find(item => item.id === bimResourceId))
          this.$refs.tree.setCheckedKeys(idList)
        }
      })
    },
    async getTreeData() {
      let res = await Api.getModelTreeList({})
      this.treeData = toTree(res.data)
      treeForEach(this.treeData, e => {
        e.label = e.title
        if (e.isCategory) {
          e.disabled = true
        }
        e.bimResourceId = e.id
        e.bimResourceName = e.title
        e.projectId = localStorage.getItem('projectId')
        e.companyId = this.formData.companyId
        if (e.pid === '0' || e.pid === '') {
          e.type = 1
        } else if ((e.pid !== '0' || e.pid !== '') && e.children) {
          e.type = 2
        } else {
          e.type = 3
        }
      })
      this.treeList = toFlat(this.treeData)
    },
    handleApply(data, item) {
      data.modelVersion = item.version
      // 左侧所有版本组成一个数组arr,里边的item如下：
      // let obj = {
      //   id: item.modelId,
      //   modelUrl: `http://172.16.10.26:22222/cim6d-data-processing/basic/commonFile/get/fdht/bim_${item.modelId}_${item.version}/3d.svf`
      // }
      // this.$refs.BIM.load3dviewer([obj])
    },
    async getModelVersionList(id) {
      let res = await Api.getModelVersionList(id)
      this.modelVersionList = res.data
    },
    handleCheckChange(data, checked, indeterminate) {
      if (checked && data.type === 3) {
        this.selectData.push(data)
      } else {
        this.selectData.forEach((item, index) => {
          if (item.id === data.id) {
            this.selectData.splice(index, 1)
          }
        })
      }
      this.tableData = this.selectData
    },
    // 节点点击
    handleNodeClick(e) {
      if (e.label === '钢筋梁顶') {
        this.changeModal('/models/V1/3d.svf')
      } else {
        this.changeModal('/models/V2/3d.svf')
      }
    },
    // 更改模型
    changeModal(url) {
      this.load3dviewer(url)
    },
    handleCancle() {
      this.$router.back()
    },
    async handleSubmit() {
      let res = null
      this.formData.status = this.status
      if (this.formData.id) {
        res = await Api.updateVersion(this.formData)
      } else {
        res = await Api.addVersion(this.formData)
        this.formData.id = res.data
      }
      this.saveEntity(this.formData.id)
    },
    async saveEntity(id) {
      let paramList = []
      this.tableData.forEach(item => {
        item.bimResourceId = item.id + '_' + item.modelVersion
        item.bimVersionId = id
        paramList.push(item)
        let category = this.treeList.find(e => e.id === item.pid)
        if (category && paramList.findIndex(e => e.id === category.id) === -1) {
          category.bimVersionId = id
          paramList.push(category)
        }
        let source = this.treeList.find(e => e.id === category.pid)
        if (source && paramList.findIndex(e => e.id === source.id) === -1) {
          source.pid = ''
          source.bimVersionId = id
          paramList.push(source)
        }
      })
      let params = []
      paramList.forEach(item => {
        let { bimVersionId, type, pid, bimResourceId, bimResourceName, projectId, companyId } = item
        let newObj = { bimVersionId, type, pid, bimResourceId, bimResourceName, projectId, companyId }
        params.push(newObj)
      })
      let res = await Api.saveEntity(params)
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.$router.back()
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style scoped lang="less">
div.main {
  background-color: #f0f2f5;
  padding: 0;
  .task-list-wrap {
    display: flex;
    .aside {
      height: 100%;
      width: 320px;
      margin-right: 10px;
      background-color: #fff;
    }
    .task-list {
      width: calc(100% - 320px);
      min-height: 500px;
      background-color: #fff;
      .box-header {
        display: flex;
        justify-content: space-between;
        span {
          width: 100%;
        }
      }
    }
  }
}
.add-row {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
  font-size: 14px;
  line-height: 30px;
  border: 1px dashed #ddd;
  margin-top: -1px;
  i {
    margin-right: 8px;
  }
  text-align: center;
}
.main-footer {
  text-align: right;
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: calc(100% - 40px);
  background-color: #fff;
  margin-top: 15px;
  padding: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
