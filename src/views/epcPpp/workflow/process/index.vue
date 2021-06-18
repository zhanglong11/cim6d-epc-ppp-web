<template>
  <div>
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="分类" prop="type">
          <SelectProcessCategory v-model="filterForm.processCategory"></SelectProcessCategory>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请搜索">
            <el-button slot="append" size="mini" icon="el-icon-search" @click="refresh(true)"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="filterForm.processStatus">
      <el-tab-pane label="进行中" name="0"></el-tab-pane>
      <el-tab-pane label="已结束" name="1"></el-tab-pane>
    </el-tabs>
    <Grid ref="table" auto-search :filter-form.sync="filterForm" :request="request">
      <vxe-table-column field="processDefinitionName" title="名称"></vxe-table-column>
      <vxe-table-column field="processInstanceStatus" title="流程状态"></vxe-table-column>
      <vxe-table-column field="currentTaskName" title="当前任务"></vxe-table-column>
      <vxe-table-column field="currentTaskStatus" title="当前任务状态"></vxe-table-column>
      <vxe-table-column field="currentTaskAssignee" title="当前待办人"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button
            v-if="$hasPower('WorkflowProcessFlow')"
            size="mini"
            type="primary"
            @click="
              () => {
                activeProcess = row
                processTrackingDialogVisible = true
              }
            "
            >流程追踪</el-button
          >
          <el-button
            v-if="$hasPower('WorkflowProcessTask')"
            size="mini"
            type="warning"
            @click="
              () => {
                activeProcess = row
                taskListDialogVisible = true
              }
            "
            >任务列表</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <TaskList :process="activeProcess" :visible.sync="taskListDialogVisible"></TaskList>
    <el-dialog width="1200px" title="流程追踪" :visible.sync="processTrackingDialogVisible">
      <ProcessTrack :process="activeProcess"></ProcessTrack>
      <footer slot="footer">
        <el-button size="mini" @click="processTrackingDialogVisible = false">我知道了</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import TaskList from './components/TaskList'
import ProcessTrack from './components/ProcessTrack'
import SelectProcessCategory from '../components/SelectProcessCategory'
export default {
  name: 'Process',
  components: { TaskList, ProcessTrack, SelectProcessCategory },
  data() {
    return {
      taskListDialogVisible: false,
      processTrackingDialogVisible: false,
      activeProcess: {},
      filterForm: {
        processStatus: localStorage.getItem('lastSelectProcessStatus') || 0
      },
      request(body) {
        return this.axios.workflow.post('activiti/process/instance/list', body).then(res => res.data)
      }
    }
  },
  watch: {
    'filterForm.processStatus'(val) {
      localStorage.setItem('lastSelectProcessStatus', val)
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
