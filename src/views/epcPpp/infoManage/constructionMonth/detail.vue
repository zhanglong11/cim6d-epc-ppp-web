<template>
  <div class="container no-padding is-footer fixedHeight">
    <div class="innerContainer white">
      <!--流程图-->
      <ViewFlow :id="id" />
      <!--流程图-->
      <div class="infoWrapper">
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">月报期号</div>
              <div class="lrCellValue">{{ info.issueNumber }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">报告期</div>
              <div class="lrCellValue">{{ moment(info.reportStartDate).format('YYYY-MM') }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">编制</div>
              <div class="lrCellValue">{{ info.authorName }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">附件</div>
              <div class="lrCellValue"><FileList :ids="info.fileIds"></FileList></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本月完成情况</div>
              <div class="lrCellValue">
                <div><span class="valueItem">本月计划工程进展</span>{{ info.thisMonthPlanProgress }}</div>
                <div><span class="valueItem">本月计划产值</span>{{ info.thisMonthPlanProduction }}万元</div>
                <div><span class="valueItem">本月实际工程进展</span>{{ info.thisMonthActualProgress }}</div>
                <div><span class="valueItem">本月完成产值</span>{{ info.thisMonthFinishProduction }}万元</div>
                <div><span class="valueItem">本月完成率</span>{{ info.thisMonthFinishRate }}%</div>
                <div><span class="valueItem">累计完成产值</span>{{ info.cumulativeFinishProduction }}万元</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">下月计划</div>
              <div class="lrCellValue">
                <div>
                  <span class="valueItem">选择日期</span>{{ info.nextMonthStartDate }}~{{ info.nextMonthEndDate }}
                </div>
                <div><span class="valueItem">下月计划工程进展</span>{{ info.nextMonthPlanProgress }}</div>
                <div><span class="valueItem">下月计划产值</span>{{ info.nextMonthPlanProduction }}万元</div>
                <div><span class="valueItem">计划完成率</span>{{ info.planFinishRate }}%</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本月形象进度</div>
              <div class="lrCellValue">{{ info.thisMonthImageProgress }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">现场照片</div>
              <div class="lrCellValue"><FileList :ids="info.sceneImageId"></FileList></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">下月工作计划</div>
              <div class="lrCellValue">{{ info.nextMonthWorkPlan }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">需建设单位协调的问题</div>
              <div class="lrCellValue">
                <vxe-table ref="table" auto-resize :data="info.problemSaveList">
                  <vxe-table-column type="seq" title="序号" width="60" />
                  <vxe-table-column title="问题描述" field="problemDesc"> </vxe-table-column>
                </vxe-table>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">月报大事件</div>
              <div class="lrCellValue">{{ info.monthMajorEvent }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <template v-if="isCheck">
        <CheckCard :id="id" ref="checkCard"></CheckCard>
      </template>
    </div>
    <div class="footer-btn">
      <el-button @click="goBack()">返回</el-button>
      <template v-if="isCheck">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from './api'
export default {
  name: 'ConstructionMonthDetail',
  components: {},
  data() {
    return {
      id: this.$route.params.id || '',
      isCheck: this.$route.query.isCheck || false,
      info: {}
    }
  },
  computed: {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.detail(this.id)
      this.info = res.data
    },
    // 返回
    goBack() {
      this.$router.back()
    },
    //审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.innerContainer {
  padding: 40px 20px;
}
.infoWrapper {
  padding: 10px 40px;
  max-width: 80%;
}
.rowLine {
  margin-bottom: 15px;
}
.lrCellInfo {
  display: flex;
  align-items: flex-start;
  padding: 2px 10px 2px 0;
  min-height: 30px;
  font-size: 16px;
  .lrCellLabel {
    color: #cccccc;
    margin-right: 10px;
    width: 150px;
    text-align: right;
    font-size: 14px;
  }
  .lrCellValue {
    flex: 1;
    .valueItem {
      color: #cccccc;
      margin-right: 10px;
      font-size: 14px;
    }
  }
}
.bimContainer {
  height: 800px;
}
</style>
