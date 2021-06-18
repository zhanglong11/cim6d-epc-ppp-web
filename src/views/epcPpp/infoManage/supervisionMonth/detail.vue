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
              <div class="lrCellLabel">工程进展情况</div>
              <div class="lrCellValue">
                <div><span class="valueItem">形象进度</span>{{ info.imageProgress }}</div>
                <div><span class="valueItem">形象对比</span>{{ info.imageContrast }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本期工程进度控制方面的主要问题分析及处理情况</div>
              <div class="lrCellValue">
                <div><span class="valueItem">原因</span>{{ info.progressProblemReason }}</div>
                <div><span class="valueItem">处理</span>{{ info.progressProblemHandle }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">工程质量情况</div>
              <div class="lrCellValue">{{ info.qualitySituation }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本期工程质量控制方面的主要问题分析及处理情况</div>
              <div class="lrCellValue">
                <div><span class="valueItem">原因</span>{{ info.qualityProblemReason }}</div>
                <div><span class="valueItem">处理</span>{{ info.qualityProblemHandle }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本期施工安全评述</div>
              <div class="lrCellValue">{{ info.safetyDescribe }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">施工单位安全生产管理方面的主要问题及处理情况</div>
              <div class="lrCellValue">
                <div><span class="valueItem">原因</span>{{ info.safetyProblemReason }}</div>
                <div><span class="valueItem">处理</span>{{ info.safetyProblemHandle }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本期文明施工情况</div>
              <div class="lrCellValue">{{ info.civilizedConstructionSituation }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">文明施工管理方面的主要问题分析及处理情况</div>
              <div class="lrCellValue">
                <div><span class="valueItem">原因</span>{{ info.constructionProblemReason }}</div>
                <div><span class="valueItem">处理</span>{{ info.constructionProblemHandle }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本期完成情况</div>
              <div class="lrCellValue">
                本期完成投资
                <strong>
                  <em> {{ info.finishInvestment }}</em></strong
                >万元
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">已完工程量与已支付工程款的统计及说明</div>
              <div class="lrCellValue">{{ info.projectAmountMoney }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">工程量与工程款支付问题</div>
              <div class="lrCellValue">
                <div><span class="valueItem">原因</span>{{ info.amountMoneyProblemReason }}</div>
                <div><span class="valueItem">处理</span>{{ info.amountMoneyProblemHandle }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本期合同及其他事项的管理工作情况</div>
              <div class="lrCellValue">{{ info.contractOtherSituation }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">合同及其他事项管理方面的主要问题及分析处理情况</div>
              <div class="lrCellValue">
                <div>
                  <div class="valueItem">原因</div>
                  {{ info.contractOtherProblemReason }}
                </div>
                <div>
                  <div class="valueItem">处理</div>
                  {{ info.contractOtherProblemHandle }}
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">本月监理工作统计</div>
              <div class="lrCellValue">
                <vxe-table ref="table" auto-resize :data="info.workStatList">
                  <vxe-table-column type="seq" title="序号" width="60" />
                  <vxe-table-column title="项目名称" field="itemName"> </vxe-table-column>
                  <vxe-table-column title="单位" field="unit"> </vxe-table-column>
                  <vxe-table-column title="本年度">
                    <vxe-table-column title="本月" field="thisMonthStat"> </vxe-table-column>
                    <vxe-table-column title="累计" field="thisYearCumulative"> </vxe-table-column>
                  </vxe-table-column>
                  <vxe-table-column title="开工以来总计" field="startWorkSum"> </vxe-table-column>
                </vxe-table>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">监理工作总结</div>
              <div class="lrCellValue">{{ info.workSummary }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">下月工作重点及建议</div>
              <div class="lrCellValue">{{ info.nextKeyAdvise }}</div>
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
import Api from '@/views/epcPpp/infoManage/api'
export default {
  name: 'SupervisionMonthDetail',
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
      let res = await Api.getSupervisionMonthDetail(this.id)
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
