<template>
  <div class="no-padding">
    <div class="wrap">
      <el-card class="aside" header="已上传进度文件">
        <template #header>
          <span>已上传进度文件</span>
          <el-button
            v-if="$hasPower('EpcPppScheduleAdd')"
            style="float: right"
            type="primary"
            @click="$router.push('view/add')"
            >新增进度文件</el-button
          >
        </template>
        <ul class="nav-list">
          <li
            v-for="e in navList"
            :key="e.unicode"
            :class="{ active: activeFile.unicode === e.unicode }"
            @click="activeFile = e"
          >
            <div>
              <p>{{ e.scheduleFileName }}</p>
              <p class="sub">
                {{ e.createTime }} <span style="margin-left: 30px">{{ e.creatorName }}</span>
              </p>
            </div>
            <div class="btn-group">
              <el-button v-if="$hasPower('EpcPppScheduleRemove')" type="danger" size="mini" @click="remove(e)">
                删除
              </el-button>
              <!--黄总说先屏蔽更新按钮-->
              <!--<el-button
                @click="$router.push({ path: 'view/edit/' + e.unicode, query: _.pick(e, ['scheduleFileName', 'remark']) })"
              >
                更新
              </el-button>-->
            </div>
          </li>
        </ul>
      </el-card>
      <el-card style="flex: 1" header="进度文件" class="gantt-card">
        <template #header>
          <h6>{{ activeFile.scheduleFileName || '进度文件' }}</h6>
          <ul>
            <li>
              <span>合计：</span><span>{{ activeFile.taskCount }}条</span>
            </li>
            <li>
              <span>未领取：</span><span>{{ activeFile.taskCount - activeFile.receivedCount }}</span>
            </li>
            <li>
              <span>已领取：</span><span>{{ activeFile.receivedCount }}</span>
            </li>
            <li>
              <span>超前完成：</span><span>{{ activeFile.advanceCount }}</span>
            </li>
            <li>
              <span>正常完成：</span><span>{{ activeFile.normalCount }}</span>
            </li>
            <li>
              <span>滞后完成：</span><span>{{ activeFile.delayCount }}</span>
            </li>
          </ul>
        </template>
        <el-button
          v-if="$hasPower('EpcPppScheduleEdit')"
          v-promise-btn
          style="float: left"
          type="primary"
          :disabled="!activeFile.unicode"
          @click="save"
          >保存</el-button
        >
        <Gantt ref="gantt" :unicode="activeFile.unicode" style="height: 800px" @refresh="getGanttData"></Gantt>
      </el-card>
    </div>
  </div>
</template>

<script>
import Gantt from './components/Gantt'
import api from '../api'
import { ganttData2customData, customData2ganttData } from '@/views/epcPpp/schedule/view/utils'

export default {
  name: 'ScheduleView',
  components: {
    Gantt
  },
  data: function () {
    return {
      //左侧列表
      navList: [],
      //选中的进度文件
      activeFile: {},
      // 甘特图中的任务列表
      taskList: [],
      showGantt: true
    }
  },
  watch: {
    activeFile(val) {
      if (val.unicode) {
        localStorage.setItem('lastActiveScheduleUnicode', val.unicode)
        this.getGanttData()
      }
    }
  },
  created() {
    this.refresh()
  },
  beforeDestroy() {
    this.showGantt = false
    console.log('list', this.showGantt)
  },
  methods: {
    // 刷新
    refresh() {
      api.getSchedulePlanList({ projectId: localStorage.getItem('projectId') }).then(res => {
        this.navList = res.data
        const lastActiveUnicode = localStorage.getItem('lastActiveScheduleUnicode')
        const target = _.find(res.data, { unicode: lastActiveUnicode })
        if (target) {
          this.activeFile = target
        } else {
          if (res.data.length) {
            this.activeFile = _.first(res.data)
          }
        }
      })
    },
    // 获取进度文件的甘特图数据
    getGanttData() {
      api
        .getScheduleTaskList({ unicode: this.activeFile.unicode, projectId: localStorage.getItem('projectId') })
        .then(res => {
          console.log(111, res.data)
          this.$refs.gantt.setData(customData2ganttData(res.data))
          this.taskList = res.data.baseList
        })
    },
    // 保存进度文件
    save() {
      let ganttData = this.$refs.gantt.getData()
      return api
        .submitSchedulePlan({
          unicode: this.activeFile.unicode,
          scheduleFileName: this.activeFile.scheduleFileName,
          ...ganttData2customData(ganttData)
        })
        .then(res => {
          this.$message.success('保存成功')
          this.refresh()
        })
    },
    // 删除进度文件
    remove(item) {
      this.$confirm(`确定要删除进度文件 ${item.scheduleFileName} 吗?`, '提示').then(() => {
        api.removeSchedulePlanById(item.unicode).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;
  .aside {
    margin-right: 20px;
    width: 300px;
    /deep/ .el-card__body {
      padding: 0;
    }
    .nav-list {
      li {
        border-bottom: 1px solid #ccc;
        padding: 10px 15px;
        position: relative;
        border-left: 5px solid transparent;
        align-items: flex-start;
        display: flex;
        justify-content: space-between;
        p.sub {
          color: #999;
          font-size: 13px;
          margin-top: 5px;
        }
        &.active {
          border-left: 5px solid #3db9d3;
        }
        .btn-group {
          display: flex;
          flex-direction: column;
        }
        .el-button {
          flex: 0 0;
          padding: 4px 8px;
          margin-left: 0;
          & + .el-button {
            margin-top: 10px;
          }
        }
      }
    }
  }
  .gantt-card {
    /deep/ .el-card__header {
      display: flex;
      align-items: center;
      ul {
        margin-left: 25px;
        display: flex;
        font-size: 13px;
        li {
          margin-left: 25px;
        }
      }
    }
  }
}
</style>
