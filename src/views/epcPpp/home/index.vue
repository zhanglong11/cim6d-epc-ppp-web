<template>
  <div class="no-padding">
    <!-- 用户及项目信息 start -->
    <el-row :gutter="15">
      <el-col :md="14">
        <el-card class="user-con">
          <div class="user-info">
            <img
              :src="projectDetail.imageList ? projectDetail.imageList[0].fileUrl : require('./images/project.jpg')"
              class="project-avatar"
            />
            <div class="user-name project-data">
              <p class="project-title">{{ getTimeState() }}，欢迎您！</p>
              <p class="project-name">来到 {{ projectDetail.name }}</p>
            </div>
            <p class="login-num">
              <b>{{ userInfo.consecutiveLoginDay || 1 }}</b>
              <span>连续登陆系统天数</span>
            </p>
          </div>
          <div class="project-period">
            <span>
              开工日期：<b>{{ projectDetail.startTime | formatData }}</b>
            </span>
            <span>
              结束日期：<b>{{ projectDetail.endTime | formatData }}</b>
            </span>
            <span>
              计划工期：<b>{{ getDays(projectDetail.startTime, projectDetail.endTime) }}天</b>
            </span>
            <span>
              已进行：<b>{{ getDays(projectDetail.startTime, getDateStr(0)) }}天</b>
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :md="10">
        <el-card class="user-con">
          <div class="user-info">
            <div class="user-head">
              <img :src="userInfo.headImage ? userInfo.headImage : '/img/default-user.png'" class="user-avatar" />
              <el-button
                type="primary"
                class="upload-avatar"
                plain
                size="mini"
                icon="el-icon-plus"
                @click="uploadAvatarParams.show = true"
                >上传头像</el-button
              >
              <el-dialog title="上传头像" :visible.sync="uploadAvatarParams.show" width="30%">
                <ImageCrop
                  :width="300"
                  :height="300"
                  :action="uploadAvatarParams.action"
                  @change="e => (uploadAvatarParams.formData.headImage = e)"
                ></ImageCrop>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="uploadAvatarParams.show = false">取 消</el-button>
                  <el-button type="primary" :loading="uploadAvatarParams.btnLoading" @click="saveAvatar"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
            </div>

            <div class="user-name">
              <p>
                {{ userInfo.realName }}
              </p>
              <p class="desc">
                职位：{{ userInfo.position }}<br />
                电话：{{ userInfo.mobile }}
              </p>
              <el-button class="logout" type="primary" @click="logout">退出登录</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 用户及项目信息 end -->
    <div class="line-space"></div>
    <!-- 用户及项目信息 start -->
    <el-row :gutter="15">
      <el-col :md="8">
        <div v-if="weatherInfo.weather" class="weather">
          <div class="weather-province">
            <img v-if="weatherInfo.weatherPic" class="weather-pic" :src="weatherInfo.weatherPic" />
            <p>{{ weatherInfo.weather }}</p>
            <p class="high-low">{{ weatherInfo.highTemperature }}℃ / {{ weatherInfo.lowTemperature }}℃</p>
          </div>
          <div class="temperature-con">
            <div class="temperature">
              <p v-for="(item, i) in weatherInfo.alarmList" :key="i">
                <b>【{{ item.signalType }}】</b>{{ item.issueContent }}
              </p>
            </div>
            <div class="temperature-time">
              <p>
                实时空气质量
                <b>{{ weatherInfo.aqi }} {{ weatherInfo.quality }}</b>
              </p>
              <p>
                实时温度
                <b>{{ weatherInfo.temperature }}℃</b>
              </p>
            </div>
          </div>
          <div class="weather-footer">
            <p class="province">
              <span class="el-icon-location"></span>{{ weatherInfo.province }} {{ weatherInfo.city }}
            </p>
            <p>{{ weatherInfo.temperatureTime }}</p>
          </div>
        </div>
        <div v-else class="weather-no-data">暂无数据</div>
      </el-col>
      <el-col :md="8">
        <el-card class="investment-con">
          <p class="investment-img">
            <img src="~@/assets/images/investment.png" />
          </p>
          <p class="investment-confirmation">
            累计确认投资额度<br />
            <span class="active">{{ $moneyFormat(investmentInfo.total) }} <i>元</i></span>
          </p>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card class="investment-con">
          <p class="investment-img">
            <img src="~@/assets/images/investment.png" />
          </p>
          <div class="investment-confirmation">
            {{ investmentInfo.issue }}确认投资额度<br />
            <span class="active">{{ $moneyFormat(investmentInfo.recent) }} <i>元</i></span>
            <p>
              <el-button type="primary" class="investment-view" @click="investmentDetails(investmentInfo.confirmId)">
                查看投资确认单详情
              </el-button>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 用户及项目信息 end -->
    <div class="line-space"></div>
    <div class="bim-tab">
      <el-tabs v-model="bimActive" class="custom-tab" @tab-click="clickBimTab">
        <el-tab-pane label="BIM 模型查看" name="first"></el-tab-pane>
        <el-tab-pane label="施工现场摄像头查看" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    <Bim v-show="bimActive === 'first'" />
    <HomeVideo v-if="bimActive === 'second'" />
    <!-- 进度计划 start -->
    <el-row :gutter="15">
      <el-col :md="10">
        <!-- 未完成进度计划 start -->
        <UnfinishedPlan ref="unfinishedPlanRef" @taskReceive="taskReceive" />
        <!-- 未完成进度计划 end -->
      </el-col>
      <el-col :md="14">
        <el-card>
          <el-tabs v-model="tabIndex" stretch class="custom-tab">
            <el-tab-pane name="0">
              <span slot="label">
                我领取的进度计划<i v-if="scheduleTotal" class="badge">{{ scheduleTotal }}</i></span
              >
              <!-- 我领取的进度计划 start -->
              <ScheduleList ref="scheduleListRef" @endTask="endTask" @change="e => (scheduleTotal = e)" />
              <!-- 我领取的进度计划 end -->
            </el-tab-pane>
            <el-tab-pane name="1">
              <span slot="label">
                我的待审核<i v-if="checkPendingTotal" class="badge">{{ checkPendingTotal }}</i></span
              >
              <!-- 我的待审核 start -->
              <div class="tab-body">
                <el-table :data="checkPending" height="366" style="width: 100%">
                  <el-table-column prop="taskName" label="标题" min-width="300">
                    <template slot-scope="scope">
                      <router-link to="" @click.native="viewTask(scope.row, 0)">{{ scope.row.taskName }}</router-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processDefinitionName" label="流程定义名称" width="150"> </el-table-column>
                  <el-table-column prop="applyUserName" label="申请人" width="150"> </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="180"> </el-table-column>
                  <el-table-column label="操作" width="100" align="right">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="viewTask(scope.row, 0)">审批</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- 我的待审核 end -->
            </el-tab-pane>
            <el-tab-pane name="2">
              <span slot="label">
                我的申请<i v-if="approvalMineTotal" class="badge">{{ approvalMineTotal }}</i></span
              >
              <div class="tab-body">
                <!-- 我的申请 start -->
                <el-table :data="approvalMineList" height="366" style="width: 100%">
                  <el-table-column prop="processInstanceName" label="标题" min-width="300">
                    <template slot-scope="scope">
                      <router-link to="" @click.native="viewTask(scope.row, 1)">{{
                        scope.row.processInstanceName
                      }}</router-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processDefinitionName" label="流程定义名称" width="150"> </el-table-column>
                  <el-table-column prop="taskStatus" label="流程状态">
                    <template slot-scope="scope">
                      {{ scope.row.endTime ? '已结束' : '进行中' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="startTime" label="创建时间" width="180"> </el-table-column>
                  <el-table-column label="操作" width="100" align="right">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click.native="viewTask(scope.row, 1)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 我的申请 end -->
              </div>
            </el-tab-pane>
            <el-tab-pane name="3">
              <span slot="label">
                通知公告<i v-if="messageTotal" class="badge">{{ messageTotal }}</i></span
              >
              <MessageList @change="e => (messageTotal = e)" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <div class="line-space"></div>
        <el-card>
          <div class="custom-card-header schedule-header">
            <div class="title">
              项目进度
              <el-select v-model="taskPanelSelect" placeholder="进度文件名称">
                <el-option
                  v-for="item in taskPanelSelectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="schedule-roll">
            <template v-if="taskPanelSelect !== '' && taskPanelList[taskPanelSelect].list.length > 0">
              <div
                v-for="(item, i) in taskPanelList[taskPanelSelect].list"
                :key="i"
                class="schedule-con"
                :class="{ finished: item.isFinished }"
              >
                <div class="task-info">
                  <span class="task-name" v-text="item.taskName"></span>
                  <span v-if="item.isFinished" class="status">（已完成）</span>
                  <span class="schedule-time">{{ item.start | formatData }} ~ {{ item.end | formatData }}</span>
                </div>
                <el-progress
                  :text-inside="false"
                  :stroke-width="5"
                  :percentage="item.actualFinishedPercent"
                  :show-text="true"
                ></el-progress>
              </div>
            </template>
            <p v-else class="no-data">暂无数据</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 进度计划 end -->
  </div>
</template>

<script>
import axios from '@/utils/axios'
import { getDays, getDateStr } from '@/utils'
import { homeApi } from './api'
import Bim from './components/bim' // 首页bim展示
import HomeVideo from './components/video' // 通知公告
import UnfinishedPlan from './components/unfinishedPlan' // 未完成进度计划
import ScheduleList from './components/scheduleList' // 我领取的进度计划
import MessageList from './components/messageList' // 通知公告
import ImageCrop from '@/components/ImageCrop'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    HomeVideo,
    Bim,
    UnfinishedPlan,
    ScheduleList,
    MessageList,
    ImageCrop
  },
  data() {
    //这里存放数据
    return {
      tabIndex: '0',
      // 我领取的进度计划
      scheduleTotal: 0,
      // 待审核
      checkPendingTotal: 0,
      checkPending: [],
      // 我的申请
      approvalMineTotal: 0,
      approvalMineList: [],
      // 通知公告
      messageTotal: 0,
      getDays,
      getDateStr,
      taskPanelSelect: '',
      taskPanelSelectList: [],
      taskPanelList: [], // 项目进度面板
      weatherInfo: {}, // 天气信息
      investmentInfo: {}, // 投资信息
      bimActive: 'first',
      uploadAvatarParams: {
        show: false,
        action: axios.file.defaults.baseURL + '/file/commonFile/uploadImage',
        btnLoading: false,
        formData: this.$store.state.user.userInfo
      }
    }
  },
  //监听属性 类似于data概念
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    // 项目详情
    projectDetail() {
      return this.$store.state.project.projectDetail
    },
    // 用户
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  //监控data中的数据变化
  watch: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      this.getInvestConfirmAmount()
      this.getProjectInfo()
      this.queryTaskList()
      this.queryInstanceActivitiList()
      this.getScheduleTaskPanel()
    },
    // bim模型与视频切换
    clickBimTab(e) {
      console.log(e)
    },
    // 保存头像
    async saveAvatar() {
      try {
        this.uploadAvatarParams.btnLoading = true
        await homeApi.updateUser(this.uploadAvatarParams.formData)
        this.uploadAvatarParams.show = false
        this.uploadAvatarParams.btnLoading = false
        this.$store.commit('user/SET_AVATAR', this.uploadAvatarParams.formData.headImage)
        this.$store.commit('user/SET_USERINFO', this.uploadAvatarParams.formData)
        console.log(111, this.uploadAvatarParams.formData)
      } catch (e) {
        this.uploadAvatarParams.btnLoading = false
      }
    },
    // 获取确认投资额度
    async getInvestConfirmAmount() {
      let result = await homeApi.getInvestConfirmAmount(this.projectId)
      let datas = result.data
      this.investmentInfo = datas
    },
    // 查看投资确认单详情
    investmentDetails(id) {
      this.$router.push({
        name: 'InvestmentTotalConfirmationDetail',
        params: {
          id
        }
      })
    },
    // 获取项目详情
    async getProjectInfo() {
      let result = await homeApi.getProjectInfo(this.projectId)
      let datas = result.data
      this.$store.commit('setProjectDetail', datas)
      this.queryWeatherInfo(datas.province, {
        lng: datas.longitude,
        lat: datas.latitude
      })
    },
    // 获取天气信息
    async queryWeatherInfo(province, params) {
      let result = await homeApi.queryWeatherInfo(params)
      let datas = result.data
      datas.province = province
      this.weatherInfo = datas
      console.log(datas)
    },
    // 获取问候语
    getTimeState() {
      // 获取当前时间
      let timeNow = new Date()
      // 获取当前小时
      let hours = timeNow.getHours()
      // 设置默认文字
      let text = ``
      // 判断当前时间段
      if (hours >= 0 && hours <= 8) {
        text = `早上好`
      } else if (hours > 8 && hours <= 12) {
        text = `上午好`
      } else if (hours > 12 && hours <= 14) {
        text = `中午好`
      } else if (hours > 14 && hours <= 18) {
        text = `下午好`
      } else if (hours > 18 && hours <= 24) {
        text = `晚上好`
      }
      return text
    },
    // 退出登录
    async logout() {
      this.$store.dispatch('user/logout')
    },
    // 领取任务成功
    taskReceive() {
      this.$refs.scheduleListRef.init()
    },
    // 结束任务
    endTask() {
      this.$refs.unfinishedPlanRef.queryScheduleUnfinishedTaskList()
    },
    // 我的待审核
    async queryTaskList() {
      let params = {
        page: 1,
        rows: 200,
        taskStatus: 0,
        projectId: this.projectId
      }
      let result = await homeApi.queryTaskList(params)
      let datas = result.data
      let list = datas.records || []
      this.checkPendingTotal = datas.total
      this.checkPending = list
    },
    // 我的申请
    async queryInstanceActivitiList() {
      let params = {
        page: 1,
        rows: 200,
        projectId: this.projectId,
        processStatus: 0
      }
      let result = await homeApi.queryInstanceActivitiList(params)
      let datas = result.data
      let list = datas.records || []
      this.approvalMineTotal = datas.total
      this.approvalMineList = list
    },
    // 查看任务
    viewTask(item, index) {
      let processDefinitionCategory = item.processDefinitionKey
      let approvalRouter = this.$store.state.approval.approvalRouter[processDefinitionCategory]
      let routerName = approvalRouter ? approvalRouter.pcRouteUrl + ',' + approvalRouter.pcRouteUrl : ''
      console.log(111, processDefinitionCategory, this.$store.state.approval.approvalRouter, approvalRouter, routerName)
      if (routerName) {
        this.$store.commit('toApprovalDetails', {
          index,
          routerList: routerName.split(','),
          targetId: item.targetId,
          isCheck: parseInt(index) === 0
        })
      }
    },
    // 进度管理-项目进度面板
    async getScheduleTaskPanel() {
      let result = await homeApi.getScheduleTaskPanel(this.projectId)
      let datas = result.data || []
      let taskPanelSelectList = []
      datas.map((item, i) => {
        taskPanelSelectList.push({
          label: item.scheduleFileName,
          value: i
        })
        let planFinishedPercent = parseFloat(item.planFinishedPercent.toFixed(2))
        let actualFinishedPercent = parseFloat(item.actualFinishedPercent.toFixed(2))
        item.planFinishedPercent = planFinishedPercent
        item.actualFinishedPercent = actualFinishedPercent
      })
      this.taskPanelSelectList = taskPanelSelectList
      this.taskPanelSelect = 0
      console.log('进度管理-项目进度面板', datas, taskPanelSelectList)
      let defaultWidth = 10
      /*
        获取数组中的最大值或最小值
        type = max 最大值
        type = min 最小值
      */
      const getArrayMax = (array, type = 'max') => {
        return Math[type].apply(Math, array)
      }
      datas.map(item => {
        let list = item.list || []
        let minCount = getArrayMax(_.map(list, 'taskCount'), 'min')
        let maxCount = getArrayMax(_.map(list, 'taskCount'), 'max')
        defaultWidth = minCount <= 2 ? 50 : 10
        list.map(e => {
          e.lineStyle = `width: ${e.taskCount * defaultWidth}px`
        })
        item.list = list
        item.lineStyle =
          maxCount > 0
            ? `width: ${item.taskCount * defaultWidth}px;margin-left: ${
                item.list.length > 0 ? item.list[0].taskCount * defaultWidth : 0
              }px`
            : ''
        item.progressStyle =
          maxCount > 0
            ? `width: ${
                item.taskCount * defaultWidth + (item.list.length > 0 ? item.list[0].taskCount * defaultWidth : 0)
              }px;`
            : ''
      })
      this.taskPanelList = datas
      // console.log('项目进度面板', datas)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
@import url('~@/styles/common');
.line-space {
  margin-bottom: 15px;
}
.user-con {
  min-height: 190px;
  border-left: #6296da 2px solid;
}
.user-info {
  display: flex;
  position: relative;
  .user-avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .upload-avatar {
    margin-top: 15px;
    width: 100%;
  }
  .user-name {
    padding: 0 20px;
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    .desc {
      margin-top: 15px;
      font-size: 14px;
      font-weight: normal;
      color: @main-sub-color;
      line-height: 2;
    }
  }
  .login-num {
    text-align: center;
    font-size: 14px;
    b {
      display: block;
      font-size: 30px;
      color: #3b74bd;
      font-weight: bold;
    }
  }
  .logout {
    position: absolute;
    top: 0;
    right: 0;
  }
  .project-avatar {
    width: 60px;
    height: 60px;
  }
  .project-data {
    font-size: 18px;
    .project-name {
      margin-top: 15px;
    }
    .desc {
      font-size: 14px;
      display: flex;
      span {
        flex: 1;
      }
    }
  }
}
.project-period {
  font-size: 14px;
  display: flex;
  align-items: center;
  border-top: 1px #e5e5e5 solid;
  margin-top: 15px;
  padding-top: 15px;
  span {
    flex: 1;
    font-size: 13px;
    color: @main-sub-color;
    b {
      display: block;
      font-size: 20px;
      font-weight: normal;
      color: #000;
    }
  }
}
.custom-card-header,
/deep/.custom-card-header {
  display: flex;
  flex-direction: column;
  .title {
    margin-bottom: 15px;
    padding-bottom: 15px;
    font-size: 18px;
    width: auto;
    border-bottom: 1px solid #ebeef5;
  }
  .card-form {
    margin-bottom: 15px;
  }
  &.schedule-header {
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
.tab-body,
/deep/.tab-body {
  height: 366px;
}
.custom-tab {
  /deep/.el-tabs__item {
    font-size: 18px;
  }
  /deep/.el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }
  /deep/.el-tabs__item {
    color: #666;
    &.is-active {
      color: #000;
    }
  }
  /deep/.el-table {
    background: #f2f5f9;
    border-radius: 10px;
    tr,
    th,
    td {
      background: none;
    }
  }
}
.badge {
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
  font-style: normal;
  vertical-align: middle;
  margin-top: -15px;
}
.project-schedule {
  margin-left: 20px;
  font-size: 12px;
  color: #f56c6c;
}
.schedule-roll {
  padding-top: 15px;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 375px;
  overflow-y: auto;
  background: #f2f5f9;
  border-radius: 10px;
  .scrollbar;
  .no-data {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999;
  }
}
.schedule-con {
  width: 100%;
  margin-bottom: 15px;
  padding: 0 10px 0 15px;
  .task-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .schedule-time {
    margin-left: 15px;
  }
  &:last-child {
    padding-bottom: 0;
    border: 0;
  }
  .schedule-name {
    border: 1px #ddd dashed;
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    margin-right: 15px;
    font-size: 14px;
    border-radius: 6px;
  }
  /deep/.el-progress {
    display: flex;
    align-items: center;
    .el-progress__text {
      font-size: 14px !important;
    }
    .el-progress-bar__outer {
      background: #dee3e9;
    }
    .el-progress-bar__inner {
      background: #6d93e8;
    }
  }

  &.finished {
    color: #999;
  }
  .schedule-body {
    flex: 1;
    overflow: hidden;
    .schedule-roll {
      padding-left: 70px;
      width: 100%;
      overflow-x: auto;
      .scrollbar;
      position: relative;
      .schedule-line {
        position: absolute;
        z-index: 3;
        display: flex;
        align-items: center;
        font-size: 12px;
        span {
          border-left: 1px #ccc solid;
          height: 120px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          padding-left: 10px;
        }
      }
    }
  }
}
.schedule-progress {
  display: flex;
  padding: 10px 0;
  position: relative;
  margin-bottom: 20px;
  .label {
    font-size: 14px;
    width: 70px;
    position: absolute;
    z-index: 3;
    margin-top: -5px;
    margin-left: -70px;
    background: #fff;
  }
  /deep/.el-progress {
    flex: 1;
  }
}
// 天气信息
.weather {
  display: flex;
  font-size: 12px;
  min-height: 250px;
  background: #4885cf;
  border-radius: 4px;
  color: #fff;
  position: relative;
  .weather-province {
    margin-top: 30px;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 2;
    .high-low {
      font-size: 18px;
      margin: 10px 0;
    }
  }
  .temperature-con {
    flex: 2;
  }
  .weather-pic {
    width: 80px;
    height: 80px;
  }
  .temperature-time,
  .temperature {
    flex: 1;
    line-height: 1.8;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .temperature-time {
    flex-direction: row;
    justify-content: flex-start;
    p {
      flex: 1;
      text-align: center;
      font-size: 12px;
      b {
        display: block;
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
  .temperature {
    margin: 15px;
    justify-content: flex-start;
    overflow-x: auto;
    height: 105px;
    .scrollbar;
    b {
      color: red;
      font-weight: normal;
    }
  }
  .weather-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: normal;
    padding: 15px;
    .el-icon-location {
      margin-right: 5px;
      font-size: 14px;
    }
  }
}
.weather-no-data {
  min-height: 250px;
  background: #4885cf;
  border-radius: 4px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.investment-con {
  min-height: 250px;
  border-bottom: #6296da 2px solid;
  display: flex;
  justify-content: center;
  position: relative;
  /deep/.el-card__body {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .investment-img {
    padding: 0 30px;
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}
.investment-confirmation {
  flex: 2;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #666;
  .active {
    color: #ff3859;
    font-weight: bold;
    margin-right: 15px;
    font-size: 36px;
    margin: 6px 0;
    i {
      font-style: normal;
      font-size: 14px;
      color: #666;
    }
  }
}
.bim-tab {
  margin-bottom: 5px;
  padding: 10px 20px 0;
  background: #fff;
  /deep/.el-tabs__nav-wrap::after {
    background: #fff;
  }
  /deep/.el-tabs__header {
    margin: 0;
  }
}
.investment-view {
  position: absolute;
}
</style>
