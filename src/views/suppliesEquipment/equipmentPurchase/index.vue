<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 200px" placeholder="采购单号/申请人/申请部门">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="申请时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="filterForm.status" style="width: 100%">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('EquipmentPurchaseList')">
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('EquipmentPurchaseAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('equipmentPurchaseAdd')"
        >
          新建采购申请
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="code" title="采购单号"></vxe-table-column>
      <vxe-table-column field="applicantName" title="申请人"></vxe-table-column>
      <vxe-table-column field="applyTime" title="申请时间" width="200">
        <template slot-scope="{ row }"> {{ row.applyTime | ymd }}</template>
      </vxe-table-column>
      <vxe-table-column field="applyDepartmentName" title="申请部门"></vxe-table-column>
      <vxe-table-column field="usePart" title="使用位置"></vxe-table-column>
      <vxe-table-column field="userName" title="使用人"></vxe-table-column>
      <vxe-table-column field="useCompanyName" title="使用部门"></vxe-table-column>
      <vxe-table-column field="appyArrivalTime" title="申请到货日期" width="200" formatter="ymd">
        <!--        <template slot-scope="{ row }"> {{ row.appyArrivalTime | ymd }}</template>-->
      </vxe-table-column>
      <vxe-table-column field="applyReason" title="申请原因"></vxe-table-column>
      <vxe-table-column
        field="status"
        title="处理状态"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <template v-if="row.status === 1 && $hasPower('EquipmentPurchaseExamine')">
            <span style="margin: 0 3px"><a @click="handleAudit(row.id)">审核</a></span>
          </template>
          <template v-if="row.status === 2 && $hasPower('EquipmentPurchaseBuy')">
            <span style="margin: 0 3px"><a @click="handlePurchase(row.id)">采购</a></span>
          </template>
          <template v-if="row.status === 4 && $hasPower('EquipmentPurchaseArrival')">
            <span style="margin: 0 3px"><a @click="handleReceiveConfirm(row.id)">到货确认</a></span>
          </template>
          <template v-if="row.status === 5 && $hasPower('EquipmentPurchaseVerification')">
            <span style="margin: 0 3px"><a @click="handleVerificationAcceptance(row.id)">检定验收</a></span>
          </template>
          <template v-if="row.status === 6 && $hasPower('EquipmentPurchaseWarehousing')">
            <span style="margin: 0 3px"><a @click="handleInstore(row.id)">执行入库</a></span>
          </template>

          <span v-if="$hasPower('EquipmentPurchaseDetail')" style="margin: 0 3px">
            <a @click="handleDetail(row.id)">查看</a></span
          >
          <template v-if="row.status === 0">
            <span v-if="$hasPower('EquipmentPurchaseEdit')" style="margin: 0 3px"
              ><a @click="handleEdit(row.id)">编辑</a></span
            >
            <span v-if="$hasPower('EquipmentPurchaseDelete')" style="margin: 0 3px"
              ><a @click="handleDelete(row.id)">删除</a></span
            >
          </template>
        </template>
      </vxe-table-column>
    </Grid>
    <PurchaseModel
      v-if="purchaseVisible"
      :id="selectId"
      :visible.sync="purchaseVisible"
      @submit="handlePurchaseClick"
    ></PurchaseModel>
    <ReceiveConfirmModel
      v-if="receiveConfirmVisible"
      :id="selectId"
      :visible.sync="receiveConfirmVisible"
      @submit="handleReceiveConfirmClick"
    ></ReceiveConfirmModel>
    <VerificationAcceptanceModel
      v-if="verificationAcceptanceVisible"
      :id="selectId"
      :visible.sync="verificationAcceptanceVisible"
      @submit="handleVerificationAcceptanceClick"
    ></VerificationAcceptanceModel>
    <InstoreModel
      v-if="instoreVisible"
      :id="selectId"
      :visible.sync="instoreVisible"
      @submit="handleInstoreClick"
    ></InstoreModel>
    <AuditModel v-if="auditVisible" :id="selectId" :visible.sync="auditVisible" @submit="handleAuditClick"></AuditModel>
  </div>
</template>

<script>
import statusList from '../lib/statusList'
import Api from './api'
import PurchaseModel from './components/PurchaseModel'
import ReceiveConfirmModel from './components/ReceiveConfirmModel'
import VerificationAcceptanceModel from './components/VerificationAcceptanceModel'
import InstoreModel from './components/InstoreModel'
import AuditModel from './components/AuditModel'
export default {
  name: 'EquipmentPurchaseList',
  components: { PurchaseModel, ReceiveConfirmModel, VerificationAcceptanceModel, InstoreModel, AuditModel },
  data() {
    return {
      statusList,
      selectId: '',
      purchaseVisible: false, //c采购弹窗
      receiveConfirmVisible: false, //到货确认
      verificationAcceptanceVisible: false, //检定验收
      instoreVisible: false, //入库
      auditVisible: false, //审核
      filterForm: {
        search: '',
        status: '',
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.getList(body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    handleDetail(id) {
      this.$router.push({ name: `EquipmentPurchaseDetail`, params: { id: id } })
    },
    handleEdit(id) {
      this.$router.push({ name: `EquipmentPurchaseEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该安全目标, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.safeTarget.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    },
    handlePurchase(id) {
      this.selectId = id
      this.purchaseVisible = true
    },
    //弹窗采购点击
    async handlePurchaseClick() {
      await Api.makeEquipmentPurchase(this.selectId)
      this.purchaseVisible = false
      this.$message.success('采购成功')
      await this.refresh()
    },
    //到货确认
    handleReceiveConfirm(id) {
      this.selectId = id
      this.receiveConfirmVisible = true
    },
    async handleReceiveConfirmClick(data) {
      await Api.getReceiveConfirm({ id: this.selectId, purchaseDetails: data })
      this.receiveConfirmVisible = false
      this.$message.success('到货确认成功')
      await this.refresh()
    },
    //鉴定验收
    handleVerificationAcceptance(id) {
      this.selectId = id
      this.verificationAcceptanceVisible = true
    },
    async handleVerificationAcceptanceClick(data) {
      await Api.getVerificationAcceptance({ id: this.selectId, purchaseDetails: data })
      this.verificationAcceptanceVisible = false
      this.$message.success('鉴定验收成功')
      await this.refresh()
    },
    //入库操作
    handleInstore(id) {
      this.selectId = id
      this.instoreVisible = true
    },
    async handleInstoreClick() {
      await Api.getEquipmentInstore(this.selectId)
      this.instoreVisible = false
      this.$message.success('入库成功')
      await this.refresh()
    },
    //审核操作
    handleAudit(id) {
      this.selectId = id
      this.auditVisible = true
    },
    async handleAuditClick(data) {
      await Api.getAudit({ ...data, id: this.selectId })
      this.auditVisible = false
      this.$message.success('审核成功')
      await this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
