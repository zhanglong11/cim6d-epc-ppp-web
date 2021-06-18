<template>
  <div class="home-bim">
    <el-card class="tree">
      <TreeData type="space" @checkChange="singleChange" @bimInit="bimInit" />
    </el-card>
    <div class="task-bim">
      <BimShow ref="BIMRef" idSelect="progress" :isLoadAll="false" class="bim-box-progress" />
    </div>
    <div class="bim-legend">
      <div class="legend-item">
        <div class="legend-con">
          <div class="status-con">
            <p class="status">
              <em class="active"></em>
              已完成进度（{{ progressCompletedTotal }}%）
            </p>
            <p class="status">
              <em></em>
              未完成进度（{{ progressTotal }}%）
            </p>
          </div>
          <el-progress
            type="circle"
            :width="60"
            :stroke-width="4"
            color="#5572ea"
            :percentage="progressCompletedTotal"
          ></el-progress>
        </div>
        <p>
          <el-button type="primary" size="mini" @click="bimMore">BIM查看-详细进度统计</el-button>
        </p>
      </div>
      <div class="legend-item quality">
        <div class="legend-con">
          <div class="status-con">
            <p class="status">
              <em></em>
              未整改质量问题（{{ qualityTotal }}个）
            </p>
            <p class="status">
              <em class="active"></em>
              已整改质量问题（{{ qualityCompletedTotal }}个）
            </p>
          </div>
          <div class="quality-progress">
            <el-progress
              type="circle"
              :width="60"
              :stroke-width="4"
              :show-text="false"
              color="#5572ea"
              :percentage="((qualityTotal / (qualityTotal + qualityCompletedTotal)) * 100) | toFixed2"
            ></el-progress>
            <span class="total">{{ qualityTotal }}个</span>
          </div>
        </div>
        <p>
          <el-button type="primary" size="mini" @click="bimMore">BIM查看-详细质量统计</el-button>
          <el-button type="danger" size="mini" @click="addQuestion">上报质量问题</el-button>
        </p>
      </div>
      <div class="legend-item safe">
        <div class="legend-con">
          <div class="status-con">
            <p class="status">
              <em></em>
              未整改安全问题（{{ safeTotal }}个）
            </p>
            <p class="status">
              <em class="active"></em>
              已整改安全问题（{{ safeCompletedTotal }}个）
            </p>
          </div>
          <div class="quality-progress">
            <el-progress
              type="circle"
              :width="60"
              :stroke-width="4"
              :show-text="false"
              color="#5572ea"
              :percentage="((safeTotal / (safeTotal + safeCompletedTotal)) * 100) | toFixed2"
            ></el-progress>
            <span class="total">{{ safeTotal }}个</span>
          </div>
        </div>
        <p>
          <el-button type="primary" size="mini" @click="bimMore">BIM查看-详细安全统计</el-button>
          <el-button type="danger" size="mini" @click="addSafe">上报安全问题</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { homeApi } from '../api'
import TreeData from './TreeData'
import BimShow from './bimShow'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    TreeData,
    BimShow
  },
  data() {
    //这里存放数据
    return {
      progressTotal: 0,
      progressCompletedTotal: 0,
      progressCompleted: [], // 已完成进度
      qualityTotal: 0,
      qualityList: [], // 未取消质量问题
      qualityCompletedTotal: 0,
      qualityCompletedList: [], // 已取消质量问题
      safeTotal: 0,
      safeList: [], // 未取消安全问题
      safeCompletedTotal: 0,
      safeCompletedList: [] // 已取消安全问题
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  mounted() {},
  //方法集合
  methods: {
    // 初始化
    init(modelId, time = 3) {
      if (modelId.length === 0) {
        this.progressTotal = 0
        this.progressCompletedTotal = 0
        this.qualityTotal = 0
        this.qualityCompletedTotal = 0
        this.safeTotal = 0
        this.safeCompletedTotal = 0
        // 清除颜色
        this.$refs.BIMRef.bimfishApp.clearThemingColors()
        // 清除所有的 2d 标注
        this.$refs.BIMRef.bimfishApp.clearIconDrawableMarker()
        return
      }
      this.scheduleTotal(modelId, time)
      this.getQualityIssueCount(modelId, time)
    },
    // 选择树
    singleChange({ bimArray, guidArray }) {
      console.log(4444 + '---------------选择树', bimArray, guidArray)
      this.$refs.BIMRef.watchModal(bimArray, guidArray)
      let modelId = _.map(bimArray, 'id')
      this.init(modelId, 0.2)
    },
    // bim初始化
    bimInit(bimArray) {
      // console.log(33333 + '---------------bim初始化', bimArray)
      this.$refs.BIMRef.bimInit(bimArray, false)
      let modelId = _.map(bimArray, 'id')
      this.init(modelId, 3)
    },
    // 进度bim关联-按周期汇总
    async scheduleTotal(modelId, time) {
      let params = {
        cycleType: 3,
        projectId: this.projectId,
        modelIdList: modelId
      }
      let result = await homeApi.scheduleTotal(params)
      let datas = result.data
      let total = 0
      let completedTotal = 0
      if (!datas || datas.length === 0) {
        this.progressTotal = 0
        this.progressCompletedTotal = 0
        // 清除颜色
        this.$refs.BIMRef.bimfishApp.clearThemingColors()
        return
      }
      datas.map(e => {
        let componentIdList = e.componentIdList || []
        total += componentIdList.length
        if (e.groupNum === 0) {
          this.progressCompleted = componentIdList
          completedTotal = e.actualFinishedPercent || 0
        }
      })
      this.progressTotal = (100 - completedTotal).toFixed(2)
      this.progressCompletedTotal = completedTotal
      console.log(111, completedTotal)
      setTimeout(() => {
        // 进度上色
        this.$refs.BIMRef.planTaskColor(this.progressCompleted)
        this.$refs.BIMRef.bimfishApp.viewer.impl.invalidate(true, true, true)
        // console.log('进度bim关联', datas)
      }, time * 1000)
    },
    // 首页-质量问题数量
    async getQualityIssueCount(modelId, time) {
      let params = {
        projectId: this.projectId,
        modelId
      }
      let result = await homeApi.getQualityIssueCount(params)
      let datas = result.data
      this.qualityList = datas.unCancelComponentIdsList || []
      this.qualityTotal = datas.unCancel
      this.qualityCompletedList = datas.cancelComponentIdsList || []
      this.qualityCompletedTotal = datas.cancel
      this.getSafetyIssueCount(modelId, time)
      // console.log('首页-质量问题数量', datas, this.qualityList, this.qualityCompletedList)
    },
    // 首页-安全问题数量
    async getSafetyIssueCount(modelId, time) {
      let params = {
        projectId: this.projectId,
        modelId
      }
      let result = await homeApi.getSafetyIssueCount(params)
      let datas = result.data
      this.safeList = datas.unCancelComponentIdsList || []
      this.safeTotal = datas.unCancel
      this.safeCompletedList = datas.cancelComponentIdsList || []
      this.safeCompletedTotal = datas.cancel
      // console.log('首页-安全问题数量', datas)
      // BIM初始化完毕
      setTimeout(() => {
        this.$refs.BIMRef.bimfishApp.clearIconDrawableMarker()
        // 未取消质量问题 标注
        this.$refs.BIMRef.qualityMarker(this.qualityList, 1)
        // 已取消质量问题 标注
        this.$refs.BIMRef.qualityMarker(this.qualityCompletedList, 2)
        // 未取消安全问题 标注
        this.$refs.BIMRef.safeMarker(this.safeList, 1)
        // 已取消安全问题 标注
        this.$refs.BIMRef.safeMarker(this.safeCompletedList, 2)
        this.$refs.BIMRef.bimfishApp.viewer.impl.invalidate(true, true, true)
      }, time * 1000)
    },
    // 颜色模拟
    bimDataDemo() {
      // 已完成进度
      let progressCompleted = [
        '0_a95b6931-643c-4b05-a159-bee9f8342d8e-00088ff4',
        '0_a95b6931-643c-4b05-a159-bee9f8342d8e-000895cd',
        '0_a95b6931-643c-4b05-a159-bee9f8342d8e-00089701',
        '0_7daef91d-212e-42f4-b65a-2a3f1bfd18e6-0008bc6f'
      ]
      // 未取消质量问题
      let qualityList = [
        '0_52dae909-ca28-497c-8752-ce2ee71aea5c-0008cfdc',
        '0_52dae909-ca28-497c-8752-ce2ee71aea5c-0008cf13'
      ]
      // 已取消质量问题
      let qualityCompletedList = [
        '0_52dae909-ca28-497c-8752-ce2ee71aea5c-0008ce38',
        '0_e9a26993-0f37-4197-8ccb-9b0f773c697b-00070ad3'
      ]
      // 未取消安全问题
      let safeList = [
        '0_52dae909-ca28-497c-8752-ce2ee71aea5c-0008cf3e',
        '0_52dae909-ca28-497c-8752-ce2ee71aea5c-0008d0f8'
      ]
      // 已取消安全问题
      let safeCompletedList = [
        '0_52dae909-ca28-497c-8752-ce2ee71aea5c-0008d0fb',
        '0_7cd0966b-a945-4472-beb6-e235e34f41f7-0007295c'
      ]
      this.progressCompleted = progressCompleted
      this.qualityList = qualityList
      this.qualityCompletedList = qualityCompletedList
      this.safeList = safeList
      this.safeCompletedList = safeCompletedList
      setTimeout(() => {
        // 进度上色
        this.$refs.BIMRef.planTaskColor(progressCompleted)
        // 未取消质量问题 标注
        this.$refs.BIMRef.qualityMarker(qualityList, 1)
        // 已取消质量问题 标注
        this.$refs.BIMRef.qualityMarker(qualityCompletedList, 2)
        // 未取消安全问题 标注
        this.$refs.BIMRef.safeMarker(safeList, 1)
        // 已取消安全问题 标注
        this.$refs.BIMRef.safeMarker(safeCompletedList, 2)
      }, 5000)
    },
    // 上报质量问题
    addQuestion() {
      this.$router.push({ name: 'EpcPppQualityQuestionAdd' })
    },
    // 上报安全问题
    addSafe() {
      this.$router.push({ name: 'EpcPppSafetyQuestionAdd' })
    },
    // bim查看
    bimMore() {
      this.$router.push({ name: 'ModelEpcPpp' })
    }
  }
}
</script>
<style lang="less" scoped>
.home-bim {
  margin-bottom: 15px;
  display: flex;
  .tree {
    width: 360px;
  }
  .task-bim {
    flex: 1;
    height: 600px;
  }
  .bim-legend {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 15px;
    .legend-item {
      flex: 1;
      background: #fff;
      margin-top: 15px;
      padding: 15px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 12px;
      border: 1px #f8f9fd solid;
      border-left: 2px #9baefe solid;
      border-radius: 6px;
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
      .legend-con {
        display: flex;
        align-items: center;
        .status-con {
          flex: 1;
        }
      }
      /deep/.el-button {
        margin-top: 10px;
      }
      .status {
        display: flex;
        align-items: center;
        margin: 10px 0;
        em {
          margin-right: 10px;
          width: 15px;
          height: 15px;
          background: #999;
          // border-radius: 50%;
          &.active {
            background: #ffbb29;
          }
        }
      }
      &.quality {
        .status {
          em {
            background: #ff0000;
            border-radius: 50%;
            &.active {
              background: #149e2e;
            }
          }
        }
      }
      &.safe {
        .status {
          em {
            background: #ff9900;
            transform: rotate(-45deg) scale(0.8);
            &.active {
              background: #d0e17d;
            }
          }
        }
      }
      &:first-child {
        margin-top: 0;
      }
    }
    .quality-progress {
      position: relative;
      .total {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8.66666px;
      }
    }
  }
}
</style>
