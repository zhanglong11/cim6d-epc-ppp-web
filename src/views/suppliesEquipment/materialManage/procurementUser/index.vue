<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="" label-width="0" prop="content" style="margin-right: 20px">
          <el-input v-model="filterForm.keyword" placeholder="申请单编号/申请人/申请部门" style="width: 300px">
            <i slot="suffix" class="el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="申请时间">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate" />
        </el-form-item>
        <el-form-item label="处理状态" label-width="100px" prop="supplyStatus" style="margin-right: 20px">
          <SelectList v-model="filterForm.status" :self-list="purchaseStatus" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('ProcurementUserAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
            >新建使用申请</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="code" title="使用申请单编号"></vxe-table-column>
      <vxe-table-column field="procedureName" title="关联进度">
        <template slot-scope="{ row }">
          {{ row.procedureName || row.schduleName }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="applyDepartmentName" title="申请部门"></vxe-table-column>
      <vxe-table-column field="creatorName" title="申请人"></vxe-table-column>
      <vxe-table-column field="applyReason" title="申请原因"></vxe-table-column>
      <vxe-table-column field="createTime" title="申请时间" width="200">
        <template slot-scope="{ row }"> {{ row.createTime | ymd }}</template>
      </vxe-table-column>
      <vxe-table-column
        field="status"
        title="审批状态"
        :formatter="({ cellValue }) => $getLabel(purchaseStatus, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <template
            v-if="row.status === 1 && row.nextPersonId === $store.state.user.id && $hasPower('ProcurementUserAudit')"
          >
            <span style="margin: 0 3px"><a @click="toDetail(row.id)">审核</a></span>
          </template>
          <span v-if="$hasPower('ProcurementUserDetail')" style="margin: 0 3px">
            <a @click="toDetail(row.id)">查看</a></span
          >
          <template v-if="row.status === 0">
            <span v-if="$hasPower('ProcurementUserEdit')" style="margin: 0 3px"
              ><a @click="toEdit(row.id)">编辑</a></span
            >
            <span v-if="$hasPower('ProcurementUserDelete')" style="margin: 0 3px"
              ><a @click="remove(row)">删除</a></span
            >
          </template>
        </template>
      </vxe-table-column>
    </Grid>
    <CheckDialog v-if="checkDialogVisible" :id="activeId" :visible.sync="checkDialogVisible" />
  </div>
</template>

<script>
import Api from '@/api/supplies/material/procurement'
import purchaseStatus from './lib/purchaseStatus'
import CheckDialog from './components/CheckDialog'
import type from './lib/type'
export default {
  name: 'Procurement',
  components: { CheckDialog },
  data() {
    return {
      activeId: null,
      filterForm: {},
      selectedList: [],
      purchaseStatus,
      type,
      checkDialogVisible: false,
      request: body => {
        return Api.getMaterialApplyList(body)
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
      // console.log(_.isNil(id))
      _.isNil(id)
        ? this.$router.push({ name: `ProcurementUserAdd` })
        : this.$router.push({ name: `ProcurementUserEdit`, params: { id } })
    },
    toDetail(id) {
      this.$router.push({ name: `ProcurementUserDetail`, params: { id } })
    },
    showCheckDialog(id) {
      this.activeId = id
      this.checkDialogVisible = true
    },
    async remove(rows) {
      // console.log(rows)
      await this.$tipRemove([rows])
      await Api.getMaterialApplyDelete(rows.id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>
<style lang="less"></style>
