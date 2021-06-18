<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item>
          <CompanySelect v-model="queryForm.labourCompanyId" clearable placeholder="所属公司" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.healthStatus" clearable placeholder="健康状态">
            <el-option
              v-for="item in labourHealthStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.labourEmployeeName" style="width: 260px" placeholder="人员姓名/人员编号" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('LabourWorkerAdd')" type="primary" icon="el-icon-plus" @click="add()"
            >新增</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('HealthyLabourForceListExport')" icon="el-icon-top-right">数据导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="name" label="人员姓名" min-width="140px" />
      <el-table-column prop="employeeNum" label="人员编号" min-width="140px" />
      <el-table-column prop="groupName" label="所属班组" min-width="140px" />
      <el-table-column prop="labourCompanyName" label="所属公司" min-width="140px" />
      <el-table-column prop="monitorDays" label="健康监测天数" min-width="140px" />
      <el-table-column prop="continueFlag" label="是否连续监测" min-width="140px">
        <template slot-scope="scope">
          {{ $getLabelFromArg('continuousMonitor', scope.row.continueFlag + '') }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="在场状态" min-width="140px">
        <template slot-scope="scope">
          <span :class="`status status-${scope.row.enterStatus}`">
            <i />
            {{ $getLabelFromArg('enterStatus', scope.row.enterStatus + '') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="healthStatus" label="健康状态" min-width="140px">
        <template slot-scope="scope">
          <span v-if="scope.row.healthStatus === 1" class="status"> <i />健康 </span>
          <span v-if="scope.row.healthStatus === 2" class="status status-4"> <i />异常 </span>
          <span v-if="scope.row.healthStatus === 0" class="status status-2"> <i />未测量 </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('HealthyLabourForceDetails')" type="text" size="mini" @click="toDetails(scope.row)"
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
import CompanySelect from './components/CompanySelect'
import Api from './api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'HealthyLabourForceList',
  components: { CompanySelect },
  data() {
    // 这里存放数据
    return {
      // 监控状态下拉框数据
      queryForm: {
        // 查询条件
        labourCompanyId: '',
        healthStatus: '',
        labourEmployeeName: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  computed: {
    //连续监测
    continuousMonitorList() {
      return this.$getArgList('continuousMonitor') || []
    },
    //在场状态
    enterStatusList() {
      return this.$getArgList('enterStatus') || []
    },
    //健康状态
    labourHealthStatusList() {
      return this.$getArgList('labourHealthStatus') || []
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
      let res = await Api.queryUserListWithCompany(this.queryForm)
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
    // 查看详情
    toDetails(row) {
      this.$router.push({
        path: `/healthy/labour-force-details`,
        query: { id: row.id }
      })
    },
    // 新增
    add() {
      this.$router.push({
        path: '/labour/worker/new'
      })
    },
    stopMonitor(row) {
      console.log(row)
    },
    openMonitor(row) {
      console.log(row)
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
