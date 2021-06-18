<template>
  <div class="main">
    <div class="task-list-wrap">
      <el-card class="box-card aside">
        <div slot="header" class="clearfix">
          <span>单体楼层</span>
        </div>
        <TreeData type="space" @handleCheckChange="singleChange" />
      </el-card>
      <div class="box-card task-list" style="padding: 0">
        <BIM ref="BIM" idSelect="progress" class="bim-box-progress" />
      </div>
    </div>
    <div class="task-list-wrap" style="margin-top: 10px">
      <el-card class="box-card aside">
        <div slot="header" class="clearfix">
          <span>专业构件</span>
        </div>
        <TreeData type="special" @handleCheckChange="specialChange" />
      </el-card>
      <div class="task-list">
        <div class="headContainer">
          <div class="formWrapper">
            <el-form ref="taskForm" :inline="true" :model="taskForm">
              <div>
                <el-form-item label="选择计划" label-width="100px" prop="keyword" style="margin-right: 20px">
                  <el-select v-model="taskForm.schedule" placeholder="请选择">
                    <el-option v-for="item in scheduleList" :key="item.month" :label="item.label" :value="item.month">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关联状态" label-width="100px" prop="bindFlag" style="margin-right: 20px">
                  <el-select v-model="taskForm.bindFlag" placeholder="请选择">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label label-width="0" prop="search" style="margin-right: 20px">
                  <el-input v-model="taskForm.search" placeholder="任务编号/任务名称" style="width: 200px">
                    <i slot="suffix" class="el-icon-search"></i>
                  </el-input>
                </el-form-item>
                <el-form-item label label-width="0">
                  <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                  <el-button @click="reset">重置</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <vxe-table
          ref="xTable"
          border
          max-height="500px"
          tree-config
          :data="tableData"
          resizable
          row-id="taskUniqueId"
          :edit-config="{ trigger: 'manual', mode: 'row' }"
          :loading="loading"
        >
          <vxe-table-column title="任务编号" type="seq" tree-node></vxe-table-column>
          <vxe-table-column title="任务名称" field="name"></vxe-table-column>
          <vxe-table-column title="里程碑" field="type">
            <template slot-scope="{ row }">
              <span v-if="row.type == 2" class="el-icon-check"></span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="bindFlag" title="关联状态"
            ><template slot-scope="{ row }">
              <span>{{ row.bindFlag == '1' ? '已关联' : '未关联' }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作">
            <template slot-scope="{ row }">
              <template v-if="row.bindFlag == '1'">
                <span v-if="$hasPower('removeProcessRelated')" style="margin: 0 3px"
                  ><a @click="handleUnbind(row.id)">取消关联</a></span
                >
                <span v-if="$hasPower('relatedDetail')" style="margin: 0 3px"><a @click="watchLink(row)">查看</a></span>
              </template>
              <template v-else>
                <span v-if="$hasPower('processRelated')" style="margin: 0 3px"
                  ><a href="javascript:;" @click="handleBind(row.id)">关联</a></span
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
import TreeData from '../components/TreeData'
import Api from '@/api/model/progress'
import statusList from '@/lib/paramList/statusList'
import bimMixin from '@/mixins/bimMixin.js'
import Relevance from '_c/Relevance/index.vue'
import toTree from '@/utils/toTree'
export default {
  name: 'Progress',
  components: {
    Relevance,
    TreeData
  },
  mixins: [bimMixin],
  data() {
    return {
      loading: false,
      scheduleList: [],
      statusList,
      filter: {},
      taskForm: {
        projectId: localStorage.getItem('projectId')
      },
      tableData: []
    }
  },
  created() {
    this.refresh()
    this.getTaskList()
  },
  mounted() {},
  methods: {
    /*
     * @任务编号: 2522 || 树与模型交互:左侧树获取选中数据，属选择数据存储在vuex中
     * @开发人员:申豪强
     * @日期:2020-03-20
     * @任务类型: 新代码
     */
    singleChange(e) {
      this.$store.commit('bim/changeSingle', e)
    },
    specialChange(e) {
      this.$store.commit('bim/changeMajor', e)
    },
    relevance() {
      // this.$refs.relevance.show()
    },
    goHome() {
      this.bimfishApp.backToHome()
      console.log(this.bimfishApp)
      // this.load3dviewer('/models/V2/3d.svf')
    },
    async refresh() {
      let res = await Api.getComponentBindTaskList(this.taskForm)
      let list = toTree(res.data, 'parentTaskUniqueId', 'planStartTime', 'taskUniqueId')
      this.tableData = list
    },
    async getTaskList() {
      let res = await this.axios.schedule.get('construct/plan/taskList/' + localStorage.getItem('projectId'))
      let yearList = []
      res.data.taskList
        .filter(e => !e.parentTaskUniqueId)
        .forEach(e => {
          let year = moment(e.planStartTime).year()
          let month = moment(e.planStartTime).month() + 1
          let target = _.find(yearList, { year })
          if (target) {
            target.children.push(month)
          } else {
            yearList.push({
              year,
              children: [month]
            })
          }
        })
      yearList.forEach(e => {
        e.label = e.year + '年进度计划'
        e.children = _.union(e.children).map(month => ({
          label: e.year + '年' + month + '月计划',
          year: e.year,
          month
        }))
      })
      this.scheduleList = yearList[0].children
    },
    reset() {
      this.$refs.taskForm.resetFields()
      this.refresh()
    },
    async handleBind(id) {
      this.loading = true
      let componentList = await this.$refs.BIM.relevance()
      if (componentList.length === 0) {
        this.loading = false
        return this.$message.error('请先选择构件')
      }
      let param = {
        projectId: localStorage.getItem('projectId'),
        componentList: componentList,
        scheduleId: id
      }
      let res = await Api.componentBind(param)
      this.loading = false
      this.$message.success('关联成功')
      this.refresh()
    },
    watchLink(row) {
      if (row.componentIdList.length) {
        this.$refs.BIM.showModelByGuids(row.componentIdList)
      }
    },
    async handleUnbind(id) {
      let res = await Api.componentCancelBind(id)
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
  .task-list-wrap {
    display: flex;
    .aside {
      flex: 0 0 320px;
      max-height: 500px;
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
      min-height: 560px;
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
