<template>
  <el-dialog
    width="1080px"
    :title="'请选择设备'"
    :visible="visible"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item>
        <el-input v-model="form.search" style="width: 200px" placeholder="设备名称/供应商/创建人">
          <i slot="suffix" class="el-icon-search" />
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="form" @checkboxChange="checkboxChangeEvent">
      <vxe-table-column type="checkbox" width="50"> </vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="name" title="设备名称"></vxe-table-column>
      <vxe-table-column field="models" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column
        field="type"
        title="设备类别"
        :formatter="({ cellValue }) => $getLabel(equipmentTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="manufacturer" title="生产厂家"></vxe-table-column>
      <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
    </Grid>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api/index'
import equipmentTypeList from '../../lib/equipmentTypeList'
export default {
  name: 'SelectEquipmentModel',
  props: {
    visible: Boolean
  },
  data() {
    return {
      equipmentTypeList,
      form: {
        search: '',
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return Api.getPurchaseLeaseList(body)
      },
      selectRows: []
    }
  },
  created() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    checkboxChangeEvent(selection) {
      this.selectRows = selection
    },
    selectAllEvent({ checked, records }) {
      this.selectRows = records
    },
    clearCheckboxEvent() {
      this.selectRows = []
      this.$refs.xTable.clearCheckboxRow()
    },
    onOk() {
      if (this.selectRows.length > 0) {
        this.$emit('update:visible', false)
        this.$emit('submit', this.selectRows)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
