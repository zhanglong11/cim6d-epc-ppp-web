<!--
@bug名称: 1182/计量器具台账-去掉【状态】字段
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，修改比例(3%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2d2f6e9e411e7d7453167097561f6240b7cb626d
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具台账 搜索和新增的时间组件添加时分秒，新增和详情的界面样式重新调整，后续检定校准、故障维修、封存、报废模态框的时间组件添加时分秒
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 8819cc97074ba0aa0c06082fda566918d18f0d05
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具台账 添加检定校准、故障维修、封存、报废，四个详情页，并添加审核结果模块
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.deviceName }}详情</div>
        <div>
          <el-button-group>
            <el-button
              v-if="$hasPower('BackAccept')"
              :disabled="data.deviceStatus === 1 || data.deviceStatus === 3"
              @click="handleClickCheck"
              >后续检定/校准</el-button
            >
            <el-button
              v-if="$hasPower('measureBookRepair')"
              :disabled="data.deviceStatus === 0 || data.deviceStatus === 3"
              @click="handleClickBreakDown"
              >故障维修</el-button
            >
            <el-button
              v-if="$hasPower('measureArchive')"
              :disabled="data.deviceStatus === 2 || data.deviceStatus === 3"
              @click="handleClickSeal"
              >封存</el-button
            >
            <el-button v-if="$hasPower('measureScrapped')" :disabled="data.deviceStatus === 3" @click="handleClickScrap"
              >报废</el-button
            >
          </el-button-group>
        </div>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>规格型号</span>
            <span>{{ data.specification }}</span>
          </div>
          <div>
            <span>测量范围</span>
            <span>{{ data.measureMin }}~{{ data.measureMax }} {{ data.measureUnit }}</span>
          </div>
          <div>
            <span>精度等级</span>
            <span>{{ data.step }}</span>
          </div>
          <div>
            <span>设备状态</span>
            <span v-if="data.deviceStatus === 0">停用</span>
            <span v-else-if="data.deviceStatus === 1">在用</span>
            <span v-else-if="data.deviceStatus === 2">封存</span>
            <span v-else-if="data.deviceStatus === 3">报废</span>
          </div>
          <!--<div>
            <span>状态</span>
            <span v-if="data.status === 0">正常</span>
            <span v-else-if="data.status === 1">故障报修待审核</span>
            <span v-else-if="data.status === 2">故障报修已通过</span>
            <span v-else-if="data.status === 3">故障报修已驳回</span>
            <span v-else-if="data.status === 4">封存待审核</span>
            <span v-else-if="data.status === 5">封存已通过</span>
            <span v-else-if="data.status === 6">封存已驳回</span>
            <span v-else-if="data.status === 7">报废待审核</span>
            <span v-else-if="data.status === 8">报废已通过</span>
            <span v-else-if="data.status === 9">报废已驳回</span>
            <span v-else-if="data.status === 10">检定待审核</span>
            <span v-else-if="data.status === 11">检定已通过</span>
            <span v-else-if="data.status === 12">检定已驳回</span>
          </div>-->
          <div>
            <span>出厂编号</span>
            <span>{{ data.manufactureNum }}</span>
          </div>
          <div>
            <span>制造厂商</span>
            <span>{{ data.manufacturer }}</span>
          </div>
          <div>
            <span>启用日期</span>
            <span>{{ data.enableTime }}</span>
          </div>
          <div>
            <span>负责人</span>
            <span>{{ data.principalName }}</span>
          </div>
          <div>
            <span>配备地点</span>
            <span>{{ data.location }}</span>
          </div>
        </div>
        <div>
          <div>
            <span>检定周期(月)</span
            ><!--bug号：1193、修改人：董渊海、修改时间：2020-03-19-->
            <span>{{ data.verificationFrequency }}</span>
          </div>
          <div>
            <span>管理类别</span>
            <span>{{ data.manageCategory }}</span>
          </div>
          <div>
            <span>最后一次检定时间</span>
            <span>{{ data.latestVerifyTime }}</span>
          </div>
          <div>
            <span>有效期至</span>
            <span>{{ data.expireTime }}</span>
          </div>
          <div>
            <span>检定结论</span>
            <span v-if="data.latestVerifyResult === 1">合格</span>
            <span v-else-if="data.latestVerifyResult === 0">不合格</span>
          </div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
          <div class="accessory">
            <div>附件</div>
            <div>
              <FileList :ids="data.fileId" />
            </div>
          </div>
          <div class="remark">
            <span>器具备注</span>
            <span>{{ data.remark }}</span>
          </div>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="后续检定/校准" name="check">
            <TabCheck :id="$route.params.id" ref="tabCheck" />
          </el-tab-pane>
          <el-tab-pane label="故障维修" name="breakDown">
            <TabBreakDown :id="$route.params.id" ref="tabBreakDown" />
          </el-tab-pane>
          <el-tab-pane label="封存" name="seal">
            <TabSeal :id="$route.params.id" ref="tabSeal" />
          </el-tab-pane>
          <el-tab-pane label="报废" name="scrap">
            <TabScrap :id="$route.params.id" ref="tabScrap" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="handleBack">返回</el-button>
      <template v-else>
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>

    <ModalCheck :visible.sync="visibleCheck" :data="data" @refreshTabCheckList="refreshTabCheckList" />
    <ModalBreakDown :visible.sync="visibleBreakDown" :data="data" @refreshTabBreakDownList="refreshTabBreakDownList" />
    <ModalSeal :visible.sync="visibleSeal" :data="data" @refreshTabSealList="refreshTabSealList" />
    <ModalScrap :visible.sync="visibleScrap" :data="data" @refreshTabScrapList="refreshTabScrapList" />
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/measureBook'
import ModalCheck from './modalCheck'
import ModalBreakDown from './modalBreakDown'
import ModalSeal from './modalSeal'
import ModalScrap from './modalScrap'
import TabCheck from './tabCheck'
import TabBreakDown from './tabBreakDown'
import TabSeal from './tabSeal'
import TabScrap from './tabScrap'
export default {
  name: 'MeasureBookDetail',
  components: { ModalCheck, ModalBreakDown, ModalSeal, ModalScrap, TabBreakDown, TabCheck, TabSeal, TabScrap },
  data() {
    return {
      activeName: 'check',
      visibleCheck: false,
      visibleBreakDown: false,
      visibleSeal: false,
      visibleScrap: false,
      data: {
        id: '',
        purchasePlanId: '',
        deviceName: '',
        specification: '',
        step: undefined,
        measureMin: undefined,
        measureMax: undefined,
        measureUnit: '',
        manufacturer: '',
        manufactureNum: '',
        principalName: '',
        enableTime: '',
        verificationFrequency: '',
        location: '',
        latestVerifyTime: '',
        manageCategory: '',
        latestVerifyResult: '',
        expireTime: '',
        deviceStatus: '',
        remark: ''
      }
    }
  },
  mounted() {
    this.refreshDetail()
    //检定校准，故障维修，封存，报废详情页返回处理
    let tabType = this.$route.params.tabType ? this.$route.params.tabType : ''
    if (tabType) {
      this.activeName = tabType
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
  },
  methods: {
    refreshDetail() {
      let id = this.$route.params.id ? this.$route.params.id : ''
      if (id) {
        Api.getMeasureBookDetail(id).then(res => {
          let data = res.data
          if (data) {
            this.data = data
          }
        })
      }
    },
    refreshTabCheckList(activeName) {
      this.refreshDetail()
      this.activeName = activeName
      let tabCheck = this.$refs.tabCheck
      tabCheck.refresh(1, tabCheck.rows)
    },
    refreshTabBreakDownList(activeName) {
      this.refreshDetail()
      this.activeName = activeName
      let tabBreakDown = this.$refs.tabBreakDown
      tabBreakDown.refresh(1, tabBreakDown.rows)
    },
    refreshTabSealList(activeName) {
      this.refreshDetail()
      this.activeName = activeName
      let tabSeal = this.$refs.tabSeal
      tabSeal.refresh(1, tabSeal.rows)
    },
    refreshTabScrapList(activeName) {
      this.refreshDetail()
      this.activeName = activeName
      let tabScrap = this.$refs.tabScrap
      tabScrap.refresh(1, tabScrap.rows)
    },
    handleClickCheck() {
      this.visibleCheck = true
    },
    handleClickBreakDown() {
      this.visibleBreakDown = true
    },
    handleClickSeal() {
      this.visibleSeal = true
    },
    handleClickScrap() {
      this.visibleScrap = true
    },
    handleEdit() {
      this.$router.push('AddMeasureBook')
    },
    handleTabClick(tab, event) {
      //console.log(tab, event)
    },
    handleBack() {
      this.$router.push({ name: 'MeasureBook' })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less"></style>
