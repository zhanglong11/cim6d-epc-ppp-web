<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 8819cc97074ba0aa0c06082fda566918d18f0d05
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具台账 添加检定校准、故障维修、封存、报废，四个详情页，并添加审核结果模块
@补加代码注释日期: 2020-04-11
-->
<template>
  <div>
    <vxe-table ref="xTable" border resizable show-overflow auto-resize :data="tableData" :loading="loading">
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="manufactureNum" title="出厂编号"></vxe-table-column>
      <vxe-table-column field="deviceName" title="名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格及型号"></vxe-table-column>
      <vxe-table-column field="deviceStatus" title="设备状态">
        <template #default="{ row }">
          <span v-if="row.deviceStatus === 0">停用</span>
          <span v-else-if="row.deviceStatus === 1">在用</span>
          <span v-else-if="row.deviceStatus === 2">封存</span>
          <span v-else-if="row.deviceStatus === 3">报废</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="verifyTime" title="检定时间"></vxe-table-column>
      <vxe-table-column field="verifyFrequency" title="检定周期(月)"></vxe-table-column>
      <vxe-table-column field="expireTime" title="有效期至"></vxe-table-column>
      <vxe-table-column field="verifyResult" title="检定结论">
        <template #default="{ row }">
          <span v-if="row.verifyResult === 1">合格</span>
          <span v-else-if="row.verifyResult === 0">不合格</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template #default="{ row }">
          <span v-if="row.status === 0">待审核</span>
          <span v-else-if="row.status === 1">已通过</span>
          <span v-else-if="row.status === 2">已驳回</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <a @click="handleDetail(row.id, row)">查看</a>
        </template>
      </vxe-table-column>
    </vxe-table>

    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="page"
      :page-size="rows"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    >
    </vxe-pager>
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/measureBook'
export default {
  name: 'TabCheck',
  props: {
    id: String
  },
  data() {
    return {
      tableData: [],

      loading: false,
      page: 1,
      rows: 10,
      total: 0
    }
  },
  mounted() {
    this.refresh(1, this.rows)
  },
  methods: {
    refresh(page, rows) {
      this.loading = true
      Api.measureBookVerifyList({
        projectId: localStorage.getItem('projectId'),
        measureDeviceId: this.id, //设备台账id
        page,
        rows
      }).then(res => {
        //console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.page = page
        this.rows = rows
      })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'MeasureBookMeasureCheckDetail', params: { id: id } })
    },
    handlePageChange({ currentPage, pageSize }) {
      //this.page = currentPage
      //this.rows = pageSize
      this.refresh(currentPage, pageSize)
    }
  }
}
</script>

<style scoped lang="less"></style>
