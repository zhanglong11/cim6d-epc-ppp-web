<template>
  <div class="main">
    <div class="task-list-wrap">
      <el-card class="aside">
        <div slot="header" class="clearfix">
          <span>单体楼层</span>
        </div>
        <TreeData type="space" isFloor :height="500" @checkChange="singleChange" @bimInit="bimInit" />
      </el-card>
      <div class="task-list" style="padding: 0">
        <BimShow ref="BIMRef" idSelect="progress" :isLoadAll="false" isBoxSelect class="bim-box-progress" />
        <!-- <BIM ref="BIM" auto-change-model idSelect="progress" class="bim-box-progress" /> -->
      </div>
    </div>
    <div class="task-list-wrap" style="margin-top: 10px">
      <el-card class="aside">
        <div slot="header" class="clearfix">
          <span>专业构件</span>
        </div>
        <TreeData type="special" isFloor :isSelectFirst="false" @checkChange="specialChange" />
      </el-card>
      <div class="task-list">
        <div class="headContainer">
          <div class="formWrapper">
            <el-form ref="filterForm" :inline="true">
              <div>
                <el-form-item label="选择计划" label-width="100px" style="margin-right: 20px">
                  <el-select v-model="filterForm.unicode" placeholder="请选择">
                    <el-option
                      v-for="item in planList"
                      :key="item.unicode"
                      :label="item.scheduleFileName"
                      :value="item.unicode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关联状态" label-width="100px" style="margin-right: 20px">
                  <el-select v-model="filterForm.isBind" placeholder="请选择">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="0" style="margin-right: 20px">
                  <el-input v-model="filterForm.keyWord" placeholder="任务编号/任务名称" style="width: 200px">
                    <i slot="suffix" class="el-icon-search"></i>
                  </el-input>
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                  <el-button @click="reset">重置</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <vxe-table
          ref="xTable"
          v-loading="loading"
          border
          max-height="500px"
          tree-config
          :data="tableData"
          resizable
          row-id="taskId"
          :edit-config="{ trigger: 'manual', mode: 'row' }"
        >
          <vxe-table-column title="任务编号" type="seq" tree-node width="120"></vxe-table-column>
          <vxe-table-column title="任务名称" field="taskName"></vxe-table-column>
          <vxe-table-column
            field="isBind"
            title="关联状态"
            width="200"
            :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
          >
          </vxe-table-column>
          <vxe-table-column title="操作">
            <template v-if="_.isEmpty(row.children) && row.parentTaskUniqueId" slot-scope="{ row }">
              <template v-if="row.isBind === 1">
                <el-button v-if="$hasPower('EpcPppScheduleTaskUnbindBim')" type="text" @click="handleUnbind(row.taskId)"
                  >取消关联</el-button
                >
                <el-button type="text" @click="watchLink(row)">查看</el-button>
              </template>
              <template v-else>
                <el-button v-if="$hasPower('EpcPppScheduleTaskBindBim')" type="text" @click="handleBind(row.taskId)"
                  >关联</el-button
                >
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <Relevance ref="relevance" />
    </div>
  </div>
</template>

<script>
import api from './api'
import statusList from '@/lib/paramList/statusList'
import bimMixin from '@/mixins/bimMixin.js'
import Relevance from '_c/Relevance/index.vue'
import toTree from '@/utils/toTree'
import TreeData from '../home/components/TreeData'
import BimShow from '../home/components/bimShow'
export default {
  name: 'ScheduleBimRelated',
  components: {
    Relevance,
    TreeData,
    BimShow
  },
  mixins: [bimMixin],
  data() {
    return {
      loading: false,
      planList: [],
      statusList,
      filter: {},
      filterForm: {
        projectId: localStorage.getItem('projectId'),
        unicode: null
      },
      tableData: [],
      // 存储树选择数据
      treeDataParams: {
        // 单体楼层
        single: {
          bimArray: [],
          guidArray: []
        },
        // 专业构件
        special: {
          bimArray: [],
          guidArray: []
        }
      }
    }
  },
  watch: {
    'filterForm.unicode'() {
      this.refresh()
    }
  },
  created() {
    this.getPlanList()
  },
  mounted() {},
  methods: {
    // 选择树
    singleChange({ bimArray, guidArray }) {
      this.treeDataParams.single.bimArray = bimArray
      this.treeDataParams.single.guidArray = guidArray
      this.bimRender()
    },
    // bim初始化
    bimInit(bimArray) {
      this.treeDataParams.single.bimArray = bimArray
      this.$refs.BIMRef.bimInit(bimArray)
    },
    // 选择专业构件
    specialChange({ bimArray, guidArray }) {
      this.treeDataParams.special.bimArray = bimArray
      this.treeDataParams.special.guidArray = guidArray
      this.bimRender()
    },
    // 重新渲染bim模型
    bimRender() {
      let bimArray = this.treeDataParams.single.bimArray
      let guidArray = []
      // 获取选择的单体楼层Guid
      if (this.treeDataParams.single.guidArray.length > 0) {
        guidArray = this.treeDataParams.single.guidArray
      }
      // 获取选择的专业构件Guid
      if (this.treeDataParams.special.guidArray.length > 0) {
        guidArray = this.treeDataParams.special.guidArray
      }
      // 判断是否需要获取交集数据
      if (this.treeDataParams.single.guidArray.length > 0 && this.treeDataParams.special.guidArray.length > 0) {
        guidArray = _.intersection(this.treeDataParams.single.guidArray, this.treeDataParams.special.guidArray)
      }
      // console.log('重新渲染bim模型', bimArray, guidArray)
      this.$refs.BIMRef.watchModal(bimArray, guidArray)
    },
    relevance() {
      // this.$refs.relevance.show()
    },
    goHome() {
      this.bimfishApp.backToHome()
      // this.load3dviewer('/models/V2/3d.svf')
    },
    async refresh() {
      if (this.filterForm.unicode) {
        await api.getScheduleTaskList(this.filterForm).then(res => {
          this.tableData = toTree(res.data.baseList, 'parentTaskUniqueId', null, 'taskUniqueId')
        })
      }
    },
    async getPlanList() {
      api.getSchedulePlanList({ projectId: localStorage.getItem('projectId') }).then(res => {
        this.planList = res.data
        this.filterForm.unicode = _.first(res.data)?.unicode
      })
    },
    reset() {
      this.filterForm.isBind = undefined
      this.filterForm.keyWord = undefined
      this.refresh()
    },
    async handleBind(id) {
      this.loading = true
      let componentList = await this.$refs.BIMRef.relevance()
      if (componentList.length === 0) {
        this.loading = false
        return this.$message.error('请先选择构件')
      }
      console.log(componentList)
      let body = {
        projectId: localStorage.getItem('projectId'),
        bindDTOList: [
          {
            componentIdList: _.map(componentList, 'componentId'),
            modelId: componentList[0].modelId
          }
        ],
        taskId: id
      }
      await api.scheduleTaskBindBim(body)
      this.loading = false
      this.$message.success('关联成功')
      this.refresh()
    },
    async watchLink(row) {
      const { componentIdList } = await api.getTaskBindBimById(row.taskId).then(res => res.data)
      console.log(componentIdList)
      this.$refs.BIMRef.showModelByGuids(componentIdList)
    },
    async handleUnbind(id) {
      await api.scheduleTaskUnBindBim(id)
      this.$message.success('取消关联成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
div.main {
  background-color: #f0f2f5;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
  min-height: unset;
  justify-content: space-between;
  .task-list-wrap {
    height: 48%;
    display: flex;
    flex: 1 0;
    .aside {
      flex: 0 0 320px;
      //max-height: 560px;
      margin-right: 10px;
      background-color: #fff;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d8d8d8;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-track-piece {
        background: transparent;
      }
    }
    .task-list {
      width: calc(100% - 320px);
      padding: 20px;
      background-color: #fff;
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
</style>
