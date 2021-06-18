<template>
  <div class="is-Footer white">
    <div class="info">
      <!-- <div v-if="orderInfo.status === 0">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </div> -->
      <div class="statusInfo">
        <h2>状态</h2>
        <p>{{ $getLabel(statusList, orderInfo.status) }}</p>
      </div>
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.code }}</span>
        </h6>
        <div class="infoWrapper">
          <el-row class="rowLine">
            <el-col :span="8">
              <div class="lrCellInfo">
                <div class="lrCellLabel">申请人</div>
                <div class="lrCellValue">{{ orderInfo.applicantName }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="lrCellInfo">
                <div class="lrCellLabel">设备使用位置</div>
                <div class="lrCellValue">
                  {{ orderInfo.usePart }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="8">
              <div class="lrCellInfo">
                <div class="lrCellLabel">申请部门</div>
                <div class="lrCellValue">
                  {{ orderInfo.applyDepartmentName }}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="lrCellInfo rowLine">
                <div class="lrCellLabel">设备使用人</div>
                <div class="lrCellValue">{{ orderInfo.userName }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="8">
              <div class="lrCellInfo">
                <div class="lrCellLabel">申请时间</div>
                <div class="lrCellValue">
                  {{ orderInfo.applyTime }}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="lrCellInfo rowLine">
                <div class="lrCellLabel">设备使用单位</div>
                <div class="lrCellValue">{{ orderInfo.useCompanyName }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">申请到货日期</div>
                <div class="lrCellValue">
                  {{ orderInfo.appyArrivalTime }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">申请原因</div>
                <div class="lrCellValue">
                  {{ orderInfo.applyReason }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="16">
              <div class="lrCellInfo">
                <div class="lrCellLabel">备注</div>
                <div class="lrCellValue">
                  {{ orderInfo.remark }}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-card class="box-card" style="margin-top: 50px">
      <div slot="header" class="clearfix">
        <span>采购明细</span>
      </div>
      <div>
        <vxe-table ref="xTable" border resizable show-overflow :data="tableData">
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="name" title="设备名称"></vxe-table-column>
          <vxe-table-column field="models" title="规格型号"></vxe-table-column>
          <vxe-table-column
            field="type"
            title="设备类型"
            :formatter="({ cellValue }) => $getLabel(equipmentTypeList, cellValue)"
          ></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="type" title="设备类别"></vxe-table-column>
          <vxe-table-column field="manufacturer" title="生产厂家"></vxe-table-column>
          <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
          <vxe-table-column field="number" title="申请采购数量"></vxe-table-column>
          <vxe-table-column field="univalence" title="单价"></vxe-table-column>
          <vxe-table-column field="total" title="合价">
            <template slot-scope="{ row }">
              {{ row.univalence && row.number && row.number * row.univalence }}</template
            ></vxe-table-column
          >
        </vxe-table>
        <p style="margin-top: 10px">采购金额（元)：{{ totalMoney }}</p>
      </div>
    </el-card>
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
      <el-button v-if="orderInfo.status === 0" type="primary" @click="handleSubmit">保存并提交</el-button>
      <el-button v-if="orderInfo.status === 1" type="primary" @click="handleAudit">审核</el-button>
      <el-button v-if="orderInfo.status === (2 || 3)" type="primary" @click="handlePurchase">采购</el-button>
      <el-button v-if="orderInfo.status === 4" type="primary" @click="handleReceiveConfirm">到货确认</el-button>
      <el-button v-if="orderInfo.status === 5" type="primary" @click="handleVerificationAcceptance">检定验收</el-button>
      <el-button v-if="orderInfo.status === 6" type="primary" @click="handleInstore">执行入库</el-button>
    </div>
    <PurchaseModel
      v-if="purchaseVisible"
      :id="id"
      :visible.sync="purchaseVisible"
      @submit="handlePurchaseClick"
    ></PurchaseModel>
    <ReceiveConfirmModel
      v-if="receiveConfirmVisible"
      :id="id"
      :visible.sync="receiveConfirmVisible"
      @submit="handleReceiveConfirmClick"
    ></ReceiveConfirmModel>
    <VerificationAcceptanceModel
      v-if="verificationAcceptanceVisible"
      :id="id"
      :visible.sync="verificationAcceptanceVisible"
      @submit="handleVerificationAcceptanceClick"
    ></VerificationAcceptanceModel>
    <InstoreModel
      v-if="instoreVisible"
      :id="id"
      :visible.sync="instoreVisible"
      @submit="handleInstoreClick"
    ></InstoreModel>
    <AuditModel v-if="auditVisible" :id="id" :visible.sync="auditVisible" @submit="handleAuditClick"></AuditModel>
  </div>
</template>

<script>
import statusList from '../lib/statusList'
import equipmentTypeList from '../lib/equipmentTypeList'
import Api from './api/index'
import PurchaseModel from '@/views/suppliesEquipment/equipmentPurchase/components/PurchaseModel'
import ReceiveConfirmModel from '@/views/suppliesEquipment/equipmentPurchase/components/ReceiveConfirmModel'
import VerificationAcceptanceModel from '@/views/suppliesEquipment/equipmentPurchase/components/VerificationAcceptanceModel'
import InstoreModel from '@/views/suppliesEquipment/equipmentPurchase/components/InstoreModel'
import AuditModel from '@/views/suppliesEquipment/equipmentPurchase/components/AuditModel'

export default {
  name: 'EquipmentPurchaseDetail',
  components: { PurchaseModel, ReceiveConfirmModel, VerificationAcceptanceModel, InstoreModel, AuditModel },
  data() {
    return {
      id: this.$route.params.id,
      orderInfo: {},
      statusList,
      equipmentTypeList,
      tableData: [],
      totalMoney: 0,
      purchaseVisible: false, //c采购弹窗
      receiveConfirmVisible: false, //到货确认
      verificationAcceptanceVisible: false, //检定验收
      instoreVisible: false, //入库
      auditVisible: false //审核
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let res = await Api.getEquipmentPurchaseById(this.id)
      this.orderInfo = res.data
      this.tableData = [...res.data.purchaseDetails]
      this.tableData.map(item => (this.totalMoney += item.combinedPrice))
    },
    handleEdit() {
      this.$router.push({ name: `EquipmentPurchaseEdit`, params: { id: this.id } })
    },
    handlePurchase() {
      this.purchaseVisible = true
    },
    //弹窗采购点击
    async handlePurchaseClick() {
      await Api.makeEquipmentPurchase(this.id)
      this.purchaseVisible = false
      this.$message.success('采购成功')
      this.$router.go(-1)
    },
    //到货确认
    handleReceiveConfirm() {
      this.receiveConfirmVisible = true
    },
    async handleReceiveConfirmClick(data) {
      await Api.getReceiveConfirm({ id: this.id, purchaseDetails: data })
      this.receiveConfirmVisible = false
      this.$message.success('到货确认成功')
      this.$router.go(-1)
    },
    //鉴定验收
    handleVerificationAcceptance() {
      this.verificationAcceptanceVisible = true
    },
    async handleVerificationAcceptanceClick(data) {
      await Api.getVerificationAcceptance({ id: this.id, purchaseDetails: data })
      this.verificationAcceptanceVisible = false
      this.$message.success('鉴定验收成功')
      this.$router.go(-1)
    },
    //入库操作
    handleInstore() {
      this.instoreVisible = true
    },
    async handleInstoreClick() {
      await Api.getEquipmentInstore(this.id)
      this.instoreVisible = false
      this.$message.success('入库成功')
      this.$router.go(-1)
    },
    //审核操作
    handleAudit() {
      this.auditVisible = true
    },
    async handleAuditClick(data) {
      await Api.getAudit({ ...data, id: this.id })
      this.auditVisible = false
      this.$message.success('审核成功')
      this.$router.go(-1)
    },
    //提交审核
    async handleSubmit() {
      await Api.updateEquipmentPurchase({
        ...this.orderInfo,
        status: 1
      })
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>
