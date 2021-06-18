<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2e45398b36093b41f2949e4952b109f2141c86bb
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，图纸会审 时间组件，添加时分秒；补充上传文件功能
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
              placeholder="会议名称/会议地点/创建人"
              style="width: 198px"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="会议类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择会议类型" style="width: 140px">
              <el-option label="图纸预审" :value="1"></el-option>
              <el-option label="图纸会审" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会议时间" prop="meetingTime">
            <el-date-picker
              v-model="form.meetingTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px"
            ></el-date-picker>
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
      v-if="$hasPower('DrawReviewAdd')"
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 10px"
      @click="handleAdd"
      >新增</el-button
    >
    <vxe-table
      ref="xTable"
      border
      :show-header-overflow="true"
      column-min-width="140px"
      :data="tableData"
      :loading="loading"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="name" title="会议名称">
        <!--任务号：973、修改人：董渊海、修改时间：2020-03-23-->
        <template #default="{ row }">
          <a @click="handleDetail(row.id, row)">{{ row.name }}</a>
        </template>
      </vxe-table-column>
      <vxe-table-column field="meetingType" title="会议类型">
        <template #default="{ row }">
          <span v-if="row.meetingType === 1">图纸预审</span>
          <span v-else-if="row.meetingType === 2">图纸会审</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="meetingLocation" title="会议地点"></vxe-table-column>
      <vxe-table-column field="meetingTime" title="会议时间"></vxe-table-column>
      <vxe-table-column field="presiderName" title="主持人"></vxe-table-column>
      <vxe-table-column field="recorderName" title="记录人"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="130">
        <template #default="{ row }">
          <span>
            <a v-if="$hasPower('DrawReviewDetail')" @click="handleDetail(row.id, row)">查看</a>&nbsp;
            <a v-if="$hasPower('DrawReviewEdit')" @click="handleEdit(row.id, row)">编辑</a>&nbsp;
            <a v-if="$hasPower('DrawReviewDelete')" @click="handleDelete(row.id, row)">删除</a>
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
import Api from '@/api/science/scienceManage/drawReview'
export default {
  name: 'DrawReview',
  data() {
    return {
      form: {
        synthesize: '',
        type: '',
        meetingTime: '',
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
      let meetingStartTime = ''
      let meetingEndTime = ''
      if (this.form.meetingTime !== null && this.form.meetingTime !== '' && this.form.meetingTime.length !== 1) {
        meetingStartTime = moment(this.form.meetingTime[0]).format('YYYY-MM-DD HH:mm:ss')
        meetingEndTime = moment(this.form.meetingTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let createStartTime = ''
      let createEndTime = ''
      if (this.form.createTime !== null && this.form.createTime !== '' && this.form.createTime.length !== 1) {
        createStartTime = moment(this.form.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        createEndTime = moment(this.form.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let keyWord = this.form.synthesize
      let meetingType = this.form.type

      this.loading = true

      Api.getDrawReviewList({
        projectId: localStorage.getItem('projectId'),
        keyWord,
        meetingType,
        meetingStartTime,
        meetingEndTime,
        createStartTime,
        createEndTime,
        rows,
        page
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
      this.$router.push({ name: 'DrawReviewAdd' })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'DrawReviewDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'DrawReviewEdit', params: { id: id } })
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.name} 记录吗？`).then(res => {
        Api.deleteDrawReview(id).then(res => {
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
