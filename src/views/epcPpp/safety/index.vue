<template>
  <div class="container">
    <div class="tooltips">
      <el-form ref="form" inline :model="filterForm">
        <el-form-item>
          <el-input v-model="filterForm.personName" style="width: 200px" placeholder="发现人/取消人" />
        </el-form-item>
        <el-form-item label="发现日期" prop="findTime">
          <DateRange :startTime.sync="filterForm.beginDate" :endTime.sync="filterForm.endDate" />
        </el-form-item>
        <!-- <el-form-item label="工程类型">
          <el-select v-model="filterForm.engineeringCategory" clearable placeholder="工程类型">
            <el-option v-for="item in engineeringTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="问题类型">
          <el-select v-model="filterForm.issueType" clearable placeholder="问题类型">
            <el-option v-for="item in safetyQuestionTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" clearable placeholder="请选择状态">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item v-if="$hasPower('EpcPppSafetyAdd')">
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="locationName" title="问题部位" width="200"></vxe-table-column>
      <vxe-table-column
        field="issueType"
        title="问题类型"
        width="120"
        :formatter="({ cellValue }) => $getLabel(safetyQuestionTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="description" title="问题描述" min-width="150"></vxe-table-column>
      <vxe-table-column field="discoveryPersonName" title="发现人" width="100"></vxe-table-column>
      <vxe-table-column field="discoveryDate" title="发现日期" width="120" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="cancelPersonName" title="取消人" width="100"></vxe-table-column>
      <vxe-table-column field="cancelDate" title="取消日期" width="120" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="pushPersonName" title="责任人" width="100"></vxe-table-column>
      <vxe-table-column field="rectificationDate" title="整改期限" width="120" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="isPunctualityRectification" title="是否按期整改" width="120">
        <template #default="{ row }">
          {{ row.isPunctualityRectification === 1 ? '是' : '否' }}
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="status"
        title="状态"
        width="100"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="150" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status === 0">
            <el-button v-if="$hasPower('EpcPppSafetyCancel')" type="text" @click="handleCancel(row)">整改</el-button>
            <el-button v-if="$hasPower('EpcPppSafetyUrge')" type="text" @click="handleUrge(row)">催办</el-button>
          </template>
          <el-button v-if="$hasPower('EpcPppSafetyDetail')" type="text" @click="toDetail(row)">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from './api'
import statusList from './lib/statusList'
export default {
  name: 'SafetyList',
  components: {},
  data() {
    return {
      statusList,
      filterForm: {},
      request(body) {
        body.projectId = localStorage.getItem('projectId')
        return Api.getList(body)
      }
    }
  },
  computed: {
    //工程类型
    engineeringTypeList() {
      return (
        this.$getArgList('epcPPPEngineeringType') || [
          { value: 1, label: '混凝土工程' },
          { value: 2, label: '模板工程' },
          { value: 3, label: '钢筋工程' },
          { value: 4, label: '砌体工程' },
          { value: 5, label: '防水工程1' }
        ]
      )
    },
    //问题类型
    safetyQuestionTypeList() {
      return this.$getArgList('epcPPPSafetyIssueType') || []
    }
  },
  mounted() {},
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    //添加问题按钮
    add() {
      this.$router.push({ name: 'EpcPppSafetyQuestionAdd' })
    },
    //列表取消操作
    async handleCancel(row) {
      let res = await this.$confirm('是否整改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        })
      })
      if (res) {
        await this.$router.push({
          name: 'EpcPppSafetyQuestionDetail',
          params: {
            id: row.id
          },
          query: {
            isCancel: true
          }
        })
      }
    },
    //列表催办操作
    async handleUrge(row) {
      let res = await this.$confirm('是否催办?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        })
      })
      if (res) {
        await Api.urge(row.id)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        await this.refresh()
      }
    },
    //跳转到详情
    toDetail(row) {
      this.$router.push({
        name: 'EpcPppSafetyQuestionDetail',
        params: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
