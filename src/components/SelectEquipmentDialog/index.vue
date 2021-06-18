<!--
* @任务编号: 2711 || 设备管理功能完善
* @开发人员:张龙
* @日期:2020-03-26
* @任务类型: 新代码
-->
<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="选择设备"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWord">
          <el-input
            v-model="pageQuery.keyWord"
            placeholder="设备编号/设备名称/创建人"
            style="width: 240px"
            suffix-icon="el-icon-search"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange
            :startTime.sync="pageQuery.createStartTime"
            :endTime.sync="pageQuery.createEndTime"
            style="width: 220px"
          />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <VXTable
      v-loading="tableLoading"
      :tableData="tableData"
      :pageQuery="pageQuery"
      :total="total"
      :columns="tableColumn"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
      @radioChange="radioChange"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/device/equipment/standingBook'
import paramList from './selectList'
export default {
  name: 'SelectEquipmentDialog',
  mixins: [PageMixin],
  props: {
    visible: {},
    useStatus: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      pageQuery: {
        useStatus: this.useStatus
      },
      paramList,
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'equipmentNum',
          title: '编码'
        },
        {
          field: 'equipmentName',
          title: '名称'
        },
        {
          field: 'specification',
          title: '规格及型号'
        },
        {
          field: 'useStatus',
          title: '设备状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.equipmentStatus, { value: row.useStatus }), 'label')}</span>
            ]
          }
        },
        {
          field: 'equipmentType',
          title: '设备属性',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.equipmentType, { value: row.equipmentType }), 'label')}</span>
            ]
          }
        },
        {
          field: 'principalName',
          title: '使用人'
        },
        {
          field: 'depositLocation',
          title: '安装地点'
        },
        {
          field: 'creatorName',
          title: '创建人'
        },
        {
          field: 'createTime',
          title: '创建时间'
        }
      ]
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
      this.radioRow = {}
    },
    submit() {
      this.$emit('update:visible', false)
      this.$emit('choose', this.radioRow)
    }
  }
}
</script>

<style scoped></style>
