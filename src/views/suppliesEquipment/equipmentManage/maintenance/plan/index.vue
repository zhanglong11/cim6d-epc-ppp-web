<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.search" placeholder="设备保养计划单号/设备保养计划名称" style="width: 220px">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="执行状态">
          <SelectList v-model="filterForm.status" :self-list="planStatus" />
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('MaintenancePlanList')">
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('MaintenancePlanAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
            >新建</el-button
          >
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
  </div>
</template>

<script>
import Api from '@/api/supplies/maintenance/plan'
import level from './lib/level'
import planStatus from './lib/planStatus'
import cycle from './lib/cycle'
export default {
  name: 'Trouble',
  data() {
    return {
      activeId: null,
      filterForm: {},
      selectedList: [],
      level,
      planStatus,
      cycle,
      request: body => {
        return Api.list(body)
      },
      // 表格表头
      tableColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备保养计划单号',
          minWidth: 140
        },
        {
          field: 'name',
          title: '设备保养计划名称',
          minWidth: 140
        },
        {
          field: 'maintenanceDepartmentName',
          title: '保养部门',
          minWidth: 120
        },
        {
          field: 'lastTime',
          title: '上次保养时间',
          minWidth: 120
        },
        {
          field: 'thisTime',
          title: '下次计划保养时间',
          minWidth: 120
        },
        {
          field: 'intervalDays',
          title: '时间间隔',
          minWidth: 120
        },
        {
          field: 'circulationMode',
          title: '循环方式',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(cycle, row.circulationMode)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'manufacturer',
          title: '保养级别',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(level, row.level)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'principalName',
          title: '保养负责人',
          minWidth: 120
        },
        {
          field: 'description',
          title: '计划描述',
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
          title: '执行状态',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(planStatus, row.status)}</span>]
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
              row.status === 1 && this.$hasPower('EquipmentMaintenancePlanImplement') ? (
                <el-button v-if="" type="text" onClick={() => this.handle(row.id, 2)}>
                  执行
                </el-button>
              ) : null,
              row.status === 2 && this.$hasPower('MaintenancePlanStop') ? (
                <el-button type="text" onClick={() => this.handle(row.id, 3)}>
                  停用
                </el-button>
              ) : null,
              row.status === 3 && this.$hasPower('EquipmentMaintenancePlanImplement') ? (
                <el-button type="text" onClick={() => this.handle(row.id, 1)}>
                  执行
                </el-button>
              ) : null,
              row.status === 1 && this.$hasPower('MaintenancePlanEdit') ? (
                <el-button type="text" onClick={() => this.toEdit(row.id)}>
                  编辑
                </el-button>
              ) : null,
              row.status === 1 && this.$hasPower('MaintenancePlanDelete') ? (
                <el-button type="text" onClick={() => this.remove([row])}>
                  删除
                </el-button>
              ) : null,
              this.$hasPower('MaintenancePlanDetail') ? (
                <el-button type="text" onClick={() => this.toDetail(row.id)}>
                  详情
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
    toEdit(id) {
      _.isNil(id)
        ? this.$router.push({ name: `MaintenancePlanAdd` })
        : this.$router.push({ name: `MaintenancePlanEdit`, params: { id } })
    },
    toDetail(id) {
      this.$router.push({ name: `MaintenancePlanDetail`, params: { id } })
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
