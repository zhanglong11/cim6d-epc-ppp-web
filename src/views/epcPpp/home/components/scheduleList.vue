<template>
  <div>
    <div class="tab-body">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="keyWord" placeholder="进度名称">
            <el-button slot="append" icon="el-icon-search" @click="queryScheduleTaskOwnList"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table :data="scheduleList" height="316" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="taskName" label="进度计划" min-width="300"> </el-table-column>
        <el-table-column prop="planStartDate" label="计划时间" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.planStartDate | formatData }} ~
            {{ scope.row.planEndDate | formatData }}
            <span v-if="scope.row.isDelay === 1">（已延期）</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="300" align="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 1" type="primary" size="mini" @click="assignTasks(scope.row)"
              >分配任务</el-button
            >
            <el-button type="success" size="mini" @click="endTasks(scope.row)">完成任务</el-button>
            <!-- <el-button v-if="scope.row.status === 1" type="success" size="mini" @click="startTasks(scope.row)"
              >开始任务</el-button
            >
            <el-button v-if="scope.row.status === 2" type="warning" size="mini" @click="endTasks(scope.row)"
              >结束任务</el-button
            >
             -->
            <el-dropdown>
              <el-button type="default" size="mini" style="margin-left: 10px">
                更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="extensionPlan(scope.row)">延期解决方案</el-dropdown-item>
                <el-dropdown-item @click.native="delayedAssociation(scope.row)">延后所有关联任务</el-dropdown-item>
                <el-dropdown-item @click.native="advanceAssociation(scope.row)">提前所有关联任务</el-dropdown-item>
                <el-dropdown-item @click.native="distributionRecords(scope.row)">查看任务分配记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分配任务模态框 start -->
    <el-dialog title="分配任务" width="640px" :visible.sync="assignTasksModal.show">
      <el-form>
        <el-form-item label="任务名称" :label-width="formLabelWidth" required>
          {{ assignTasksModal.formData.taskName }}
        </el-form-item>
        <el-form-item label="计划时间" :label-width="formLabelWidth" required>
          {{ assignTasksModal.formData.planStartDate | formatData }} ~
          {{ assignTasksModal.formData.planEndDate | formatData }}
        </el-form-item>
        <el-form-item label="分配人" :label-width="formLabelWidth" required>
          <SelectUser
            :id.sync="assignTasksModal.formData.beDistributionPersonId"
            :value="
              assignTasksModal.formData.beDistributionPersonId
                ? {
                    id: assignTasksModal.formData.beDistributionPersonId,
                    label: assignTasksModal.formData.beDistributionPersonName
                  }
                : null
            "
            :name.sync="assignTasksModal.formData.beDistributionPersonName"
            :multiple="false"
            @input="changeUser"
          ></SelectUser>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="assignTasksModal.show = false">取消</el-button>
        <el-button :loading="assignTasksModal.loading" type="primary" @click="saveAssignTasks">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分配任务模态框 end -->

    <!-- 完成任务模态框 start -->
    <el-dialog title="完成任务" width="640px" :visible.sync="endTaskModal.show">
      <el-form>
        <el-form-item label="进度任务名称" :label-width="formLabelWidth">
          {{ endTaskModal.formData.taskName }}
        </el-form-item>
        <el-form-item label="计划开始时间" :label-width="formLabelWidth">
          {{ endTaskModal.formData.planStartDate | formatData }}
        </el-form-item>
        <el-form-item label="计划结束时间" :label-width="formLabelWidth">
          {{ endTaskModal.formData.planEndDate | formatData }}
        </el-form-item>
        <el-form-item label="实际开始时间" :label-width="formLabelWidth" required>
          <el-date-picker
            v-model="endTaskModal.formData.actualStartDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="请选择实际开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际结束时间" :label-width="formLabelWidth" required>
          <el-date-picker
            v-model="endTaskModal.formData.actualEndDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="请选择实际结束时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="endTaskModal.show = false">取消</el-button>
        <el-button :loading="endTaskModal.loading" type="primary" @click="saveEndTasks">确定</el-button>
      </div>
    </el-dialog>
    <!-- 完成任务模态框 end -->

    <!-- 延期解决方案模态框 start -->
    <el-dialog title="延期解决方案" width="640px" :visible.sync="extensionPlansModal.show">
      <el-form ref="extensionPlansRef" :model="extensionPlansModal.formData" :rules="extensionPlansModal.rules">
        <el-form-item label="解决方案详情" :label-width="formLabelWidth" prop="program">
          <el-input v-model="extensionPlansModal.formData.program" type="textarea" :rows="6" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="extensionPlansModal.show = false">取消</el-button>
        <el-button :loading="extensionPlansModal.loading" type="primary" @click="saveExtensionPlan">确定</el-button>
      </div>
    </el-dialog>
    <!-- 延期解决方案模态框 end -->

    <!-- 延后关联任务模态框 start -->
    <el-dialog title="延后所有关联进度" width="640px" :visible.sync="delayedAssociationModal.show">
      <el-form
        ref="delayedAssociationRef"
        :model="delayedAssociationModal.formData"
        :rules="delayedAssociationModal.rules"
      >
        <el-form-item label="延后时长" :label-width="formLabelWidth" prop="changeDays">
          <el-input v-model="delayedAssociationModal.formData.changeDays" type="number" placeholder="">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="延后原因" :label-width="formLabelWidth" prop="changeReason">
          <el-input
            v-model="delayedAssociationModal.formData.changeReason"
            type="textarea"
            :rows="4"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="关联进度" :label-width="formLabelWidth">
          <template v-for="(item, i) in delayedAssociationModal.formData.list">
            <el-tag v-if="i < 10" :key="i" style="margin: 0 10px 10px 0">{{ item.taskName }}</el-tag>
          </template>
          <p v-if="delayedAssociationModal.formData.list.length === 0">无</p>
          <p v-if="delayedAssociationModal.formData.list.length > 10">
            等共<b style="color: red">{{ delayedAssociationModal.formData.list.length }}</b
            >个后续进度。
          </p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="delayedAssociationModal.show = false">取消</el-button>
        <el-button :loading="delayedAssociationModal.loading" type="primary" @click="saveDelayedAssociation"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 延后关联任务模态框 end -->

    <!-- 提前关联任务模态框 start -->
    <el-dialog title="提前所有关联进度" width="640px" :visible.sync="advanceAssociationModal.show">
      <el-form
        ref="advanceAssociationRef"
        :model="advanceAssociationModal.formData"
        :rules="advanceAssociationModal.rules"
      >
        <el-form-item label="提前时长" :label-width="formLabelWidth" prop="changeDays">
          <el-input v-model="advanceAssociationModal.formData.changeDays" type="number" placeholder="">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="提前原因" :label-width="formLabelWidth" prop="changeReason">
          <el-input
            v-model="advanceAssociationModal.formData.changeReason"
            type="textarea"
            :rows="4"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="关联进度" :label-width="formLabelWidth">
          <template v-for="(item, i) in advanceAssociationModal.formData.list">
            <el-tag v-if="i < 10" :key="i" style="margin: 0 10px 10px 0">{{ item.taskName }}</el-tag>
          </template>
          <p v-if="advanceAssociationModal.formData.list.length === 0">无</p>
          <p v-if="advanceAssociationModal.formData.list.length > 10">
            等共<b style="color: red">{{ advanceAssociationModal.formData.list.length }}</b
            >个后续进度。
          </p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="advanceAssociationModal.show = false">取消</el-button>
        <el-button :loading="advanceAssociationModal.loading" type="primary" @click="saveAdvanceAssociation"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 提前关联任务模态框 end -->

    <!-- 任务分配记录模态框 start -->
    <el-dialog title="查看任务分配记录" width="640px" :visible.sync="distributionRecordsModal.show">
      <el-form>
        <el-form-item label="进度任务名称" :label-width="formLabelWidth">
          {{ distributionRecordsModal.formData.taskName }}
        </el-form-item>
        <el-form-item label="进度计划时间" :label-width="formLabelWidth">
          {{ distributionRecordsModal.formData.planStartDate | formatData }} ~
          {{ distributionRecordsModal.formData.planEndDate | formatData }}
        </el-form-item>
        <el-form-item label="领取人" :label-width="formLabelWidth">
          {{ distributionRecordsModal.formData.receivePersonName }} /
          {{ distributionRecordsModal.formData.receivePersonCompanyName }} /
          {{ distributionRecordsModal.formData.receiveTime }}
        </el-form-item>
      </el-form>
      <el-table :data="distributionRecordsModal.formData.recordList" height="316" style="width: 100%">
        <el-table-column prop="title" label="分配记录" min-width="300">
          <template slot-scope="scope">
            {{ scope.row.beDistributionPersonName }} /
            {{ scope.row.beDistributionPersonCompanyName }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="分配时间" min-width="150"> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="distributionRecordsModal.show = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 任务分配记录模态框 end -->
  </div>
</template>

<script>
import { homeApi } from '../api'
import { getDateStr } from '@/utils'
console.log(111, getDateStr(0))
export default {
  components: {},
  data() {
    return {
      formLabelWidth: '120px',
      keyWord: '',
      // 分配任务 模态框
      assignTasksModal: {
        show: false,
        loading: false,
        formData: {
          taskId: '',
          taskName: '进度文件名称-博物馆一层-一号房间-进度名称',
          planStartDate: '',
          planEndDate: '',
          createTime: '20200815-20200819',
          beDistributionPersonId: '',
          beDistributionPersonName: '',
          beDistributionPersonCompanyId: ''
        }
      },
      // 完成任务 模态框
      endTaskModal: {
        show: false,
        loading: false,
        formData: {
          taskId: '',
          taskName: '进度文件名称-博物馆一层-一号房间-进度名称',
          planStartDate: '',
          planEndDate: '',
          actualStartDate: '',
          actualEndDate: getDateStr(0)
        }
      },
      // 延期解决方案 模态框
      extensionPlansModal: {
        show: false,
        loading: false,
        formData: {
          program: '',
          taskId: ''
        },
        rules: {
          program: [{ required: true, message: '请输入解决方案详情', trigger: 'blur' }]
        }
      },
      // 延后关联任务 模态框
      delayedAssociationModal: {
        show: false,
        loading: false,
        formData: {
          changeDays: '',
          changeReason: '',
          relatedTaskUniqueIdList: [],
          taskId: '',
          type: 0,
          list: []
        },
        rules: {
          changeDays: [{ required: true, message: '请输入延后时长', trigger: 'blur' }],
          changeReason: [{ required: true, message: '请输入延后原因', trigger: 'blur' }]
        }
      },
      // 提前关联任务 模态框
      advanceAssociationModal: {
        show: false,
        loading: false,
        formData: {
          changeDays: '',
          changeReason: '',
          relatedTaskUniqueIdList: [],
          taskId: '',
          type: 1,
          list: []
        },
        rules: {
          changeDays: [{ required: true, message: '请输入提前时长', trigger: 'blur' }],
          changeReason: [{ required: true, message: '请输入提前原因', trigger: 'blur' }]
        }
      },
      // 任务分配记录 模态框
      distributionRecordsModal: {
        show: false,
        formData: {}
      },
      // 我领取的进度计划
      scheduleTotal: 0,
      scheduleList: []
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      this.queryScheduleTaskOwnList()
    },
    // 判断是否延期
    tableRowClassName({ row, rowIndex }) {
      if (row.isDelay === 1) {
        return 'delay-row'
      } else {
        return ''
      }
    },
    // 查询个人进度计划
    async queryScheduleTaskOwnList() {
      let params = {
        projectId: this.projectId,
        keyWord: this.keyWord
      }
      let result = await homeApi.queryScheduleTaskOwnList(params)
      let datas = result.data || []
      this.scheduleList = datas
      this.scheduleTotal = datas.length
      console.log(111, datas)
      this.$emit('change', this.scheduleTotal)
    },
    // 分配任务
    assignTasks(item) {
      // console.log('分配任务', item)
      this.assignTasksModal.formData.taskId = item.taskId
      this.assignTasksModal.formData.taskName = item.taskName
      this.assignTasksModal.formData.planStartDate = item.planStartDate
      this.assignTasksModal.formData.planEndDate = item.planEndDate
      this.assignTasksModal.formData.beDistributionPersonId = ''
      this.assignTasksModal.formData.beDistributionPersonName = ''
      this.assignTasksModal.formData.beDistributionPersonCompanyId = ''
      this.assignTasksModal.show = true
    },
    // 选择分配人
    changeUser(e) {
      if (!e) {
        return
      }
      this.assignTasksModal.formData.beDistributionPersonId = e.userId || ''
      this.assignTasksModal.formData.beDistributionPersonName = e.name || ''
      this.assignTasksModal.formData.beDistributionPersonCompanyId = e.companyId || ''
    },
    // 确定分配任务
    async saveAssignTasks() {
      if (!this.assignTasksModal.formData.beDistributionPersonId) {
        this.$message.error('请选择分配人！')
        return
      }
      try {
        this.assignTasksModal.loading = true
        await homeApi.distributionScheduleTask(this.assignTasksModal.formData)
        this.$message({
          type: 'success',
          message: '分配成功!'
        })
        this.assignTasksModal.loading = false
        this.assignTasksModal.show = false
        this.init()
      } catch (e) {
        this.assignTasksModal.loading = false
      }
    },
    // 开始任务
    startTasks(item) {
      this.$confirm(
        `确定要开始 <b>${item.taskName}</b> 任务？<p style="font-size: 12px; color:red;">开始后无法分配任务！</p>`,
        '提示',
        {
          title: '温馨提示',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: ''
        }
      )
        .then(() => {
          this.startScheduleTask(item.taskId)
        })
        .catch(() => {})
    },
    // 开始任务 - 异步
    async startScheduleTask(taskId) {
      await homeApi.startScheduleTask(taskId)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.init()
    },
    // 完成任务
    endTasks(item) {
      this.endTaskModal.show = true
      this.endTaskModal.formData.taskId = item.taskId
      this.endTaskModal.formData.taskName = item.taskName
      this.endTaskModal.formData.planStartDate = item.planStartDate
      this.endTaskModal.formData.planEndDate = item.planEndDate
      this.endTaskModal.formData.actualStartDate = item.planStartDate
      this.endTaskModal.formData.actualEndDate = getDateStr(0)
    },
    // 完成任务 - 异步
    async saveEndTasks() {
      try {
        if (!this.endTaskModal.formData.actualStartDate) {
          this.$message.error('请选择实际开始时间！')
          return
        }
        if (!this.endTaskModal.formData.actualEndDate) {
          this.$message.error('请选择实际结束时间！')
          return
        }
        this.endTaskModal.loading = true
        await homeApi.confirmTask(this.endTaskModal.formData)
        this.endTaskModal.loading = false
        this.endTaskModal.show = false
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.init()
        this.parentEndTask()
      } catch (e) {
        this.endTaskModal.loading = false
      }
    },
    // 结束任务
    parentEndTask() {
      this.$emit('endTask')
    },
    // 延期解决方案
    extensionPlan(item) {
      this.extensionPlansModal.show = true
      this.extensionPlansModal.formData.taskId = item.taskId
      this.extensionPlansModal.formData.program = ''
    },
    // 保存延期解决方案
    saveExtensionPlan() {
      this.$refs['extensionPlansRef'].validate(valid => {
        if (valid) {
          this.delayProgram()
        }
      })
    },
    // 延期解决方案-提交
    async delayProgram() {
      try {
        this.extensionPlansModal.loading = true
        await homeApi.delayProgram(this.extensionPlansModal.formData)
        this.extensionPlansModal.loading = false
        this.extensionPlansModal.show = false
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$refs['extensionPlansRef'].resetFields()
        this.init()
      } catch (e) {
        this.extensionPlansModal.loading = false
      }
    },
    // 延后关联任务
    delayedAssociation(item) {
      this.delayedAssociationModal.show = true
      this.delayedAssociationModal.formData.type = 0
      this.delayedAssociationModal.formData.taskId = item.taskId
      this.delayedAssociationModal.formData.changeDays = ''
      this.delayedAssociationModal.formData.changeReason = ''
      this.queryTaskLink(item.taskId)
    },
    // 查询关联任务列表
    async queryTaskLink(taskId) {
      let result = await homeApi.queryTaskLink(taskId)
      let datas = result.data || []
      this.delayedAssociationModal.formData.list = datas
      this.delayedAssociationModal.formData.relatedTaskUniqueIdList = _.map(datas, 'taskUniqueId')
      this.advanceAssociationModal.formData.list = datas
      this.advanceAssociationModal.formData.relatedTaskUniqueIdList = _.map(datas, 'taskUniqueId')
    },
    // 保存延后关联任务
    saveDelayedAssociation() {
      this.$refs['delayedAssociationRef'].validate(valid => {
        if (valid) {
          this.changeDurationTask(this.delayedAssociationModal)
        }
      })
    },
    // 保存延后关联任务 - 异步
    async changeDurationTask(params) {
      try {
        params.loading = true
        await homeApi.changeDurationTask(params.formData)
        params.loading = false
        params.show = false
        this.init()
        this.$refs['delayedAssociationRef'].resetFields()
      } catch (e) {
        params.loading = false
      }
    },
    // 提前关联任务
    advanceAssociation(item) {
      this.advanceAssociationModal.show = true
      this.advanceAssociationModal.formData.type = 1
      this.advanceAssociationModal.formData.taskId = item.taskId
      this.advanceAssociationModal.formData.changeDays = ''
      this.advanceAssociationModal.formData.changeReason = ''
      this.queryTaskLink(item.taskId)
    },
    // 保存提前关联任务
    saveAdvanceAssociation() {
      this.$refs['advanceAssociationRef'].validate(valid => {
        if (valid) {
          this.changeDurationTask(this.advanceAssociationModal)
        }
      })
    },
    // 查看任务分配记录
    async distributionRecords(item) {
      this.distributionRecordsModal.show = true
      let result = await homeApi.recordDistributionTask(item.taskId)
      let datas = result.data
      datas.recordList = datas.recordList || []
      this.distributionRecordsModal.formData = datas
      console.log('查看任务分配记录', datas)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.delay-row {
  color: #f56c6c;
}
</style>
