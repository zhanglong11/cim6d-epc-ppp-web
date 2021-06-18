<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="当前状态">
          <el-select v-model="queryForm.status" placeholder="请选择" @change="search">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.search" style="width: 250px" placeholder="进场编号/创建人" />
        </el-form-item>
        <el-form-item label="进场日期">
          <el-date-picker
            v-model="enterTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleEnterTimeChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="createTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleCreateTimeChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('EnterAndExitList')">
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item class="flex-wrapper">
          <el-button v-if="$hasPower('EquipmentEnterItem')" type="primary" icon="el-icon-plus" @click="addItem()"
            >新增进场设备</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border fit size="small">
      <el-table-column type="index" width="60" align="center" label="序号" />
      <el-table-column prop="code" label="进场编号" min-width="180" show-overflow-tooltip align="center" />
      <el-table-column prop="equipmentCode" label="设备编号" min-width="180" align="center"> </el-table-column>
      <el-table-column prop="equipmentName" label="设备名称" min-width="150" align="center"> </el-table-column>
      <el-table-column prop="location" label="使用位置" min-width="120" align="center" />
      <el-table-column prop="enterTime" label="进场日期" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.enterTime | dateYMD }}</template>
      </el-table-column>
      <el-table-column prop="planExitTime" label="计划退场日期" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.planExitTime | dateYMD }}</template>
      </el-table-column>
      <el-table-column prop="enterPrincipalName" label="进场负责人" width="100" align="center"> </el-table-column>
      <el-table-column prop="realExitTime" label="实际退场日期" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.realExitTime | dateYMD }}</template>
      </el-table-column>
      <el-table-column prop="exitPrincipalName" label="退场负责人" width="100" align="center" />
      <el-table-column label="备注" min-width="180" header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.enterRemark">进场备注:{{ scope.row.enterRemark }}</div>
          <div v-if="scope.row.exitRemark">退场备注:{{ scope.row.exitRemark }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="scope">
          {{ $getLabel(statusList, scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1 && $hasPower('EquipmentExitOutItem')"
            type="text"
            size="mini"
            @click="editItem(scope.row.id)"
            >退 场</el-button
          >
          <el-button v-if="$hasPower('EnterAndExitDetail')" type="text" size="mini" @click="previewItem(scope.row)"
            >查 看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }}
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
import statusList from '../lib/enterAndExitStatus'
export default {
  name: 'EnterAndExit',
  data() {
    return {
      queryForm: {
        // 查询条件
        projectId: this.$store.state.project.projectId,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      createTimeRange: '',
      enterTimeRange: '',
      total: 0,
      statusList
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 选中日期范围时查询数据
    handleCreateTimeChange(val) {
      this.queryForm.createBeginTime = `${val[0]} 00:00:00`
      this.queryForm.createEndTime = `${val[1]} 00:00:00`
      this.search()
    },
    handleEnterTimeChange(val) {
      this.queryForm.enterBeginTime = `${val[0]} 00:00:00`
      this.queryForm.enterEndTime = `${val[1]} 00:00:00`
      this.search()
    },
    // 查询列表
    async queryList() {
      const result = await this.axios.material.post('equipmentEnterExit/list', this.queryForm)
      const datas = result.data
      const list = datas.records || []
      this.total = datas.total
      this.dataList = list
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      this.queryForm = this._.cloneDeep(this.queryFormBack)
      this.createTimeRange = null
      this.enterTimeRange = null
      this.search()
    },
    // 当前页码改变
    changePageNumber(page) {
      this.queryForm.page = page
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(rows) {
      this.queryForm.page = 1
      this.queryForm.rows = rows
      this.queryList()
    },
    // 新建进场设备
    addItem() {
      this.$router.push({
        path: '/supplies/equipmentManage/enter'
      })
    },
    previewItem(data) {
      this.$router.push({
        path: `/supplies/equipmentManage/enterAndExitDetail?id=${data.id}&status=${data.status}`
      })
    },
    // 编辑材料
    editItem(id) {
      this.$router.push({
        path: `/supplies/equipmentManage/exit?id=${id}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.flex-wrapper {
  /deep/ .el-form-item__content {
    display: inline-flex;
  }
  /deep/ .el-upload {
    margin-left: 10px;
  }
}
</style>
