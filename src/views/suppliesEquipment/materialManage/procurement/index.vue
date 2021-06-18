<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="" label-width="0" prop="content" style="margin-right: 20px">
          <el-input v-model="filterForm.keyword" placeholder="采购单号/申请人/申请部门" style="width: 300px">
            <i slot="suffix" class="el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="申请时间">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate" />
        </el-form-item>
        <el-form-item label="处理状态" label-width="100px" prop="supplyStatus" style="margin-right: 20px">
          <el-select v-model="filterForm.status" placeholder="请选择">
            <el-option
              v-for="item in purchaseStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('ProcurementList')">
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('ProcurementAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
            >新建采购申请</el-button
          >
        </el-form-item>
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
      <vxe-table-column field="appyArrivalTime" title="申请到货时间" width="200" formatter="ymd">
        <!--        <template slot-scope="{ row }"> {{ row.appyArrivalTime | ymd }}</template>-->
      </vxe-table-column>

      <vxe-table-column field="applyReason" title="申请原因"></vxe-table-column>
      <vxe-table-column
        field="status"
        title="处理状态"
        :formatter="({ cellValue }) => $getLabel(purchaseStatus, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <template
            v-if="row.status === 1 && row.currentPersonId === $store.state.user.id && $hasPower('ProcurementAudit')"
          >
            <span style="margin: 0 3px"><a @click="toDetail(row.id)">审核</a></span>
          </template>
          <template
            v-if="
              row.status === (2 || 3) && row.currentPersonId === $store.state.user.id && $hasPower('ProcurementBuyer')
            "
          >
            <span style="margin: 0 3px"><a @click="toDetail(row.id)">采购</a></span>
          </template>
          <template
            v-if="row.status === 4 && row.currentPersonId === $store.state.user.id && $hasPower('ProcurementArrival')"
          >
            <span style="margin: 0 3px"><a @click="toDetail(row.id)">到货确认</a></span>
          </template>
          <template
            v-if="row.status === 5 && row.currentPersonId === $store.state.user.id && $hasPower('ProcurementInt')"
          >
            <span style="margin: 0 3px"><a @click="toDetail(row.id)">执行入库</a></span>
          </template>
          <span v-if="$hasPower('ProcurementDetail')" style="margin: 0 3px">
            <a @click="toDetail(row.id)">查看</a></span
          >
          <template v-if="row.status === 0">
            <span v-if="$hasPower('ProcurementEdit')" style="margin: 0 3px"><a @click="toEdit(row.id)">编辑</a></span>
            <span v-if="$hasPower('ProcurementDelete')" style="margin: 0 3px"><a @click="remove(row)">删除</a></span>
          </template>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '@/api/supplies/material/procurement'
import purchaseStatus from './lib/purchaseStatus'
export default {
  name: 'Procurement',
  data() {
    return {
      activeId: null,
      filterForm: {},
      selectedList: [],
      purchaseStatus,
      request: body => {
        return Api.getPurchaseOrderList(body)
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    toEdit(id) {
      console.log(_.isNil(id))
      _.isNil(id)
        ? this.$router.push({ name: `ProcurementAdd` })
        : this.$router.push({ name: `ProcurementEdit`, params: { id } })
    },
    toDetail(id) {
      this.$router.push({ name: `ProcurementDetail`, params: { id } })
    },
    async remove(rows) {
      // console.log(rows)
      await this.$tipRemove([rows])
      await Api.getPurchaseOrderDelete(rows.id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>
<style lang="less"></style>
