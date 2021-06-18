<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 6b14b0ad1968a54825bfe34dc82b3e967c432103
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具采购计划 搜索的时间组件添加时分秒，新增和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div>
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="器具名称"
              style="width: 140px"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="草稿" :value="0"></el-option>
              <el-option label="待审核" :value="1"></el-option>
              <el-option label="已通过" :value="2"></el-option>
              <el-option label="已驳回" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px"
            ></el-date-picker>
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <el-button
      v-if="$hasPower('MeasurePurchaseAdd')"
      style="margin-bottom: 10px"
      type="primary"
      icon="el-icon-plus"
      @click="handleAdd"
      >新增</el-button
    >
    <vxe-table
      ref="xTable"
      border
      :show-header-overflow="true"
      column-min-width="140px"
      show-overflow
      :data="tableData"
      :loading="loading"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="deviceName" title="器具名称">
        <!--任务号：973、修改人：董渊海、修改时间：2020-03-23-->
        <template #default="{ row }">
          <a v-if="$hasPower('MeasurePurchaseDetail')" @click="handleDetail(row.id, row)">{{ row.deviceName }}</a>
          <span v-else>{{ row.deviceName }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column title="测量范围">
        <template #default="{ row }">
          <span>{{ row.measureMin }}~{{ row.measureMax }} {{ row.measureUnit }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="step" title="精度等级"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template #default="{ row }">
          <span v-if="row.status === 0">草稿</span>
          <span v-else-if="row.status === 1">待审核</span>
          <span v-else-if="row.status === 2">已通过</span>
          <span v-else-if="row.status === 3">已驳回</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="130">
        <template #default="{ row }">
          <span v-if="row.status === 0">
            <a v-if="$hasPower('MeasurePurchaseDetail')" @click="handleDetail(row.id, row)">查看</a>&nbsp;
            <a v-if="$hasPower('MeasurePurchaseEdit')" @click="handleEdit(row.id, row)">编辑</a>&nbsp;
            <a v-if="$hasPower('ScienceExchangeRemove')" @click="handleDelete(row.id, row)">删除</a>
          </span>
          <span v-if="row.status !== 0">
            <a v-if="$hasPower('MeasurePurchaseDetail')" @click="handleDetail(row.id, row)">查看</a>
          </span>
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
import Api from '@/api/science/scienceManage/measurePurchase'
export default {
  name: 'MeasurePurchase',
  data() {
    return {
      form: {
        synthesize: '',
        status: '',
        createTime: ''
      },
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
      let createStartTime = ''
      let createEndTime = ''
      if (this.form.createTime !== null && this.form.createTime !== '' && this.form.createTime.length !== 1) {
        createStartTime = moment(this.form.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        createEndTime = moment(this.form.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let deviceName = this.form.synthesize
      let status = this.form.status

      this.loading = true

      Api.getMeasurePurchaseList({
        projectId: localStorage.getItem('projectId'),
        deviceName,
        status,
        createStartTime,
        createEndTime,
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
    handleSearch() {
      this.refresh(1, this.rows)
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.refresh(1, this.rows)
    },
    handleAdd() {
      this.$router.push({ name: 'MeasurePurchaseAdd' })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'MeasurePurchaseDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'MeasurePurchaseEdit', params: { id: id, isEdit: true } })
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.deviceName} 记录吗？`).then(res => {
        Api.deleteMeasurePurchase(id).then(res => {
          this.$message.success('删除成功')
          this.refresh(1, this.rows)
        })
      })
    },

    handlePageChange({ currentPage, pageSize }) {
      //this.page = currentPage
      //this.rows = pageSize
      this.refresh(currentPage, pageSize)
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
