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
            <el-form-item label="支付时间" label-width="80px" prop="payTime">
              <el-date-picker
                v-model="filter.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 300px"
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
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
        <el-button @click="$refs.form.resetFields()">重置</el-button>
      </div>
    </div>
    <div class="tableWrapper">
      <vxe-table ref="xTable" border :data="tableData" :edit-config="{ trigger: 'manual', mode: 'row' }">
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="contractCode" title="合同编号" width="150">
          <template slot-scope="{ row }">
            <span style="margin: 0 3px">
              <a @click="handleContractDetail(row.contractId)">{{ row.contractCode }}</a></span
            >
          </template>
        </vxe-table-column>
        <vxe-table-column field="name" title="付款单编号" width="150">
          <template slot-scope="{ row }">
            <span style="margin: 0 3px">
              <a @click="handleDetail(row.id)">{{ row.name }}</a></span
            >
          </template>
        </vxe-table-column>
        <vxe-table-column field="payer" title="付款方" width="150" />
        <vxe-table-column field="beneficiary" title="收款方" width="150" />
        <vxe-table-column field="name" title="付款单名称" width="150" />
        <vxe-table-column field="totalAmount" title="申报金额合计（元）" width="150" />
        <vxe-table-column field="paymentStage" title="支付阶段" width="150">
          <template slot-scope="{ row }">
            <span>{{
              row.paymentStage ? paymentStatus.filter(item => item.value === row.paymentStage)[0].label : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="paymentTime" title="支付时间" width="150" />
        <vxe-table-column field="status" title="付款状态" width="120">
          <template slot-scope="{ row }">
            <span>{{ payStatus.filter(item => item.value === row.status)[0].label }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="auditMoney" title="审批金额（元）" width="150" />
        <vxe-table-column field="realPaymentTime" title="实际支付时间" width="120" />
        <vxe-table-column field="paymentMoney" title="已支付金额（元）" width="150" />
        <vxe-table-column field="creatorName" title="创建人" width="100" />
        <vxe-table-column field="createTime" title="创建时间" width="120" />
        <vxe-table-column field="remark" title="备注" width="150" />
        <vxe-table-column title="操作" width="120">
          <template slot-scope="{ row }">
            <template v-if="row.status === 1">
              <span style="margin: 0 3px"><a @click="handleCheck(row)">审核</a></span>
            </template>
            <template v-else>
              <span style="margin: 0 3px"> <a @click="handleDetail(row)">查看</a></span>
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
  </div>
</template>
<script>
import paymentStatus from '@/lib/paymentStatus' //支付阶段
import payStatus from '@/lib/payStatus' //付款状态
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'ContractMeasurementPaymentCheck',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
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
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleDetail(row) {
      console.log(row)
      this.$router.push({
        name: `ContractMeasurementPaymentDetail`,
        params: { row: row, isCheck: false, isEdit: false }
      })
    },
    handleCheck(row) {
      console.log(111, row)
      let { paymentStage, id } = row
      switch (paymentStage) {
        case 1:
          this.$router.push({ name: `ContractMeasurementPaymentCheckDetail`, params: { id: id, isCheck: true } })
          break
        case 2:
          this.$router.push({ name: `ProjectProcessCheckDetail`, params: { id: id, isCheck: true } })
          break
        case 3:
          this.$router.push({ name: `FinalPaymentCheckDetail`, params: { id: id, isCheck: true } })
          break
        case 4:
          this.$router.push({ name: `RefundDepositCheckDetail`, params: { id: id, isCheck: true } })
          break
        default:
          return false
      }
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
      this.$router.push(`/contract/manage/detail/${id}`)
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
    flex: 0 0 200px;
    text-align: right;
  }
}
.dropdownItem {
  width: 120px;
  text-align: center;
}
</style>
