<template>
  <el-card>
    <div class="custom-card-header">
      <span class="title">未完成进度计划</span>
      <div class="card-form">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="queryForm.startDate"
              value-format="yyyy-MM-dd 00:00:00"
              type="date"
              placeholder="计划开始时间"
              @change="queryScheduleUnfinishedTaskList"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryForm.endDate"
              value-format="yyyy-MM-dd 23:59:59"
              type="date"
              placeholder="计划结束时间"
              @change="queryScheduleUnfinishedTaskList"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" placeholder="进度名称/进度文件名称">
              <el-button slot="append" icon="el-icon-search" @click="queryScheduleUnfinishedTaskList"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="unfinished-con">
      <div class="unfinished-th">
        <span class="name">计划名称</span>
        <span class="receive-person">领取人</span>
        <span class="action">操作</span>
      </div>
      <ul class="unfinished-plan">
        <li v-for="items in unfinishedPlan" :key="items.planStartDate">
          <p class="plan-date" :class="{ 'is-delay': items.isDelay === 1 }">
            计划开始时间：{{ items.planStartDate | formatData }}
          </p>
          <div
            v-for="item in items.baseList"
            :key="item.taskId"
            class="plan-children"
            :class="{ receive: item.status === 1, 'is-delay': items.isDelay === 1 }"
          >
            <p class="name" :class="{ 'is-delay': item.isDelay === 1 }">
              {{ item.taskName }}
            </p>
            <p class="receive-person">{{ item.status === 1 ? item.receivePersonName : '' }}</p>
            <p class="status">{{ item.status === 1 ? '已领取' : '' }}</p>
            <el-button v-if="item.status !== 1" type="primary" size="mini" @click="receive(item)">领取</el-button>
          </div>
        </li>
        <li v-if="unfinishedPlan.length === 0" class="no-data">暂无数据</li>
      </ul>
    </div>
  </el-card>
</template>

<script>
import { homeApi } from '../api'
export default {
  components: {},
  data() {
    //这里存放数据
    return {
      queryForm: {
        startDate: '',
        endDate: '',
        keyWord: '',
        status: 2
      },
      unfinishedPlan: []
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
      this.queryScheduleUnfinishedTaskList()
    },
    // 查询未完成进度计划
    async queryScheduleUnfinishedTaskList() {
      this.queryForm.projectId = this.projectId
      let result = await homeApi.queryScheduleUnfinishedTaskList(this.queryForm)
      let datas = result.data || []
      this.unfinishedPlan = datas
    },
    // 领取
    receive(item) {
      this.$confirm(
        `您确定领取 <b>${item.taskName}</b> 进度任务吗？<p style="font-size: 12px; color:red;">一旦领取将无法撤销，且别人也将无法领取该 任务，请慎重！</p>`,
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
          this.getScheduleTaskReceive(item.taskId)
        })
        .catch(() => {})
    },
    // 领取任务
    async getScheduleTaskReceive(taskId) {
      if (!taskId) {
        return
      }
      await homeApi.getScheduleTaskReceive(taskId)
      this.$message({
        type: 'success',
        message: '领取成功!'
      })
      this.$emit('taskReceive')
      this.queryScheduleUnfinishedTaskList()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common');
.unfinished-con {
  background: #f2f5f9;
  border-radius: 4px;
  padding: 0 0 15px;
  position: relative;
  z-index: 2;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 15px;
    width: 2px;
    height: 100%;
    background: #437abf;
    z-index: -1;
  }
  .unfinished-th {
    padding: 10px 25px 10px 40px;
    display: flex;
    color: #909399;
    font-size: 13px;
    font-weight: bold;
    border-bottom: 1px #e4e6ea solid;
    background: #f2f5f9;
    border-radius: 10px;
    .name {
      flex: 1;
    }
    .receive-person,
    .action {
      width: 80px;
      text-align: center;
    }
  }
}
.unfinished-plan {
  padding: 0 15px 0 30px;
  height: 738px;
  overflow-y: auto;
  .scrollbar;
  li {
    margin-bottom: 15px;
    font-size: 14px;
    .plan-date {
      font-size: 16px;
      padding: 10px 0;
    }
    .is-delay {
      color: #eb3a3a;
    }
    .plan-children {
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      min-height: 60px;
      padding: 10px;
      background: #fff;
      border-radius: 10px;
      font-size: 12px;
      position: relative;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
      &:before {
        content: '';
        width: 10px;
        height: 10px;
        background: #fff;
        border: 2px #437abf solid;
        border-radius: 50%;
        left: -19px;
        position: absolute;
        z-index: 2;
      }
      .name {
        flex: 1;
      }
      .receive-person,
      .status {
        color: #999;
        width: 80px;
        text-align: center;
      }
      &.receive {
        &:before {
          border-color: #21c45e;
        }
      }
      &.is-delay {
        &:before {
          border-color: #eb3a3a;
        }
      }
    }
    &.no-data {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 14px;
      margin: 0;
      padding: 0;
    }
  }
}
</style>
