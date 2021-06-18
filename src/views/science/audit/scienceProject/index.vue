<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: c74fbf3de4b81339a547e1cd8afef48ea5ce7327
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术方案审核 搜索的时间组件添加时分秒，审核和详情的界面样式重新调整
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
              placeholder="方案名称/创建人"
              style="width: 198px"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="方案类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择方案类型" style="width: 140px">
              <el-option label="施工组织设计" :value="1"></el-option>
              <el-option label="专项施工方案" :value="2"></el-option>
              <el-option label="超过一定规模的专项施工方案" :value="3"></el-option>
              <el-option label="施工方案" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方案状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择方案状态" style="width: 140px">
              <el-option label="电子版待审核" :value="1"></el-option>
              <el-option label="电子版通过" :value="2"></el-option>
              <el-option label="电子版驳回" :value="3"></el-option>
              <el-option label="纸质版待审核" :value="4"></el-option>
              <el-option label="纸质版通过" :value="5"></el-option>
              <el-option label="纸质版驳回" :value="6"></el-option>
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

    <vxe-table ref="xTable" border resizable show-overflow :data="tableData" :loading="loading">
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="name" title="方案名称">
        <!--任务号：973、修改人：董渊海、修改时间：2020-03-23-->
        <template #default="{ row }">
          <a @click="handleDetail(row.id, row)">{{ row.name }}</a>
        </template>
      </vxe-table-column>
      <vxe-table-column field="schemeType" title="方案类型">
        <template #default="{ row }">
          <span v-if="row.schemeType === 1">施工组织设计</span>
          <span v-else-if="row.schemeType === 2">专项施工方案</span>
          <span v-else-if="row.schemeType === 3">超过一定规模的专项施工方案</span>
          <span v-else-if="row.schemeType === 4">施工方案</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="方案状态">
        <template #default="{ row }">
          <span v-if="row.status === 1">电子版待审核</span>
          <span v-else-if="row.status === 2">电子版已通过</span>
          <span v-else-if="row.status === 3">电子版已驳回</span>
          <span v-else-if="row.status === 4">纸质版待审核</span>
          <span v-else-if="row.status === 5">纸质版已通过</span>
          <span v-else-if="row.status === 6">纸质版已驳回</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="130">
        <template #default="{ row }">
          <span v-if="row.status === 1 || row.status === 4">
            <a @click="handleAudit(row.id, row)">审核</a>
          </span>
          <span v-else>
            <a @click="handleDetail(row.id, row)">查看</a>
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
import Api from '@/api/science/audit/scienceProject'
export default {
  name: 'ScienceProjectAudit',
  data() {
    return {
      form: {
        synthesize: '',
        type: '',
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
      let keyWord = this.form.synthesize
      let schemeType = this.form.type
      let status = this.form.status

      this.loading = true

      Api.getScienceProjectAuditList({
        projectId: localStorage.getItem('projectId'),
        keyWord,
        schemeType,
        status,
        createStartTime,
        createEndTime,
        removeStatus: 0,
        page,
        rows
      }).then(res => {
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
    handleDetail(id, row) {
      this.$router.push({ name: 'AuditScienceProjectDetail', params: { id: id } })
    },
    handleAudit(id, row) {
      this.$router.push({ name: 'AuditScienceProject', params: { id: id } })
    },
    handleEdit(id, row) {},
    handleDelete(id, row) {},

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
