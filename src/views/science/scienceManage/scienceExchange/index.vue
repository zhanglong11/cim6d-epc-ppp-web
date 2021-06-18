<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 28115153c02bc15ba3d221102af81d02aca94dff
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术交底 搜索和新增的时间组件添加时分秒，新增和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11

@bug名称：1178/技术管理-技术方案-下载方案模板&技术交底-下载交底模板-点击没反应
@开发人员: 董渊海
@修改日期: 2020-04-14
@任务类型: 修改代码，添加交底模板资源文件，以便下载，修改比例(2%)
-->
<template>
  <div>
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="交底名称"
              style="width: 140px"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <!--<el-form-item label="交底类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择交底类型" style="width: 140px;">
              <el-option label="一级交底" value="1"></el-option>
              <el-option label="二级交底" value="2"></el-option>
              <el-option label="三级交底" value="3"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="交底形式" prop="way">
            <el-select v-model="form.way" placeholder="请选择交底形式" style="width: 140px">
              <el-option label="书面交底" value="1"></el-option>
              <el-option label="会议交底" value="2"></el-option>
              <el-option label="样板模型交底" value="3"></el-option>
              <el-option label="挂牌交底" value="4"></el-option>
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
      <el-button v-if="$hasPower('ScienceExchangeAdd')" type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增</el-button
      >
      <a style="font-size: 12px" href="/static/office-template/技术交底记录模版.docx">下载交底模板</a>
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
      <vxe-table-column field="name" title="交底名称">
        <!--任务号：973、修改人：董渊海、修改时间：2020-03-23-->
        <template #default="{ row }">
          <a @click="handleDetail(row.id, row)">{{ row.name }}</a>
        </template>
      </vxe-table-column>
      <!--<vxe-table-column field="disclosureType" title="交底类型">
        <template v-slot="{ row }">
          <span v-if="row.disclosureType === 1">一级交底</span>
          <span v-else-if="row.disclosureType === 2">二级交底</span>
          <span v-else-if="row.disclosureType === 3">三级交底</span>
        </template>
      </vxe-table-column>-->
      <vxe-table-column field="disclosureForm" title="交底形式">
        <template #default="{ row }">
          <span v-if="row.disclosureForm === 1">书面交底</span>
          <span v-else-if="row.disclosureForm === 2">会议交底</span>
          <span v-else-if="row.disclosureForm === 3">样板模型交底</span>
          <span v-else-if="row.disclosureForm === 4">挂牌交底</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="disclosurerName" title="交底人"></vxe-table-column>
      <vxe-table-column field="disclosureTime" title="交底时间"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="130">
        <template #default="{ row }">
          <span>
            <a v-if="$hasPower('ScienceExchangeDetail')" @click="handleDetail(row.id, row)">查看</a>&nbsp;
            <a v-if="$hasPower('ScienceExchangeEdit')" @click="handleEdit(row.id, row)">编辑</a>&nbsp;
            <a v-if="$hasPower('ScienceExchangeDelete')" @click="handleDelete(row.id, row)">删除</a>
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
import Api from '@/api/science/scienceManage/scienceExchange'
export default {
  name: 'ScienceExchange',
  data() {
    return {
      form: {
        synthesize: '',
        type: '',
        way: '',
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
      let name = this.form.synthesize //bug号：1180、修改人：董渊海、修改时间：2020-03-20
      let disclosureType = this.form.type
      let disclosureForm = this.form.way

      this.loading = true

      Api.getScienceExchangeList({
        projectId: localStorage.getItem('projectId'),
        name, //bug号：1180、修改人：董渊海、修改时间：2020-03-20
        disclosureType,
        disclosureForm,
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
      this.$router.push({ name: 'ScienceExchangeAdd' })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'ScienceExchangeDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'ScienceExchangeEdit', params: { id: id } })
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.name} 记录吗？`).then(res => {
        Api.deleteScienceExchange(id).then(res => {
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
