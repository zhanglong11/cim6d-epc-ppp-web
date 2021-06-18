<template>
  <div>
    <div class="wrap" :gutter="20">
      <el-form>
        <el-form-item label="进度文件名称" required>
          <el-input v-model="form.scheduleFileName"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="进度文件" required>
          <Upload v-model="file" accept=".mpp" raw @input="handleUpload"></Upload>
        </el-form-item>
        <el-form-item>
          <el-button v-promise-btn type="primary" :disabled="!((file || id) && form.scheduleFileName)" @click="submit">
            {{ id ? '更新' : '创建' }}
          </el-button>
        </el-form-item>
      </el-form>

      <Gantt
        ref="gantt"
        ganttId="addGantt"
        isAdd
        unicode=""
        style="height: 800px; width: calc(100% - 350px)"
        @changeMilestone="changeMilestone"
      ></Gantt>
    </div>
  </div>
</template>

<script>
import './components/Gantt'
import Gantt from './components/Gantt'
import api from '../api'
import { ganttData2customData, customData2ganttData } from '@/views/epcPpp/schedule/view/utils'

export default {
  name: 'ScheduleAdd',
  components: {
    Gantt
  },
  data() {
    return {
      // 表单数据
      form: {},
      // 文件
      file: null,
      id: this.$route.params.id,
      showGantt: true,
      selectMilestoneFlag: [] // 选择的里程碑
    }
  },
  created() {
    // location.reload()
    if (this.id) {
      this.refresh()
      this.form = this.$route.query
      this.form.unicode = this.id
    }
    this.$nextTick(() => {
      console.log(222, this.$refs.gantt)
    })
  },
  beforeDestroy() {
    this.showGantt = false
    console.log('add', this.showGantt)
  },
  methods: {
    refresh() {
      api.getScheduleTaskList({ unicode: this.id, projectId: localStorage.getItem('projectId') }).then(res => {
        this.$refs.gantt.setData(customData2ganttData(res.data))
      })
    },
    //处理上传
    handleUpload(file) {
      if (file) {
        let formData = new FormData()
        formData.append('file', file)
        api.importScheduleFile(formData).then(res => {
          this.$refs.gantt.setData(customData2ganttData(res.data))
        })
      } else {
        this.$refs.gantt.setData({ data: [], links: [] })
      }
    },
    // 选择里程碑回调
    changeMilestone(array) {
      this.selectMilestoneFlag = array
    },
    //提交
    async submit() {
      let ganttData = this.$refs.gantt.getData()
      let ganttDataList = ganttData2customData(ganttData)
      ganttDataList.taskList.map(item => {
        item.milestoneFlag = this.selectMilestoneFlag.includes(item.taskUniqueId) ? 1 : 0
      })
      let form = { ...this.form, ...ganttDataList }
      await api.submitSchedulePlan(form)
      this.$message.success('成功')
      this.$router.push('/schedule/view')
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;
}
.el-form {
  margin-right: 20px;
  flex: 1 0 350px;
}
</style>
