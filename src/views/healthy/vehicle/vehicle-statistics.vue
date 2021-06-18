<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item>
          <CompanySelect v-model="queryForm.companyId" clearable placeholder="所属公司" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyword" style="width: 360px" placeholder="公司名称" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('HealthyVehicleStatisticsExport')" icon="el-icon-top-right" @click="handleExport"
            >数据导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table v-loading="loading" :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="subordinateCompanyName" label="公司名称" min-width="140px" />
      <el-table-column prop="registeredCarCount" label="备案车辆" min-width="140px" />
      <el-table-column prop="sterilizeCarCount" label="今日已消毒车辆" min-width="140px" />
      <el-table-column label="统一消毒" width="200" align="center" min-width="140px">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('HealthyDisinfectionRecordList')"
            type="text"
            size="mini"
            @click="toRecordList(scope.row)"
            >查看记录</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="车辆信息" width="200" align="center" min-width="140px">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('HealthyVehicleList')" type="text" size="mini" @click="toVehicleList(scope.row)"
            >查看车辆信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
      </p>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryForm.page"
        :page-size="queryForm.rows"
        :page-sizes="$pageConfig.pageSizes"
        @size-change="changePageSize"
        @current-change="changePageNumber"
      />
    </div>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-30
 * @Last Modified by: gengweigang
 */
import CompanySelect from '../components/CompanySelect'
import Api from '../api/work-bench'
import { mapGetters } from 'vuex'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'HealthyVehicleStatistics',
  components: { CompanySelect },
  data() {
    // 这里存放数据
    return {
      loading: false,
      projectId: localStorage.getItem('projectId'),
      queryForm: {
        // 查询条件
        companyId: '',
        keyword: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryList() {
      this.loading = true
      const result = await Api.getRecordVehicleList({ ...this.queryForm, projectId: this.projectId })
      this.loading = false
      this.dataList = result.data.records
      this.total = result.data.total
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.$refs.form.resetFields()
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.page = pageNumber
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.pageSize = pageSize
      this.queryList()
    },
    // 查看消毒记录
    toRecordList(row) {
      this.$router.push({
        path: '/healthy/disinfection-record-list',
        query: { id: row.id, companyId: this.$store.getters.companyId }
      })
    },
    // 查看车辆信息
    toVehicleList(row) {
      this.$router.push({
        path: '/healthy/healthy-vehicle-list',
        query: { companyId: row.id }
      })
    },
    handleExport() {
      Api.exportRecordVehicleList({}).then(res => {
        this.download(res.data)
      })
    },
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let fileName = '车辆备案列表'
      if ('download' in document.createElement('a')) {
        // 不是IE浏览器
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      } else {
        // IE 10+
        window.navigator.msSaveBlob(blob, fileName)
      }
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;
  i {
    margin-right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00cc00;
  }
  &.status-2 i {
    background: #999;
  }
  &.status-3 i {
    background: #ff9900;
  }
  &.status-4 i {
    background: #ff0000;
  }
}
</style>
