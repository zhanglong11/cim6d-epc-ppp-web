<template>
  <div>
    <el-form ref="form" :model="formData" inline>
      <el-row>
        <el-form-item>
          <el-input
            v-model="formData.search"
            style="width: 180px"
            suffix-icon="el-icon-search"
            placeholder="入库单编号/创建人"
          />
        </el-form-item>

        <el-form-item label="入库时间">
          <el-date-picker
            v-model="inDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="onDateChange"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="入库类型">
          <el-select v-model="formData.type" style="width: 120px" @change="onSearch()">
            <el-option :value="null" label="全部"></el-option>
            <el-option value="1" label="领用还回"></el-option>
            <el-option value="2" label="采购入库"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button-group v-if="$hasPower('InWarehouseListView')">
            <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-row>
    </el-form>

    <el-button v-if="$hasPower('NewInWarehouse')" type="primary" icon="el-icon-plus" @click="onNew">新增</el-button>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
      <el-table-column prop="code" label="入库单编号" min-width="100" />
      <el-table-column prop="type" label="入库类型" min-width="100">
        <span slot-scope="scope">
          {{ scope.row.type === 1 ? '领用还回' : '采购入库' }}
        </span>
      </el-table-column>
      <el-table-column prop="money" label="入库金额" min-width="100" />
      <el-table-column prop="remark" label="备注" min-width="100" />
      <el-table-column prop="creatorName" label="入库人" min-width="100" />
      <el-table-column prop="createTime" label="入库时间" min-width="100" />
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('InWarehouseDetail')" type="text" @click="toDetail(scope.row.id)">查看</el-button>
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
  name: 'InWarehouse',
  data() {
    return {
      tableLoading: false,
      inDate: null,
      formData: {
        type: null,
        companyId: '',
        search: '',
        projectId: '',
        beginTime: '',
        endTime: ''
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
      Api.getInList(param)
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
      this.formData.search = ''
      this.inDate = null
      this.formData.beginTime = ''
      this.formData.endTime = ''
      this.formData.type = '1'
      this.getTableData()
    },
    onDateChange(date) {
      this.formData.beginTime = date[0]
      this.formData.endTime = date[1]
    },
    toDetail(id) {
      this.$router.push({
        path: `/supplies/materialManage/inWarehouseDetail`,
        query: {
          id: id
        }
      })
    },
    indexMethod(index) {
      return index + 1
    },
    onNew() {
      this.$router.push({ path: `/supplies/materialManage/newInWarehouse` })
    }
  }
}
</script>
<style lang="less" scoped></style>
