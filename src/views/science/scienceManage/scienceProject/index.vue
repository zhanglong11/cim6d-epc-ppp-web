<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: a192a19f6fee3f6ff2b5c9f6fe81db9c933f8299
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术方案 搜索时间组件添加时分秒
@补加代码注释日期: 2020-04-11

@bug名称：1178/技术管理-技术方案-下载方案模板&技术交底-下载交底模板-点击没反应
@开发人员: 董渊海
@修改日期: 2020-04-14
@任务类型: 修改代码，添加方案模板资源文件，以便下载，修改比例(2%)
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
              <el-option label="草稿" :value="0"></el-option>
              <el-option label="电子版待审核" :value="1"></el-option>
              <el-option label="电子版已通过" :value="2"></el-option>
              <el-option label="电子版已驳回" :value="3"></el-option>
              <el-option label="纸质版待审核" :value="4"></el-option>
              <el-option label="纸质版已通过" :value="5"></el-option>
              <el-option label="纸质版已驳回" :value="6"></el-option>
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

    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center">
      <el-button v-if="$hasPower('ScienceProjectAdd')" type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增</el-button
      >
      <!--      bug#1507 张龙 04-07-->
      <!--      <a style="font-size: 12px;">下载方案模板</a>-->
      <a style="font-size: 12px" href="/static/office-template/方案模板.zip">下载方案模板</a>
    </div>
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
          <span v-if="row.status === 0">草稿</span>
          <span v-else-if="row.status === 1">电子版待审核</span>
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
          <span v-if="row.status === 0">
            <a v-if="$hasPower('ScienceProjectDetail')" @click="handleDetail(row.id, row)">查看</a>&nbsp;
            <a v-if="$hasPower('ScienceProjectEdit')" @click="handleEdit(row.id, row)">编辑</a>&nbsp;
            <a v-if="$hasPower('ScienceProjectDelete')" @click="handleDelete(row.id, row)">删除</a>
          </span>
          <span v-if="row.status === 1 || row.status === 3 || row.status === 4 || row.status === 5 || row.status === 6">
            <a v-if="$hasPower('ScienceProjectDetail')" @click="handleDetail(row.id, row)">查看</a>
          </span>
          <!--<span v-if="row.status === 2">
            <a @click="handleDetail(row.id, row)">查看</a>&nbsp;
            <a @click="handleEdit(row.id, row)">编辑</a>
          </span>-->
          <span v-if="row.status === 2">
            <a v-if="$hasPower('ScienceProjectDetail')" @click="handleDetail(row.id, row)">查看</a>&nbsp;
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
import Api from '@/api/science/scienceManage/scienceProject'
export default {
  name: 'ScienceProject',
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

      Api.getScienceProjectList({
        projectId: localStorage.getItem('projectId'),
        keyWord,
        schemeType,
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
      this.$router.push({ name: 'ScienceProjectAdd' })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'ScienceProjectDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'ScienceProjectEdit', params: { id: id, isEdit: true } })
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.name} 记录吗？`).then(res => {
        Api.deleteScienceProject(id).then(res => {
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
