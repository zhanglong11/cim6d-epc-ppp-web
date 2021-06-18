<template>
  <el-dialog width="1000px" :modal="true" top="10vh" title="选择设备" append-to-body :visible="visible" @close="close">
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.search" />
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
        <br />
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="toEdit(null)">新建</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="toEdit(null)">导入</el-button>
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
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectEquipmentDialog',
  props: {
    value: [Array]
  },
  data() {
    return {
      visible: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    show() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    submit() {
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less"></style>
