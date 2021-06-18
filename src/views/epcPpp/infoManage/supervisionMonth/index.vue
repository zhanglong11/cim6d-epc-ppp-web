<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.search" placeholder="创建人/月报期号" style="width: 180px">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="月报状态">
          <SelectList v-model="filterForm.status" :self-list="statusList" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.createStartDate" :endTime.sync="filterForm.createEndDate" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('SupervisionMonthEpcPppAdd')" type="primary" icon="el-icon-plus" @click="toAdd"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column title="月报期号" field="issueNumber"> </vxe-table-column>
      <vxe-table-column title="月报完成度" field="completion"> </vxe-table-column>
      <vxe-table-column title="报告期" field="name">
        <template #default="{ row }"> {{ row.reportStartDate }}~{{ row.reportEndDate }} </template>
      </vxe-table-column>
      <!--<vxe-table-column title="月报完成度" field="name"> </vxe-table-column>-->
      <vxe-table-column title="创建人" field="creatorName"> </vxe-table-column>
      <vxe-table-column title="创建时间" field="createTime"> </vxe-table-column>
      <vxe-table-column title="编辑人" field="authorName"> </vxe-table-column>
      <vxe-table-column
        title="月报状态"
        field="status"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      >
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <template v-if="row.status === 0">
            <el-button v-if="$hasPower('SupervisionMonthEpcPppEdit')" type="text" @click="toEdit(row)">编辑</el-button>
            <el-button v-if="$hasPower('SupervisionMonthEpcPppDelete')" type="text" @click="remove(row)"
              >删除</el-button
            >
            <el-button
              v-if="$hasPower('SupervisionMonthEpcPppAudit') && row.completeFlag === 1"
              type="text"
              @click="audit(row)"
              >提交审核</el-button
            >
          </template>
          <template v-if="row.status === 3">
            <el-button v-if="$hasPower('SupervisionMonthEpcPppDetail')" type="text" @click="toDetail(row)"
              >查看</el-button
            >
            <el-button v-if="$hasPower('SupervisionMonthEpcPppEdit')" type="text" @click="toEdit(row)">编辑</el-button>
            <el-button v-if="$hasPower('SupervisionMonthEpcPppAudit')" type="text" @click="audit(row)"
              >提交审核</el-button
            >
          </template>
          <template v-else>
            <el-button v-if="$hasPower('SupervisionMonthEpcPppDetail')" type="text" @click="toDetail(row)"
              >查看</el-button
            >
          </template>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '@/views/epcPpp/infoManage/api'
export default {
  name: 'SupervisionMonth',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      filterForm: {},
      request: body => {
        return Api.getSupervisionMonthList(body)
      },
      statusList: [
        { label: '草稿', value: 0 },
        { label: '待审核', value: 1 },
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
    toAdd() {
      this.$router.push({
        name: `SupervisionMonthAddEpcPpp`
      })
    },
    //编辑
    toEdit(row) {
      this.$router.push({
        name: `SupervisionMonthEditEpcPpp`,
        params: {
          id: row.id
        }
      })
    },
    //详情
    toDetail(row) {
      this.$router.push({
        name: `SupervisionMonthDetailEpcPpp`,
        params: {
          id: row.id
        }
      })
    },
    async remove(row) {
      let res = await this.$confirm('删除当前数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (!res) return
      await Api.deleteSupervisionMonthById(row.id)
      this.$message.success('删除成功')
      await this.refresh()
    },
    //提交审核
    async audit(row) {
      await Api.auditSupervisionMonth(row.id)
    }
  }
}
</script>

<style scoped></style>
