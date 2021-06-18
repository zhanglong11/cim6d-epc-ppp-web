<template>
  <div class="contentWrapper indexWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <div>
            <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px">
              <el-input
                v-model="filter.keyword"
                placeholder="合同编号/付款名称/付款方/收款方/创建人"
                style="width: 280px"
              >
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="支付阶段" label-width="120px" prop="paymentStage" style="margin-right: 20px">
              <PaymentStatusSelect v-model="filter.paymentStage"></PaymentStatusSelect>
            </el-form-item>
            <!--<el-form-item label="付款状态" label-width="120px" prop="status" style="margin-right: 20px">
              <PayStatusSelect v-model="filter.status"></PayStatusSelect>
            </el-form-item>-->
            <!--
          /**
           任务名称：BUG1447 合同管理-财务支付填报：以时间为查询条件，查询时页面出现异常报错信息
           开发人员：崔洛宜
           日期：2020-03-31
           BUG类型：测试人员发现的研发自测未通过引起的BUG
           **/
        -->
            <el-form-item label="支付时间" label-width="120px" prop="payTime">
              <el-date-picker
                v-model="filter.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 300px"
                value-format="yyyy-MM-dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="实际支付时间" label-width="120px" prop="realPayTime" style="margin-right: 20px">
              <el-date-picker
                v-model="filter.realPayTime"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 300px"
                value-format="yyyy-MM-dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="创建时间" label-width="120px" prop="createTime">
              <el-date-picker
                v-model="filter.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 300px"
                value-format="yyyy-MM-dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
        <!--
          /**
           任务名称：BUG1447 合同管理-财务支付填报：以时间为查询条件，查询时页面出现异常报错信息
           开发人员：崔洛宜
           日期：2020-03-31
           BUG类型：测试人员发现的研发自测未通过引起的BUG
           **/
        -->
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        v-loading="loading"
        border
        :data="tableData"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="contractCode" title="合同编号" width="120">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ContractDetail')" style="margin: 0 3px">
              <a @click="handleContractDetail(row.contractId)">{{ row.contractCode }}</a></span
            >
            <span></span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="code" title="付款单编号" width="120">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('PaymentDetail')" style="margin: 0 3px">
              <a @click="handleDetail(row.id)">{{ row.code }}</a></span
            >
            <span>
              {{ row.code }}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="payer" title="付款方" width="120" />
        <vxe-table-column field="payee" title="收款方" width="120" />
        <!--
       /**
       任务名称：1103/合同计量与支付缺少付款单名称一列
       开发人员：崔洛宜
       日期：2020-03-18
       BUG类型：1、测试人员提出的系统性BUG
       **/
      -->
        <vxe-table-column field="name" title="付款单名称" width="120" />
        <vxe-table-column field="totalAmount" title="申报金额合计（元）" width="150" />
        <vxe-table-column field="paymentStage" title="支付阶段" width="120">
          <template slot-scope="{ row }">
            <span>{{
              row.paymentStage ? paymentStatus.filter(item => item.value === row.paymentStage)[0].label : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="paymentTime" title="支付时间" width="120" />
        <vxe-table-column field="status" title="付款状态" width="120">
          <template slot-scope="{ row }">
            <span>{{ payStatus.filter(item => item.value === row.status)[0].label }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="auditMoney" title="审批金额（元）" width="120" />
        <vxe-table-column field="realPaymentTime" title="实际支付时间" width="120" />
        <vxe-table-column field="paymentMoney" title="已支付金额（元）" width="150" />
        <vxe-table-column field="creatorName" title="创建人" width="120" />
        <vxe-table-column field="createTime" title="创建时间" width="120" />
        <vxe-table-column field="remark" title="备注" width="120" />
        <vxe-table-column title="操作" width="120">
          <template slot-scope="{ row }">
            <!--
                /**
                 任务名称：BUG1448 合同管理-财务支付填报：点击”查看“按钮，在预支付详情页面，字段的值都不显示
                 开发人员：崔洛宜
                 日期：2020-03-31
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
            -->
            <span v-if="$hasPower('PaymentDetail')" style="margin: 0 3px"> <a @click="handleDetail(row)">查看</a></span>
            <span v-if="$hasPower('AddFinancePay')" style="margin: 0 3px"
              ><a @click="handAddPay(row)">支付填报</a></span
            >
          </template>
        </vxe-table-column>
      </vxe-table>
      <div style="margin-top: 10px">
        <div class="toolbar" style="display: flex; justify-content: space-between">
          <div class="num">
            共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
            <el-button type="text primary" class="el-icon-refresh" @click="refresh(false)"></el-button>
          </div>
          <el-pagination
            class="pagination"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="sizes, prev, pager, next, jumper"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
    <PayDialog
      v-if="payDialogVisible"
      :paymentId="selectId"
      :visible="payDialogVisible"
      @close="payDialogVisible = false"
      @refreshTable="refresh(true)"
    >
    </PayDialog>
  </div>
</template>
<script>
import paymentStatus from '@/lib/paymentStatus' //支付阶段
import payStatus from '@/lib/payStatus' //付款状态
import PayDialog from './PayDialog'
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'ContractMeasurementPayment',
  components: { PayDialog },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      loading: false,
      payDialogVisible: false,
      selectId: '',
      filter: {
        keyword: '',
        paymentStage: null,
        /* status: 2,*/
        statusList: [2, 4, 5],
        payTime: [],
        realPayTime: [],
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      paymentStatus: paymentStatus,
      payStatus: payStatus
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      this.loading = true
      Api.getContractMeasurementPaymentList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        paymentStartTime: this.filter.payTime[0],
        paymentEndTime: this.filter.payTime[1],
        realPaymentStartTime: this.filter.realPayTime[0],
        realPaymentEndTime: this.filter.realPayTime[1],
        createStartTime: this.filter.createTime[0],
        createEndTime: this.filter.createTime[1]
      })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.records
            this.total = res.data.total
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
        .finally(() => (this.loading = false))
    },
    /**
     任务名称：BUG1447 合同管理-财务支付填报：以时间为查询条件，查询时页面出现异常报错信息
     开发人员：崔洛宜
     日期：2020-03-31
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/
    reset() {
      this.$refs.form.resetFields()
      this.refresh(true)
    },
    /**
     任务名称：BUG1448 合同管理-财务支付填报：点击”查看“按钮，在预支付详情页面，字段的值都不显示
     开发人员：崔洛宜
     日期：2020-03-31
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/
    handleDetail(row) {
      this.$router.push({
        name: `ContractMeasurementPaymentDetail`,
        params: { row: row, id: row.id, isCheck: false }
      })
    },
    handAddPay(row) {
      this.payDialogVisible = true
      this.selectId = row.id
    },
    handleEdit(row) {
      let { paymentStage, id } = row
      switch (paymentStage) {
        case 1:
          this.$router.push({ name: `Prepayment`, params: { id: id, isEdit: true } })
          break
        case 2:
          this.$router.push({ name: `ProjectProcess`, params: { id: id, isEdit: true } })
          break
        case 3:
          this.$router.push({ name: `FinalPayment`, params: { id: id, isEdit: true } })
          break
        case 4:
          this.$router.push({ name: `RefundDeposit`, params: { id: id, isEdit: true } })
          break
        default:
          return false
      }
      //this.$router.push({ name: `ContractAdd`, params: { id: id, isEdit: true } })
    },
    handleDelete(id) {
      Api.deleteContractMeasurementPaymentById(id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.refresh()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleContractDetail(id) {
      this.$router.push(`Detail/${id}`)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    handleAddClick(command) {
      switch (command) {
        case 'a':
          this.$router.push({ name: `Prepayment`, params: {} })
          break
        case 'b':
          this.$router.push('ProjectProcess')
          break
        case 'c':
          this.$router.push('FinalPayment')
          break
        case 'd':
          this.$router.push('RefundDeposit')
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
.contentWrapper {
  padding: 10px;
}
.tableWrapper {
  margin-top: 20px;
}
.headContainer {
  display: flex;
  justify-content: space-between;
  .formWrapper {
    flex: 1;
  }
  .operateButton {
    flex: 0 0 150px;
    text-align: right;
  }
}
.dropdownItem {
  width: 120px;
  text-align: center;
}
/deep/ .el-range-separator {
  width: 20px;
}
</style>
