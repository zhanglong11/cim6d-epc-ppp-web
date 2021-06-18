<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.name" placeholder="创建人/周报期号" style="width: 180px">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="周报状态">
          <SelectList v-model="filterForm.status" :self-list="statusList" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.startTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button
            v-if="$hasPower('ConstructionWeekAddEpcPpp')"
            type="primary"
            icon="el-icon-plus"
            @click="toEdit(null)"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column title="周报期号" field="periodName"> </vxe-table-column>
      <vxe-table-column title="创建人" field="creatorName"> </vxe-table-column>
      <vxe-table-column title="创建时间" field="createTime"> </vxe-table-column>
      <vxe-table-column
        title="周报状态"
        field="status"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      >
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button type="text" @click="toDetail(row.id)">查看</el-button>
          <el-button
            v-if="row.status === 0 && $hasPower('ConstructionWeekEditEpcPpp')"
            type="text"
            @click="toEdit(row.id)"
            >编辑</el-button
          >
          <el-button
            v-if="row.status === 0 && $hasPower('ConstructionWeekDeleteEpcPpp')"
            type="text"
            @click="remove(row.id)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from './api'
export default {
  name: 'ConstructionDay',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      filterForm: {},
      request: body => {
        return Api.list(body)
      },
      statusList: [
        { label: '编辑中', value: 0 },
        { label: '审核中', value: 1 },
        { label: '审核通过', value: 2 },
        { label: '审核不通过', value: 3 }
      ]
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {
      this.$refs.table.refresh()
    },
    //重置
    reset() {
      this.$refs.table.reset()
    },
    //添加
    toEdit(id) {
      this.$router.push({
        name: `ConstructionWeekEditEpcPpp`,
        params: { id }
      })
    },
    //详情
    toDetail(id) {
      this.$router.push({
        name: `ConstructionWeekDetailEpcPpp`,
        params: { id }
      })
    },
    async remove(id) {
      await this.$confirm('删除当前数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await Api.remove(id)
      this.$message.success('操作成功')
      this.refresh()
    }
  }
}
</script>

<style scoped></style>
