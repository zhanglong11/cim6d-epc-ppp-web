<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" inline :model="queryForm">
        <el-form-item>
          <el-select
            v-model="queryForm.monitorArea"
            clearable
            placeholder="所属区域"
            @clear="queryForm.monitorArea = null"
          >
            <el-option v-for="item in monitorAreaList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.status" clearable placeholder="监控状态">
            <el-option v-for="item in monitorStatusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryForm.keyword"
            style="width: 360px"
            placeholder="监控设备编号/设备型号/设备负责人/区域负责人"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('EquipmentMonitoringAdd')" type="primary" icon="el-icon-plus" @click="add()"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table v-loading="loading" :data="dataList" border stripe size="small">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="deviceName" label="监控设备名称" min-width="140px" />
      <el-table-column prop="deviceNum" label="监控设备编号" min-width="140px" />
      <el-table-column prop="factoryNum" label="监控设备型号" min-width="140px" />
      <el-table-column prop="monitorArea" label="所属区域" min-width="140px">
        <template slot-scope="scope">
          {{ $getLabelFromArg('monitorArea', scope.row.monitorArea) }}
        </template>
      </el-table-column>
      <el-table-column prop="monitorTarget" label="监控目标" min-width="140px">
        <template slot-scope="scope">
          {{ $getLabelFromArg('monitorTarget', scope.row.monitorTarget) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="监控状态" min-width="140px">
        <template slot-scope="scope">
          <span :class="`status status-${scope.row.status}`">
            <i></i>
            {{ $getLabelFromArg('monitorStatus', scope.row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="devicePrincipalName" label="监控设备负责人" min-width="140px" />
      <el-table-column prop="areaPrincipalName" label="监控区域负责人" min-width="140px" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('EquipmentMonitoringDetails')"
            type="text"
            size="mini"
            @click="toDetails(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-if="$hasPower('EquipmentMonitoringEdit')"
            type="text"
            size="mini"
            @click="editMonitoring(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="$hasPower('EquipmentMonitoringStart') && [2, 3].includes(scope.row.status)"
            type="text"
            size="mini"
            @click="openMonitor(scope.row.id)"
            >启用
          </el-button>
          <el-button
            v-if="$hasPower('EquipmentMonitoringStop') && ![2, 3].includes(scope.row.status)"
            type="text"
            style="color: #00ff00"
            size="mini"
            @click="stopMonitor(scope.row.id)"
            >停用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()"></el-button>
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
 * @Date: 2020-03-28
 * @Last Modified by: gengweigang
 */
import Api from './api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EquipmentMonitoringList',
  components: {},
  data() {
    /**
     任务名称：TASK#2924	设备监控接口
     开发人员：崔洛宜
     日期：2020-04-11
     任务类型：1、修改查询数据
     **/
    // 这里存放数据
    return {
      loading: false,
      queryForm: {
        // 查询条件
        monitorArea: null,
        status: '',
        keyword: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  computed: {
    /**
     任务名称：TASK#2924	设备监控接口
     开发人员：崔洛宜
     日期：2020-04-11
     任务类型：1、下拉数据
     **/
    //监控区域
    monitorAreaList() {
      return this.$getArgList('monitorArea') || []
    },
    //监控状态
    monitorStatusList() {
      return this.$getArgList('monitorStatus') || []
    },
    //监控目标
    monitorTargetList() {
      return this.$getArgList('monitorTarget') || []
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
      const res = await Api.getMonitorList({ ...this.queryForm, projectId: localStorage.getItem('projectId') }).finally(
        () => (this.loading = false)
      )
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
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.pageSize = pageSize
      this.queryList()
    },
    // 查看详情
    toDetails(id) {
      this.$router.push({
        path: `/equipment-monitoring/details?id=${id}`
      })
    },
    // 新增监控设备
    add() {
      this.$router.push({
        path: '/equipment-monitoring/add'
      })
    },
    // 编辑监控设备
    editMonitoring(id) {
      this.$router.push({
        path: `/equipment-monitoring/edit?id=${id}`
      })
    },
    async stopMonitor(id) {
      const res = await Api.stopMonitor(id)
      if (res.code === 200) {
        this.$message.success('停用成功')
        await this.queryList()
      }
    },
    async openMonitor(id) {
      const res = await Api.openMonitor(id)
      if (res.code === 200) {
        this.$message.success('启用成功')
        await this.queryList()
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
  &.status-3 i {
    background: #999;
  }
  &.status-2 i {
    background: #ff9900;
  }
}
</style>
