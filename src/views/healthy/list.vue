<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item>
          <el-select v-model="queryForm.healthStatus" clearable placeholder="健康状态">
            <el-option key="null" label="全部" value="null" />
            <el-option v-for="item in healthStatusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.labourCompanyName" style="width: 360px" placeholder="公司名称/公司编号" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('LabourAdd')" type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button icon="el-icon-top-right" @click="handleExport">数据导出</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table v-loading="loading" :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="name" label="公司名称" min-width="140px" />
      <el-table-column prop="labourEmployeeNum" label="总人数合计" min-width="140px" />
      <el-table-column prop="enterNum" label="在场人数" min-width="140px" />
      <el-table-column prop="abnormalCount" label="健康状态" min-width="140px">
        <template slot-scope="scope">
          <span v-if="scope.row.abnormalCount === 0" class="status status-1"> <i />健康 </span>
          <span v-else class="status status-2"> <i />{{ scope.row.abnormalCount }}位异常 </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('HealthyListDetail')" type="text" size="mini" @click="toDetails(scope.row)"
            >查看详情</el-button
          >
          <!--          <el-button v-if="[1, 2].includes(scope.row.status)" type="text" size="mini" @click="stopMonitor(scope.row)"-->
          <!--            >停止监控</el-button-->
          <!--          >-->
          <!--          <el-button v-else type="text" style="color:#00ff00" size="mini" @click="openMonitor(scope.row)"-->
          <!--            >启动监控</el-button-->
          <!--          >-->
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
import Api from './api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'HealthyList',
  components: {},
  data() {
    // 这里存放数据
    return {
      loading: false,
      queryForm: {
        // 查询条件
        healthStatus: '',
        labourCompanyName: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  computed: {
    healthStatusList() {
      return this.$getArgList('healthStatus') || []
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
      let res = await Api.getCompanyHealthyTableList(this.queryForm).finally(() => (this.loading = false))
      this.dataList = res.data.records
      this.total = res.data.total
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.page = pageNumber
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.pageSize = pageSize
      this.queryList()
    },
    // 查看公司下的人员(传递公司id)
    toDetails(row) {
      this.$router.push({
        path: `/healthy/listDetail`,
        query: { id: row.id }
      })
    },
    stopMonitor(row) {
      console.log(row)
    },
    openMonitor(row) {
      console.log(row)
    },
    // 新增
    add() {
      this.$router.push({
        path: '/labour/company/new'
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
      let fileName = '劳务公司列表'
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
