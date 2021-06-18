<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.search" placeholder="设备编号/设备名称/供应商/创建人" style="width: 240px">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('EquipmentListView')">
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('EquipmentAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
            >新建</el-button
          >
          <template v-if="$hasPower('EquipmentImportAdd')">
            <el-button type="primary" @click="showImport">导入</el-button>
            <el-button type="primary"><a href="/doc/设备清单导入.xlsx" download>下载模板</a></el-button>
          </template>
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
    <ImportDialog v-if="importVisible" :visible.sync="importVisible" />
  </div>
</template>

<script>
import Api from '@/api/supplies/equipment/list'
import { saveAs } from 'file-saver'
import sourceList from './lib/sourceList'
import equipmentStatus from './lib/equipmentStatus'
import equipmentType from './lib/equipmentType'
import ImportDialog from './components/ImportDialog'
export default {
  name: 'Trouble',
  components: { ImportDialog },
  data() {
    return {
      filterForm: {},
      selectedList: [],
      sourceList,
      equipmentStatus,
      equipmentType,
      importVisible: false,
      request: body => {
        return Api.list(body)
      },
      // 表格表头
      tableColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备编码',
          minWidth: 120
        },
        {
          field: 'name',
          title: '设备名称',
          minWidth: 120
        },
        {
          field: 'models',
          title: '规格型号',
          minWidth: 120
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 120
        },
        {
          field: 'purchaseOrder',
          title: '设备类别',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(equipmentType, row.type)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'manufacturer',
          title: '生产厂家',
          minWidth: 120
        },
        {
          field: 'supplier',
          title: '供应商',
          minWidth: 120
        },
        {
          field: 'purchaseOrder',
          title: '设备来源',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(sourceList, row.source)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'location',
          title: '设备位置',
          minWidth: 120
        },
        {
          field: 'purchaseOrder',
          title: '使用状态',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(equipmentStatus, row.useStatus)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'faultTime',
          title: '操作',
          width: 240,
          fixed: 'right',
          align: 'left',
          slots: {
            default: ({ row }) => [
              this.$hasPower('EquipmentEdit') ? (
                <el-button type="text" onClick={() => this.toEdit(row.id)}>
                  编辑
                </el-button>
              ) : null,
              this.$hasPower('EquipmentDelete') ? (
                <el-button type="text" onClick={() => this.remove([row])}>
                  删除
                </el-button>
              ) : null,
              // <el-button type="text" onClick={() => this.showCode(row)}>
              //   打印二维码贴纸
              // </el-button>,
              this.$hasPower('EquipmentDetail') ? (
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
        ? this.$router.push({ name: `EquipmentAdd` })
        : this.$router.push({ name: `EquipmentEdit`, params: { id } })
    },
    toDetail(id) {
      this.$router.push({ name: `EquipmentDetail`, params: { id } })
    },
    async showCode(row) {
      const res = await Api.code(row)
      await saveAs(res.data, 'code.png')
    },
    showImport() {
      this.importVisible = true
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
