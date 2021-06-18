<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div class="header baseInfo">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ info.code }}</span>
        </h6>
        <div class="statusWrapper">
          <!-- <div v-if="info.status === 0" class="details-title">
            <el-button type="primary" style="margin-left: 50px; margin-bottom: 15px;" @click="toEdit(id)"
              >编辑</el-button
            >
          </div> -->
          <p class="gray">计划状态</p>
          <p>{{ $getLabel(purchaseStatus, info.status) }}</p>
        </div>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="24">
            <span class="label">审批人:</span>
            <span>{{ info.firstAuditPersonName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">申请部门:</span>
            <span>{{ info.applyDepartmentName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">申请时间:</span>
            <span>{{ info.applyTime }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">申请到货时间:</span>
            <span>{{ info.appyArrivalTime }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">申请原因:</span>
            <span>{{ info.applyReason }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">备注:</span>
            <span>{{ info.remark }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 采购明细 start -->
    <el-card class="box-card">
      <div slot="header" class="detailList">
        <div>采购明细</div>
      </div>
      <div>
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          :data="tableData"
          :edit-config="{ trigger: 'click', mode: 'cell', autoClear: false }"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="材料编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="材料名称"></vxe-table-column>
          <vxe-table-column field="materialModels" title="规格型号"></vxe-table-column>
          <vxe-table-column field="materialUnit" title="单位"></vxe-table-column>
          <vxe-table-column field="materialBrand" title="品牌"></vxe-table-column>
          <vxe-table-column field="materialSupplier" title="供应商"></vxe-table-column>
          <vxe-table-column field="materialInventoryNumber" title="库存量"></vxe-table-column>
          <vxe-table-column field="number" title="申请采购数量"></vxe-table-column>
          <vxe-table-column field="univalence" title="单价"></vxe-table-column>
          <vxe-table-column field="combinedPrice" title="合价">
            <template slot-scope="{ row }"> {{ row.univalence && row.number && row.number * row.univalence }}</template>
          </vxe-table-column>
          <div v-if="info.status === 5">
            <vxe-table-column field="arrivalNumber" title="到货数量"></vxe-table-column>
            <vxe-table-column field="enableInputNumber" title="可入库量"></vxe-table-column>
            <vxe-table-column field="remark" title="备注"></vxe-table-column>
          </div>
          <!--          <vxe-table-column field="unit" title="操作">-->
          <!--            <template slot-scope="{ row }">-->
          <!--              <span style="margin: 0 3px"><a @click="handleDeleteRow(row)">删除</a></span></template-->
          <!--            >-->
          <!--          </vxe-table-column>-->
        </vxe-table>
      </div>
    </el-card>
    <!-- 采购明细 end -->
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button
        v-if="info.status === 1 && info.currentPersonId === $store.state.user.id"
        size="lg"
        type="primary"
        @click="checkVisible = true"
        >审核</el-button
      >
      <el-button
        v-if="info.status === 2 && info.currentPersonId === $store.state.user.id"
        size="lg"
        type="primary"
        @click="purchaseVisible = true"
        >采购</el-button
      >
      <el-button
        v-if="info.status === 4 && info.currentPersonId === $store.state.user.id"
        size="lg"
        type="primary"
        @click="receiveGoodsVisible = true"
        >到货通知</el-button
      >
      <el-button
        v-if="info.status === 5 && info.currentPersonId === $store.state.user.id"
        size="lg"
        type="primary"
        @click="handleStorage"
        >执行入库</el-button
      >
      <!--审核弹窗 start-->
      <el-dialog title="审核" :visible.sync="checkVisible" width="500px" :modal-append-to-body="false">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
          <el-form-item label="审核结果" prop="auditStatus">
            <el-radio-group v-model="form.auditStatus">
              <el-radio label="1">通过</el-radio>
              <el-radio label="0">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input v-model="form.auditOpinion" type="textarea" placeholder="请填写审核原因" />
          </el-form-item>
          <!--精装修 独有 start-->
          <el-form-item label="是否继续审核">
            <el-radio-group v-model="isAuditValue">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="isAuditValue === '0' ? '采购人' : '下一审核人'" prop="nextPerson">
            <SelectUser
              :id.sync="form.nextPersonId"
              prop="nextPerson"
              :value="form.nextPersonId ? { id: form.nextPersonId, label: form.nextPerson } : null"
              :name.sync="form.nextPerson"
            />
          </el-form-item>

          <!--精装修 独有 end-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="checkVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCheck">确 定</el-button>
        </div>
      </el-dialog>
      <!--审核弹窗 end-->
      <!--精装修独有 采购 start-->
      <PurchaseDialog
        v-if="purchaseVisible"
        :visible="purchaseVisible"
        :detailList="tableData"
        @close="purchaseVisible = false"
        @getTarget="handlePurchase"
      ></PurchaseDialog>
      <!--精装修独有 采购 end-->

      <!--到货通知 弹窗 start-->
      <ReceiveGoodsDialog
        v-if="receiveGoodsVisible"
        :visible="receiveGoodsVisible"
        :detailList="tableData"
        @close="receiveGoodsVisible = false"
        @getTarget="handleReceiveGoods"
      >
      </ReceiveGoodsDialog>

      <!--到货通知 弹窗 end-->
    </div>
  </div>
</template>

<script>
import Api from '@/api/supplies/material/procurement'
import purchaseStatus from './lib/purchaseStatus'
import ReceiveGoodsDialog from '@/views/suppliesEquipment/materialManage/procurement/lib/ReceiveGoodsDialog'
import PurchaseDialog from './lib/PurchaseDialog'
export default {
  name: 'ProcurementDetail',
  components: {
    ReceiveGoodsDialog,
    PurchaseDialog
  },
  data() {
    // 这里存放数据
    return {
      tableLoading: true,
      purchaseStatus,
      receiveGoodsVisible: '',
      purchaseVisible: '',
      tableData: [],
      id: '',
      info: {},
      type: '',
      checkVisible: false,
      form: {},
      isAuditValue: '1',
      nextPerson: '',
      rules: {
        auditStatus: [{ required: true, message: '审核结果必填' }],
        nextPerson: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    this.type = this.$route.params.type
    this.id = this.$route.params.id
    this.getPurchaseOrderDetail()
  },
  mounted() {},
  // 方法集合
  methods: {
    async getPurchaseOrderDetail() {
      const res = await Api.getPurchaseOrderDetail(this.id)
      this.info = res.data
      this.tableData = res.data.detailList || []
      this.tableLoading = false
    },
    //编辑
    toEdit(id) {
      console.log(_.isNil(id))
      _.isNil(id)
        ? this.$router.push({ name: `ProcurementAdd` })
        : this.$router.push({ name: `ProcurementEdit`, params: { id } })
    },
    // 审核中 进行审核
    handleCheck() {
      let obj = {
        // auditStatus: 1,
        purchaseId: this.info.id
      }
      this.axios.material.post(`materialPurchase/audit`, { ...this.form, ...obj }).then(res => {
        this.$message.success('审核完成')
        setTimeout(() => {
          this.goBack()
        }, 1000)
      })
    },
    //采购中 到货确认
    handleReceiveGoods(e) {
      // console.log(e.checked)
      // this.$refs.xTable111.validate().then(() => {})
      let list = e.checked.map(item => {
        return {
          arrivalNumber: item.arrivalNumber,
          enableInputNumber: item.enableInputNumber,
          materialId: item.materialId,
          purchaseId: this.info.id,
          remark: item.remark,
          univalence: item.univalence
        }
      })
      let obj = {
        auditOpinion: '',
        // auditStatus: 1,
        purchaseId: this.info.id,
        detialAddList: list,
        nextPerson: ''
      }
      this.axios.material.post(`materialPurchase/arrivalConfirm`, obj).then(res => {
        this.$message.success('确认收货')
        setTimeout(() => {
          this.goBack()
        }, 500)
      })
    },
    // getTarget(e) {
    //   console.log(e)
    // },
    // 已通过 进行采购
    async handlePurchase() {
      let obj = {
        purchaseId: this.info.id,
        nextPerson: ''
      }
      // await this.$refs.formPerson.validate()
      this.axios.material.post(`materialPurchase/purchase`, obj).then(res => {
        this.$message.success('采购成功')
        setTimeout(() => {
          this.goBack()
        }, 500)
      })
    },
    //待入库 进行入库操作
    handleStorage() {
      let purchaseId = this.info.id
      this.axios.material.post(`materialPurchase/executeInput/${purchaseId}`).then(res => {
        this.$message.success('入库成功')
        setTimeout(() => {
          this.goBack()
        }, 500)
      })
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.header {
  display: flex;
  justify-content: flex-end;
  margin-top: -41px;
}
.header.baseInfo {
  display: block;
  position: relative;
  margin-top: 0;
  .title {
    padding: 10px;
    font-size: 20px;
    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: url('~@/assets/code-image.png') no-repeat center;
      vertical-align: -4px;
      margin-right: 15px;
    }
  }
  .statusWrapper {
    position: absolute;
    top: 20px;
    right: 50px;
    z-index: 20;
  }
}
.details {
  font-size: 14px;
  margin-top: 20px;
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #999;
    display: inline-block;
    width: 103px;
  }
  .title {
    margin-bottom: 30px;
    font-size: 20px;
  }
  .upload-con {
    display: flex;
    .upload-list {
      margin-bottom: 10px;
    }
  }
}
.title-btn {
  float: right;
  display: flex;
  justify-content: space-around;
  align-items: center;
  > p {
    margin-right: 10px;
    > span + span {
      margin-left: 10px;
    }
  }
}
/deep/.details {
  .label {
    margin-bottom: 10px;
  }
}
/deep/ .el-divider--horizontal {
  margin: 10px 0 20px 0;
}
.statusWrapper {
  position: relative;
  top: 55px;
  right: 50px;
  text-align: center;
  .gray {
    color: #ccc;
  }
}
.footer-btn {
  z-index: 1000;
  justify-content: flex-end;
  padding-right: 250px !important;
}
/*.el-dialog__wrapper {*/
/*  z-index: 111111 !important;*/
/*}*/
</style>
