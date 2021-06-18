<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item>
          <el-input v-model="filterForm.search" placeholder="租赁单号/申请人/申请部门"></el-input>
        </el-form-item>
        <el-form-item label="添加时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="filterForm.status">
            <el-option v-for="e in rentStatusList" :key="e.key" :label="e.label" :value="e.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('EquipmentRentList')">
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button
            v-if="$hasPower('EquipmentRentAdd')"
            type="primary"
            icon="el-icon-plus"
            @click="$router.push('add')"
            >新建租赁申请</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="code" title="租赁单号"></vxe-table-column>
      <vxe-table-column field="applicantName" title="申请人"></vxe-table-column>
      <vxe-table-column field="applyTime" title="申请时间"></vxe-table-column>
      <vxe-table-column field="applyDepartmentName" title="申请部门"></vxe-table-column>
      <vxe-table-column field="usePart" title="使用位置"></vxe-table-column>
      <vxe-table-column field="userName" title="使用人"></vxe-table-column>
      <vxe-table-column field="useCompany" title="使用部门"></vxe-table-column>
      <vxe-table-column field="leasePeriod" title="租赁期限"></vxe-table-column>
      <vxe-table-column field="totalRent" title="租赁金额"></vxe-table-column>
      <vxe-table-column
        field="status"
        title="处理状态"
        :formatter="({ cellValue }) => $getLabel(rentStatusList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="200px">
        <template #default="{ row }">
          <router-link v-if="$hasPower('EquipmentRentDetail')" type="text" :to="'detail/' + row.id">查看</router-link>
          <router-link v-if="row.status === 0 && $hasPower('EquipmentRentEdit')" type="text" :to="'edit/' + row.id"
            >编辑</router-link
          >
          <el-button
            v-if="row.status === 1 && $hasPower('EquipmentRentExamine')"
            type="text"
            size="large"
            @click="audit(row)"
            >审核</el-button
          >
          <el-button
            v-if="row.status === 2 && $hasPower('EquipmentRentLease')"
            type="text"
            size="large"
            @click="rent(row)"
            >租赁</el-button
          >
          <el-button
            v-if="row.status === 4 && $hasPower('EquipmentRentArrival')"
            type="text"
            size="large"
            @click="confirm(row)"
            >到货确认</el-button
          >
          <el-button
            v-if="row.status === 7 && $hasPower('EquipmentRentVerification')"
            type="text"
            size="large"
            @click="check(row)"
            >检定验收</el-button
          >
          <el-button
            v-if="row.status === 5 && $hasPower('EquipmentRentWarehousing')"
            type="text"
            size="large"
            @click="warehousing(row)"
            >执行入库</el-button
          >
          <el-button v-if="$hasPower('EquipmentRentDelete')" type="text" @click="remove(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <AuditDialog :id="activeRow.id" :visible.sync="auditDialogVisible"></AuditDialog>
    <RentDialog :id="activeRow.id" :visible.sync="rentDialogVisible"></RentDialog>
    <ConfirmDialog :id="activeRow.id" :visible.sync="confirmDialogVisible"></ConfirmDialog>
    <CheckDialog :id="activeRow.id" :visible.sync="checkDialogVisible"></CheckDialog>
    <WarehousingDialog :id="activeRow.id" :visible.sync="warehousingDialogVisible"></WarehousingDialog>
  </div>
</template>

<script>
import sourceList from './lib/sourceList'
import equipmentStatus from './lib/equipmentStatus'
import equipmentType from '@/components/SelectEquipmentDialog/selectList/equipmentType'
import rentStatusList from './lib/rentStatusList'
import AuditDialog from './cpmponents/AuditDialog' //审核
import RentDialog from './cpmponents/RentDialog' //租赁
import ConfirmDialog from './cpmponents/ConfirmDialog' //到货确认
import CheckDialog from './cpmponents/CheckDialog' //检定验收
import WarehousingDialog from './cpmponents/WarehousingDialog' //执行入库
export default {
  name: 'EquipmentRentList',
  components: { AuditDialog, RentDialog, ConfirmDialog, CheckDialog, WarehousingDialog },
  data() {
    return {
      activeRow: {},
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      selectedList: [],
      sourceList,
      equipmentStatus,
      equipmentType,
      rentStatusList,
      request: body => {
        return this.axios.material.post('equipmentLease/list', body)
      },
      auditDialogVisible: false,
      rentDialogVisible: false,
      confirmDialogVisible: false,
      checkDialogVisible: false,
      warehousingDialogVisible: false
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    async remove(row) {
      await this.$tipRemove([row], 'code')
      await this.axios.material.get('equipmentLease/delete/' + row.id)
      this.$message.success('删除成功')
      this.refresh()
    },
    audit(row) {
      this.activeRow = row
      this.auditDialogVisible = true
    },
    rent(row) {
      this.activeRow = row
      this.rentDialogVisible = true
    },
    confirm(row) {
      this.activeRow = row
      this.confirmDialogVisible = true
    },
    check(row) {
      this.activeRow = row
      this.checkDialogVisible = true
    },
    warehousing(row) {
      this.activeRow = row
      this.warehousingDialogVisible = true
    }
  }
}
</script>
