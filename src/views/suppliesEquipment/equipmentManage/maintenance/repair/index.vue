<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.search" placeholder="设备编号/设备名称">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('EquipmentRepairList')">
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('EquipmentRepairAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
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
    <CheckDialog v-if="checkVisible" :id="activeId" :visible.sync="checkVisible" />
  </div>
</template>

<script>
import Api from '@/api/supplies/maintenance/repair'
import repairStatus from './lib/repairStatus'
import handStatus from './lib/handStatus'
import level from './lib/level'
import repairType from './lib/faultType'
import urgency from './lib/urgency'
import toggle from './lib/toggle'
import CheckDialog from './components/CheckDialog'
export default {
  name: 'Trouble',
  components: { CheckDialog },
  data() {
    return {
      activeId: null,
      filterForm: {},
      selectedList: [],
      checkVisible: false,
      level,
      handStatus,
      request: body => {
        return Api.list(body)
      },
      // 表格表头
      tableColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备维修编号',
          minWidth: 140
        },
        {
          field: 'equipmentCode',
          title: '设备编码',
          minWidth: 140
        },
        {
          field: 'equipmentName',
          title: '设备名称',
          minWidth: 120
        },
        {
          field: 'models',
          title: '规格型号',
          minWidth: 120
        },
        {
          field: 'faultTime',
          title: '发生时间',
          minWidth: 120
        },
        {
          field: 'thisTime',
          title: '故障等级',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(level, row.level)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'intervalDays',
          title: '故障类别',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(repairType, row.type)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'description',
          title: '故障描述',
          minWidth: 120
        },
        {
          field: 'intervalDays',
          title: '是否需要外委维修',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(toggle, row.isOutsource)}</span>]
          },
          minWidth: 140
        },
        {
          field: 'intervalDays',
          title: '报修状态',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(repairStatus, row.repairStatus)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'intervalDays',
          title: '处理状态',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(handStatus, row.handleState)}</span>]
          },
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
          field: 'faultTime',
          title: '操作',
          width: 180,
          fixed: 'right',
          align: 'left',
          slots: {
            default: ({ row }) => [
              row.repairStatus === 1 && this.$hasPower('EquipmentRepairExamine') ? (
                <el-button type="text" onClick={() => this.showDialog(row.id, 'checkVisible')}>
                  审核
                </el-button>
              ) : null,
              (row.handleState === 0 || row.handleState === 3) && this.$hasPower('EquipmentRepairDetail') ? (
                <el-button type="text" onClick={() => this.toDetail(row.id)}>
                  执行维修
                </el-button>
              ) : null,
              row.handleState === 1 && this.$hasPower('EquipmentRepairDetail') ? (
                <el-button type="text" onClick={() => this.toDetail(row.id)}>
                  验收
                </el-button>
              ) : null,
              row.repairStatus === 0 && this.$hasPower('EquipmentRepairEdit') ? (
                <el-button type="text" onClick={() => this.toEdit(row.id)}>
                  编辑
                </el-button>
              ) : null,
              this.$hasPower('EquipmentRepairBasicDetail') ? (
                <el-button type="text" onClick={() => this.toBasicDetail(row)}>
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
        ? this.$router.push({ name: `EquipmentRepairAdd` })
        : this.$router.push({ name: `EquipmentRepairEdit`, params: { id } })
    },
    toDetail(id) {
      this.$router.push({ name: `EquipmentRepairDetail`, params: { id } })
    },
    toBasicDetail(row) {
      row.handleState
        ? this.$router.push({ name: `EquipmentRepairDetail`, params: { id: row.id } })
        : this.$router.push({ name: `EquipmentRepairBasicDetail`, params: { id: row.id } })
    },
    showDialog(id, dialog) {
      this.activeId = id
      this[dialog] = true
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
