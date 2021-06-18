<template>
  <div class="container">
    <div class="tooltips">
      <el-form ref="form" inline :model="filterForm">
        <el-form-item>
          <el-input v-model="filterForm.keyWord" style="width: 200px" placeholder="创建人/名称" />
        </el-form-item>
        <!--<el-form-item label="状态">
          <el-select v-model="filterForm.status" clearable placeholder="请选择状态">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('InvestmentEstimateAddEpcPpp')" type="primary" icon="el-icon-plus" @click="add"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="投资概算名称" width="200"></vxe-table-column>
      <vxe-table-column field="money" title="概算总额(万元)" width="200"></vxe-table-column>
      <vxe-table-column field="preName" title="投资估算名称" width="200">
        <template #default="{ row }">
          <a @click="toReckon(row.lastBudgetId)">{{ row.preName }}</a>
        </template>
      </vxe-table-column>
      <vxe-table-column field="preMoney" title="估算总额(万元)" width="200"></vxe-table-column>
      <vxe-table-column field="ratio" title="比值" width="150"></vxe-table-column>
      <!-- <vxe-table-column
        field="status"
        title="状态"
        width="120"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      >
      </vxe-table-column>-->
      <vxe-table-column field="remark" title="备注" min-width="200" />
      <vxe-table-column field="creatorName" title="创建人" width="100"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建日期" width="180" formatter="ymd"></vxe-table-column>
      <vxe-table-column title="操作" width="150" fixed="right">
        <template #default="{ row }">
          <template v-if="row.usedFlag === 0">
            <el-button v-if="$hasPower('InvestmentEstimateEditEpcPpp')" type="text" @click="toEdit(row)">
              编辑
            </el-button>
            <el-button v-if="$hasPower('InvestmentEstimateDeleteEpcPpp')" type="text" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
          <el-button v-if="$hasPower('InvestmentEstimateDetailEpcPpp')" type="text" @click="toDetail(row)"
            >查看
          </el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../api'
import statusList from '../lib/statusList'
export default {
  name: 'EstimateList',
  components: {},
  data() {
    return {
      statusList,
      filterForm: { type: 2 },
      request(body) {
        body.projectId = localStorage.getItem('projectId')
        return Api.getEstimateList(body)
      }
    }
  },
  computed: {},
  watch: {},
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
    //添加按钮
    add() {
      this.$router.push({ name: 'InvestmentEstimateAddEpcPpp' })
    },
    //删除操作
    async handleDelete(row) {
      let res = await this.$confirm('是否删除?', '提示', {
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
        await Api.deleteEstimate(row.id)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        await this.refresh()
      }
    },
    //跳转到估算
    toReckon(id) {
      this.$router.push({
        name: 'InvestmentReckonDetailEpcPpp',
        params: {
          id: id
        }
      })
    },
    //跳转到编辑
    toEdit(row) {
      this.$router.push({
        name: 'InvestmentEstimateEditEpcPpp',
        params: {
          id: row.id
        }
      })
    },
    //跳转到详情
    toDetail(row) {
      this.$router.push({
        name: 'InvestmentEstimateDetailEpcPpp',
        params: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
