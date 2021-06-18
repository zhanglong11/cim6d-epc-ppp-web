<template>
  <div class="contentWrapper">
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
            <el-form-item label="支付阶段" label-width="80px" prop="paymentStage" style="margin-right: 20px">
              <PaymentStatusSelect v-model="filter.paymentStage"></PaymentStatusSelect>
            </el-form-item>
            <el-form-item label="付款状态" label-width="80px" prop="status" style="margin-right: 20px">
              <PayStatusSelect v-model="filter.status"></PayStatusSelect>
            </el-form-item>
            <!--
               /**
                任务名称：BUG#1414  合同管理-合同计量与支付：以“支付时间”、“实际支付时间”、“创建时间”为查询条件，查询时页面报错
                开发人员：崔洛宜
                日期：2020-03-31
                BUG类型：测试人员发现的研发自测未通过引起的BUG
                **/
           -->
            <el-form-item label="支付时间" label-width="80px" prop="payTime">
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
        <el-button
          @click="
            () => {
              $refs.form.resetFields()
              refresh(true)
            }
          "
          >重置</el-button
        >
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="8">
        <el-dropdown placement="bottom-start" size="medium" @command="handleAddClick">
          <el-button type="primary"> 新建合同付款单<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="$hasPower('ProjectProcess')" class="dropdownItem" divided :command="5"
              >工程进度款(总价)</el-dropdown-item
            >
            <el-dropdown-item v-if="$hasPower('ProjectProcess')" class="dropdownItem" divided :command="1"
              >工程进度款(清单)</el-dropdown-item
            >
            <el-dropdown-item v-if="$hasPower('Prepayment')" class="dropdownItem" divided :command="2"
              >预付款</el-dropdown-item
            >
            <el-dropdown-item v-if="$hasPower('FinalPayment')" class="dropdownItem" divided :command="3"
              >最终付款</el-dropdown-item
            >
            <el-dropdown-item v-if="$hasPower('RefundDeposit')" class="dropdownItem" divided :command="4"
              >退还保证金</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button v-if="$hasPower('FinancePayAdd')" style="margin-left: 10px" @click="handleAddFinancePay">
          财务支付填报
        </el-button> -->
      </el-col>
      <!--      <el-col :span="6" style="text-align: right"> <a @click="handleDownload">下载合同范本</a></el-col>-->
    </el-row>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        v-loading="loading"
        :show-overflow="false"
        border
        :data="tableData"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="contractCode" title="合同编号" min-width="120">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ContractDetail')" style="margin: 0 3px">
              <a @click="handleContractDetail(row.contractId)">{{ row.contractCode }}</a></span
            >
            <span v-else>
              {{ row.contractCode }}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="code" title="付款单编号" min-width="120">
          <!--
           /**
           任务名称：BUG1594 合同管理-合同计量与支付-付款单编号点击应该可以跳转详情页
           开发人员：崔洛宜
           日期：2020-04-14
           BUG类型：测试人员发现的研发自测未通过引起的BUG
           **/
       -->
          <template slot-scope="{ row }">
            <span v-if="$hasPower('PaymentDetail')" style="margin: 0 3px">
              <a @click="handleDetail(row)">{{ row.code }}</a></span
            >
            <span v-else>{{ row.code }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="payer" title="付款方" min-width="120" />
        <vxe-table-column field="payee" title="收款方" min-width="120" />
        <!--
       /**
       任务名称：1103/合同计量与支付缺少付款单名称一列
       开发人员：崔洛宜
       日期：2020-03-18
       BUG类型：1、测试人员提出的系统性BUG
       **/
      -->
        <vxe-table-column field="name" title="付款单名称" min-width="120">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
            <el-tooltip
              v-if="row.paymentFlag > 1"
              class="item"
              effect="dark"
              :content="
                row.paymentFlag === 2 ? '付款方未在平台中，属内部支付流程。' : '收款方未在平台中，属内部支付流程。'
              "
              placement="right"
            >
              <span class="el-icon-warning" style="color: #409eff; font-size: 16px"></span>
            </el-tooltip>
          </template>
        </vxe-table-column>
        <vxe-table-column field="totalAmount" title="申报金额合计（元）" min-width="150" />
        <vxe-table-column field="paymentStage" title="支付阶段" min-width="150">
          <template slot-scope="{ row }">
            <span>{{
              row.paymentStage ? paymentStatus.filter(item => item.value === row.paymentStage)[0].label : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="paymentTime" title="支付时间" min-width="120">
          <!--
              /**
                 任务名称：BUG1250 合同管理-合同计量与支付-支付时间只有日期，没有时分秒
                 开发人员：崔洛宜
                 日期：2020-03-23
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
          -->
          <template slot-scope="{ row }">
            <span>{{ moment(row.paymentTime).format('YYYY-MM-DD') }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="付款状态" min-width="120">
          <template slot-scope="{ row }">
            <span>{{ payStatus.filter(item => item.value === row.status)[0].label }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="auditMoney" title="审批金额（元）" min-width="120" />
        <vxe-table-column field="realPaymentTime" title="实际支付时间" min-width="150" />
        <vxe-table-column field="paymentMoney" title="已支付金额（元）" min-width="150" />
        <vxe-table-column field="creatorName" title="创建人" min-width="120" />
        <vxe-table-column field="createTime" title="创建时间" min-width="150" />
        <vxe-table-column field="remark" title="备注" min-width="120" />
        <vxe-table-column title="操作" width="150" fixed="right">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('PaymentDetail')" style="margin: 0 3px"> <a @click="handleDetail(row)">查看</a></span>
            <template v-if="row.status === 0">
              <span
                v-if="
                  $hasPower('PrepaymentEdit') ||
                  $hasPower('ProjectProcessEdit') ||
                  $hasPower('FinalPaymentEdit') ||
                  $hasPower('RefundDepositEdit')
                "
                style="margin: 0 3px"
                ><a @click="handleEdit(row)">编辑</a></span
              >
              <span v-if="$hasPower('ContractMeasurementPaymentRemove')" style="margin: 0 3px"
                ><a @click="handleDelete(row.id)">删除</a></span
              >
            </template>
            <template v-if="row.status === 2 || row.status === 4 || row.status === 5">
              <span v-if="$hasPower('AddFinancePay')" style="margin: 0 3px">
                <a @click="handAddPay(row)">{{ row.status === 5 ? '填报记录' : '支付填报' }}</a>
              </span>
            </template>
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
      :disabled="selectPaymentStatus === 5"
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
  components: {
    PayDialog
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      loading: false,
      filter: {
        keyword: '',
        paymentStage: null,
        status: null,
        payTime: [],
        realPayTime: [],
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      paymentStatus: paymentStatus,
      payStatus: payStatus,
      payDialogVisible: false, // 支付填报模态框
      selectId: '', // 支付填报模选择的id
      selectPaymentStatus: '' // 支付填报模状态
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    // 支付填报
    handAddPay(row) {
      this.payDialogVisible = true
      this.selectId = row.id
      this.selectPaymentStatus = row.status
    },
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
        paymentStartTime: this.filter.payTime?.[0],
        paymentEndTime: this.filter.payTime?.[1],
        realPaymentStartTime: this.filter.realPayTime?.[0],
        realPaymentEndTime: this.filter.realPayTime?.[1],
        createStartTime: this.filter.createTime?.[0],
        createEndTime: this.filter.createTime?.[1]
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
    handleDetail(row) {
      let { paymentStage, id } = row
      this.$router.push({ name: `PaymentDetail`, params: { id: id, isEdit: false, isCheck: false } })
    },
    handleAddFinancePay() {
      this.$router.push({ name: `FinancePayAdd`, params: {} })
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
      // this.$router.push(`Detail/${id}`)
      this.$router.push({
        name: 'ContractDetail',
        params: { id }
      })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    // 编辑合同付款单
    handleEdit(row) {
      let { paymentStage, id } = row
      switch (paymentStage) {
        case '1':
          this.$router.push({ name: `ProjectProcessEdit`, params: { row: row, isEdit: true }, query: { paymentStage } })
          break
        case '2':
          this.$router.push({ name: `PrepaymentEdit`, params: { id: id, isEdit: true }, query: { paymentStage } })
          break
        case '3':
          this.$router.push({ name: `FinalPaymentEdit`, params: { id: id, isEdit: true }, query: { paymentStage } })
          break
        case '4':
          this.$router.push({ name: `RefundDepositEdit`, params: { id: id, isEdit: true }, query: { paymentStage } })
          break
        case '5':
          this.$router.push({
            name: `EditProjectProcessTotal`,
            params: { id: id, isEdit: true },
            query: { paymentStage }
          })
          break
        default:
          return false
      }
    },
    // 新建合同付款单
    handleAddClick(paymentStage) {
      switch (paymentStage) {
        case 1:
          this.$router.push({ name: `ProjectProcess`, query: { paymentStage } })
          break
        case 2:
          this.$router.push({ name: `Prepayment`, query: { paymentStage } })
          break
        case 3:
          this.$router.push({ name: `FinalPayment`, query: { paymentStage } })
          break
        case 4:
          this.$router.push({ name: `RefundDeposit`, query: { paymentStage } })
          break
        case 5:
          this.$router.push({ name: `ProjectProcessTotal`, query: { paymentStage } })
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
