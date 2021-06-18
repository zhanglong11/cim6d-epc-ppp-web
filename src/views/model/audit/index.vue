<template>
  <div>
    <div class="tooltips">
      <el-form ref="filterForm" :inline="true" :model="filter">
        <div>
          <el-form-item label label-width="0" prop="content" style="margin-right: 20px">
            <el-input v-model="filter.content" placeholder="模型版本编号/模型版本名称/变更人" style="width: 300px">
              <i slot="suffix" class="el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="更新时间" label-width="100px" prop="createTime" style="margin-right: 20px">
            <el-date-picker
              v-model="filter.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 400px"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态" label-width="100px" prop="status" style="margin-right: 20px">
            <el-select v-model="filter.status" placeholder="请选择">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <vxe-table ref="xTable" border :data="tableData" :edit-config="{ trigger: 'manual', mode: 'row' }">
      <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
      <vxe-table-column title="模型版本编号" field="versionCode"></vxe-table-column>
      <vxe-table-column title="模型版本名称" field="versionName"></vxe-table-column>
      <vxe-table-column title="备注" field="remark"></vxe-table-column>
      <vxe-table-column title="变更人" field="creatorName"></vxe-table-column>
      <vxe-table-column title="变更日期" formatter="toDateString" field="createTime"></vxe-table-column>
      <vxe-table-column field="status" title="状态" width="120">
        <template slot-scope="{ row }">
          <span>{{
            row.status !== null && row.status !== undefined
              ? stateList.filter(item => item.value === row.status)[0].label
              : ''
          }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template slot-scope="{ row }">
          <span style="margin: 0 3px"> <a @click="handleDetail(row.id)">查看</a></span>
          <template v-if="row.status === 1">
            <span style="margin: 0 3px"><a @click="handleAudit(row.id)">审核</a></span>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import Api from '@/api/model/modelVersion'
import supplierState from '@/lib/supplier/supplierState'

export default {
  name: 'ModelAudit',
  data() {
    return {
      // 状态列表
      stateList: supplierState,
      loading: true,
      projectId: localStorage.getItem('projectId'),
      filter: {
        content: '',
        status: null,
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  watch: {
    '$store.getters.companyId': function () {
      this.refresh()
    }
  },
  mounted() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      let companyId = this.$store.getters.companyId
      if (companyId) {
        this.loading = true
        Api.getVersionList({
          ...this.filter,
          rows: this.pageSize,
          page: this.currentPage,
          projectId: this.projectId,
          companyId,
          createTimeBegin: this.filter.createTime[0] || '',
          createTimeEnd: this.filter.createTime[1] || ''
        }).then(res => {
          if (res.code === 200) {
            this.loading = false
            this.tableData = res.data.records
            this.total = res.data.total
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
      }
    },
    reset() {
      this.$refs.filterForm.resetFields()
      this.refresh(true)
    },
    handleDetail(id) {
      this.$router.push({ name: `ModelVersionDetail`, params: { id: id, isCheck: false } })
    },
    handleAudit(id) {
      this.$router.push({ name: `ModelVersionAudit`, params: { id: id, isCheck: true } })
    }
  }
}
</script>

<style lang="less" scoped></style>
