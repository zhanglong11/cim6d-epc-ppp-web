<template>
  <el-dialog width="1200px" top="10vh" :title="isAdd ? '新建' : '修改'" :visible="visible" @close="close">
    <div class="wrap">
      <el-card class="list" shadow="never">
        <div slot="header">
          <span>模型列表</span>
        </div>
        <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          show-checkbox
          :props="defaultProps"
          :default-expand-all="true"
          @check="treeCheckChange"
        />
        <!--        <el-tree-->
        <!--          v-if="!isAdd"-->
        <!--          ref="tree"-->
        <!--          :data="treeData"-->
        <!--          node-key="id"-->
        <!--          :props="defaultProps"-->
        <!--          :default-expand-all="true"-->
        <!--        >-->
        <!--          <span slot-scope="{ node, data }" class="custom-tree-node">-->
        <!--            <el-radio-->
        <!--              v-if="data.isLeaf && !isAdd"-->
        <!--              :value="checkedId"-->
        <!--              :label="data.id"-->
        <!--              @change="changeRadio(node, data)"-->
        <!--            >-->
        <!--              {{ data.title }}-->
        <!--            </el-radio>-->
        <!--            <span v-if="!data.isLeaf" :class="['tree-name', data.isLeaf ? 'isLeaf' : '']">{{ node.label }}</span>-->
        <!--          </span>-->
        <!--        </el-tree>-->
      </el-card>
      <div class="model">
        <BimShow ref="BIMRefAdd" idSelect="model" :isLoadAll="false" class="bim-box-progress" />
      </div>
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../../api'
import toTree from '@/utils/toTree'
import BimShow from '../../../home/components/bimShow'
import axios from '@/utils/axios'
export default {
  name: 'AddModelDialog',
  components: { BimShow },
  props: ['visible', 'isAdd', 'checkId'],
  data() {
    return {
      treeData: [], //树数据
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      checkedId: this.checkId, //当前单选选中
      checkIds: [], //当前多选选中
      list: [], //扁平树列表
      checkedNodes: []
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    //更新
    async refresh() {
      const res = await Api.allTree()
      const cloneData = _.cloneDeep(res.data)
      this.list = cloneData
      this.$refs.tree.setCheckedKeys(cloneData.filter(r => r.isCheck).map(r => r.id))
      this.treeData = toTree(cloneData)
      this.formatBimArray(cloneData.filter(r => r.type === 3 && r.isCheck))
    },
    //取消
    close() {
      this.$emit('update:visible', false)
    },
    //提交
    async submit() {
      if (1) {
        const checkedNode = this.$refs.tree.getCheckedNodes(false, true)
        checkedNode.forEach(r => {
          r.projectId = localStorage.getItem('projectId')
          r.bimResourceId = r.id
          r.bimResourceName = r.title
          r.bimResourcePid = r.pid
        })
        await Api.addTree(checkedNode)
      } else {
        let checkNode = this.list.find(r => r.id === this.checkedId)
        let param = {
          projectId: localStorage.getItem('projectId'),
          targetBimId: checkNode.id,
          targetBimName: checkNode.title,
          sourceBimId: this.checkId,
          viewId: checkNode.viewId
        }
        await Api.updateTree(param)
      }
      this.$message.success('操作成功')
      this.close()
      this.$parent.getTreeData()
    },
    //树选中
    treeCheckChange(data, { checkedNodes, halfCheckedNodes }) {
      let list = []
      let guidList = []
      let allNodes = [...checkedNodes, halfCheckedNodes]
      allNodes.map(e => {
        if (e.type === 3) {
          list.push(e)
        }
        if (e.isFloor || e.isRoom) {
          guidList.push(...e.componentGuids)
        }
      })
      // console.log('----333------', guidList, _.uniqBy(guidList))
      this.formatBimArray(list, true, _.uniqBy(guidList))
    },
    // 处理bim数据
    formatBimArray(array, isChange = false, guidArray) {
      let selectMonomer = []
      array.map(e => {
        selectMonomer.push({
          id: e.viewId,
          modelName: e.title,
          modelUrl: `${location.origin}${axios.gis.defaults.baseURL}/noToken/basic/commonFile/get/fdht/bim_${e.viewId}/3d.svf`
        })
      })
      this.selectMonomer = selectMonomer
      if (isChange) {
        // 改变选择
        this.singleChange({ bimArray: this.selectMonomer, guidArray })
      } else {
        // 初始化
        this.bimInit(this.selectMonomer)
      }
    },
    // bim初始化
    bimInit(bimArray) {
      this.$refs.BIMRefAdd.bimInit(bimArray)
    },

    // 选择树
    singleChange({ bimArray, guidArray }) {
      this.$refs.BIMRefAdd.watchModal(bimArray, guidArray)
    },

    //单选点击
    changeRadio(node, data) {
      this.$refs.BIMRefAdd.watchModal([
        {
          id: data.viewId,
          modelName: data.title,
          modelUrl: `${location.origin}${axios.gis.defaults.baseURL}/noToken/basic/commonFile/get/fdht/bim_${data.viewId}/3d.svf`
        }
      ])
      this.checkedId = data.id
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;

  .list {
    flex: 0 0 240px;
  }
  .model {
    flex: 1;
    height: 700px;
  }
  /deep/ .el-tree-node__label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
