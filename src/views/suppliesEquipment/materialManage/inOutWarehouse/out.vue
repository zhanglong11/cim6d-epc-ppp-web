<template>
  <div>
    <el-form ref="form" :model="formData" inline>
      <el-row>
        <el-form-item>
          <el-input
            v-model="formData.search"
            style="width: 180px"
            suffix-icon="el-icon-search"
            placeholder="出库单编号/创建人"
          />
        </el-form-item>

        <el-form-item label="出库时间">
          <el-date-picker
            v-model="inDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button-group v-if="$hasPower('OutWarehouseListView')">
            <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-row>
    </el-form>

    <el-button v-if="$hasPower('AddOutWarehouse')" type="primary" icon="el-icon-plus" @click="onNew"
      >添加出库</el-button
    >

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
      <el-table-column prop="code" label="出库单号" min-width="100" />
      <el-table-column prop="recipientCompanyName" label="领用单位" min-width="100" />
      <el-table-column prop="recipientName" label="领用人" min-width="100" />
      <el-table-column prop="createTime" label="出库时间" min-width="100" />
      <el-table-column prop="creatorName" label="出库人" min-width="100" />
      <el-table-column prop="remark" label="备注" min-width="100" />
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('OutWarehouseDetail')" type="text" @click="toDetail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.current"
      :page-sizes="[10, 20]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
/*
author: 许雷
date: 2020-06-30
*/
import Api from './api/index.js'

export default {
  name: 'OutWarehouse',
  data() {
    return {
      tableLoading: false,
      inType: '11',
      inDate: '',
      formData: {
        search: '',
        companyId: '',
        projectId: ''
      },
      page: {
        current: 1,
        size: 10, // 每页条数 必须与page-sizes一致
        total: 0
      },
      tableData: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let projectId = localStorage.getItem('projectId')
    this.formData.projectId = projectId ? projectId : this.$store.state.project.projectId
    this.formData.companyId = this.$store.getters.companyId
    this.getTableData()
  },
  // 方法集合
  methods: {
    getTableData() {
      this.tableLoading = true
      this.searchLoading = true
      const param = Object.assign(this.formData, {
        page: this.page.current,
        rows: this.page.size
      })
      Api.getOutList(param)
        .then(res => {
          this.tableData = res.data.records
          this.page.total = res.data.total
        })
        .finally(() => {
          this.tableLoading = false
          this.searchLoading = false
        })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTableData()
    },
    onSearch() {
      this.getTableData()
    },
    onReset() {
      this.getTableData()
    },
    toDetail(id) {
      this.$router.push({
        path: `/supplies/materialManage/outWarehouseDetail`,
        query: {
          id: id
        }
      })
    },
    indexMethod(index) {
      return index + 1
    },
    onNew() {
      this.$router.push({ path: `/supplies/materialManage/addOutWarehouse` })
    }
  }
}
</script>
<style lang="less" scoped></style>
