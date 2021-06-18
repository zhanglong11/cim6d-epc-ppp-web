<template>
  <el-dialog
    width="1000px"
    :modal="true"
    top="10vh"
    title="选择设备"
    append-to-body
    :visible="visible"
    destroy-on-close
    @close="close"
  >
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.search" placeholder="设备编号/设备名称/供应商/创建人" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
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
      :checkRowKeys="checkRowKeys"
      :checkRowKey="checkRowKey"
      :filter-form.sync="filterForm"
      @checkboxChange="selectionChange"
      @radioChange="radioChange"
    />
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '@/api/supplies/equipment/list'
import sourceList from '../lib/sourceList'
import equipmentStatus from '../lib/equipmentStatus'
import equipmentType from '../lib/equipmentType'
export default {
  name: 'SelectEquipmentDialog',
  props: {
    visible: {},
    checkRowKeys: {},
    checkRowKey: {},
    multiple: {
      type: Boolean,
      default: true
    },
    status: {
      //设备状态查询指定状态的设备列表
      type: Number,
      default: null
    }
  },
  data() {
    return {
      filterForm: {
        useStatus: this.status
      },
      selectedList: [],
      sourceList,
      equipmentStatus,
      equipmentType,
      radioRow: {},
      request: body => {
        return Api.list(body)
      },
      // 表格表头
      tableColumn: [
        { type: this.multiple ? 'checkbox' : 'radio', width: 60 },
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
    close() {
      this.$emit('update:visible', false)
    },
    radioChange({ row }) {
      this.radioRow = row
    },
    selectionChange(selection) {
      this.selectList = selection
    },
    submit() {
      this.multiple ? this.$emit('change', this.selectList) : this.$emit('change', this.radioRow)
      this.close()
    }
  }
}
</script>

<style scoped lang="less"></style>
