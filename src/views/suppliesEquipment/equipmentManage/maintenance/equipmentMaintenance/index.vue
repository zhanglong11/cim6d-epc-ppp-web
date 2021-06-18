<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input
            v-model="filterForm.search"
            placeholder="设备保养单号/设备保养计划单号/设备保养计划名称"
            style="width: 220px"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="保养状态">
          <SelectList v-model="filterForm.status" :self-list="maintenanceStatus" />
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('EquipmentMaintenanceList')">
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <Grid
      ref="table"
      :request="request"
      :columns="tableColumn"
      :filter-form.sync="filterForm"
      @checkboxChange="selection => (selectedList = selection)"
    />
    <FinishDialog v-if="finishVisible" :id="activeId" :visible.sync="finishVisible" />
    <CheckDialog v-if="checkVisible" :id="activeId" :visible.sync="checkVisible" />
  </div>
</template>

<script>
import Api from '@/api/supplies/maintenance/maintenance'
import maintenanceStatus from './lib/maintenanceStatus'
import FinishDialog from './components/FinishDialog'
import CheckDialog from './components/CheckDialog'
export default {
  name: 'Trouble',
  components: { FinishDialog, CheckDialog },
  data() {
    return {
      activeId: null,
      filterForm: {},
      selectedList: [],
      curId: null,
      maintenanceStatus,
      finishVisible: false,
      checkVisible: false,
      request: body => {
        return Api.list(body)
      },
      // 表格表头
      tableColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备保养单号',
          minWidth: 120
        },
        {
          field: 'maintenancePlanCode',
          title: '设备保养计划单号',
          minWidth: 140
        },
        {
          field: 'maintenancePlanName',
          title: '设备保养计划名称',
          minWidth: 140
        },
        {
          field: 'maintenanceDepartmentName',
          title: '保养部门',
          minWidth: 120
        },
        {
          field: 'maintenancePersonName',
          title: '保养人',
          minWidth: 120
        },

        {
          field: 'principalName',
          title: '保养负责人',
          minWidth: 120
        },
        {
          field: 'reviewerName',
          title: '验证人',
          minWidth: 120
        },
        {
          field: 'creatorName',
          title: '创建人',
          minWidth: 120
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 120
        },
        {
          field: 'purchaseOrder',
          title: '保养状态',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(maintenanceStatus, row.status)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'faultTime',
          title: '操作',
          width: 180,
          fixed: 'right',
          align: 'left',
          slots: {
            default: ({ row }) => [
              row.status === 0 && this.$hasPower('EquipmentMaintenanceDetail') ? (
                <el-button type="text" onClick={() => this.toDetail(row.id)}>
                  保养
                </el-button>
              ) : null,
              row.status === 1 && this.$hasPower('EquipmentMaintenanceFinish') ? (
                <el-button type="text" onClick={() => this.showDialog(row.id, 'finishVisible')}>
                  保养完成
                </el-button>
              ) : null,
              row.status === 2 && this.$hasPower('EquipmentMaintenanceCheck') ? (
                <el-button type="text" onClick={() => this.showDialog(row.id, 'checkVisible')}>
                  验证
                </el-button>
              ) : null,
              this.$hasPower('EquipmentMaintenanceDetail') ? (
                <el-button type="text" onClick={() => this.toDetail(row.id)}>
                  查看
                </el-button>
              ) : null
            ]
          }
        }
      ]
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    showDialog(id, dialog) {
      this.activeId = id
      this[dialog] = true
    },
    toDetail(id) {
      this.$router.push({ name: `EquipmentMaintenanceDetail`, params: { id } })
    },
    async handle(id, status) {
      await Api.updateStatus({
        id,
        status
      })
      this.$message.success('操作成功')
      this.refresh()
    },
    async remove(rows) {
      await this.$tipRemove(rows)
      await Api.delete(rows[0].id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>
