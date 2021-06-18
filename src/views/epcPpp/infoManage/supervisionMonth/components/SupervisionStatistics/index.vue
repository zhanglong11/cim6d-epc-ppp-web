<template>
  <el-card class="box-card">
    <vxe-table
      :key="Math.random()"
      ref="table"
      auto-resize
      :data="form.workStatList"
      :edit-config="{ trigger: 'click' }"
      :merge-cells="mergeCells"
    >
      <vxe-table-column field="aa" title="序号" width="60">
        <template #default="{ row, $rowIndex }">
          {{ $rowIndex > 1 ? $rowIndex : $rowIndex + 1 }}
        </template>
      </vxe-table-column>
      <vxe-table-column
        title="项目名称"
        field="itemName"
        :edit-render="{
          name: '$input',
          props: { type: 'text' }
        }"
      >
      </vxe-table-column>
      <vxe-table-column
        title="单位"
        field="unit"
        :edit-render="{
          name: '$input',
          props: { type: 'text' }
        }"
      >
      </vxe-table-column>
      <vxe-table-column title="本年度">
        <vxe-table-column
          title="本月"
          field="thisMonthStat"
          :edit-render="{
            name: '$input',
            props: { type: 'number' }
          }"
        >
        </vxe-table-column>
        <vxe-table-column
          title="累计"
          field="thisYearCumulative"
          :edit-render="{
            name: '$input',
            props: { type: 'number' }
          }"
        >
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column
        title="开工以来总计"
        field="startWorkSum"
        :edit-render="{
          name: '$input',
          props: { type: 'number' }
        }"
      >
      </vxe-table-column>
    </vxe-table>
    <div class="add" @click="handleAdd"><i class="el-icon-plus"></i>新增</div>
  </el-card>
</template>

<script>
export default {
  name: 'SupervisionStatistics',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {
        workStatList: []
      },
      mergeCells: [{ row: 1, col: 0, rowspan: 2, colspan: 1 }]
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  mounted() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    async handleAdd() {
      let obj = { itemName: '' }
      //this.form.workStatList.push(obj)
      this.$refs.table.insertAt(obj, -1)
      console.log(this.mergeCells)
      await this.$refs.table.setMergeCells(this.mergeCells)
    }
  }
}
</script>

<style scoped lang="less">
@import url('../../style.less');
.add {
  margin: 10px 20px;
  text-align: center;
  border: 1px #999999 dashed;
  &:hover {
    cursor: pointer;
  }
}
</style>
