<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>出入库记录</span>
      </div>
      <div class="tooltips">
        <el-form inline>
          <el-form-item>
            <el-radio-group v-model="mode" @change="handleModeChang">
              <el-radio-button label="out">出库记录</el-radio-button>
              <el-radio-button label="in">入库记录</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryForm.search"
              style="width: 360px"
              placeholder="材料编码/材料名称/规格型号/单位/品牌/供应商"
            />
          </el-form-item>
          <el-form-item :label="mode === 'in' ? '入库日期' : '出库日期'">
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleTimeChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>

      <el-table v-if="mode === 'in'" ref="inTable" :data="dataList" border fit size="small">
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column prop="code" label="材料编码" min-width="180" show-overflow-tooltip align="center" />
        <el-table-column prop="materialName" label="材料名称" min-width="120" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="models" label="规格型号" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="unit" label="单位" min-width="100" align="center"> </el-table-column>
        <el-table-column prop="brand" label="品牌" min-width="120" align="center" />
        <el-table-column prop="supplier" label="供应商" min-width="120" align="center"> </el-table-column>
        <el-table-column min-width="100" align="center" prop="number" label="入库数量"> </el-table-column>
        <el-table-column min-width="150" align="center" prop="createTime" label="入库日期"> </el-table-column>
        <el-table-column prop="univalence" label="单价" width="150" align="center"> </el-table-column>
        <el-table-column label="合价" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.combinedPrice }}
          </template>
        </el-table-column>
      </el-table>
      <el-table v-else ref="outTable" :data="dataList" border fit size="small">
        <el-table-column type="index" width="60" align="center" label="序号" />
        <el-table-column prop="code" label="材料编码" min-width="180" show-overflow-tooltip align="center" />
        <el-table-column prop="materialName" label="材料名称" min-width="120" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="models" label="规格型号" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="unit" label="单位" min-width="100" align="center"> </el-table-column>
        <el-table-column prop="brand" label="品牌" min-width="120" align="center" />

        <el-table-column prop="supplier" label="供应商" min-width="120" align="center"> </el-table-column>

        <el-table-column min-width="100" align="center" prop="inventoryNumber" label="库存量"> </el-table-column>
        <el-table-column min-width="100" align="center" prop="number" label="出库数量"> </el-table-column>
        <el-table-column min-width="100" align="center" prop="recipientName" label="领料人"> </el-table-column>
        <el-table-column min-width="150" align="center" prop="createTime" label="出库日期">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="150" align="center" prop="usePart" label="使用部位"> </el-table-column>
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
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返 回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventoryRecord',
  data() {
    return {
      mode: 'out',
      queryForm: {
        // 查询条件
        projectId: this.$store.state.project.projectId,
        page: 1,
        rows: this.$pageConfig.pageSize,
        materialId: this.$route.query.id || ''
      },
      queryFormBack: {},
      dataList: [],
      total: 0,
      timeRange: null
    }
  },
  created() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  methods: {
    // 切换出入库记录
    handleModeChang() {
      this.reset()
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      this.queryForm = this._.cloneDeep(this.queryFormBack)
      this.timeRange = null
      this.search()
    },
    // 选中日期范围时查询数据
    handleTimeChange(val) {
      this.queryForm.beginTime = `${val[0]} 00:00:00`
      this.queryForm.endTime = `${val[1]} 00:00:00`

      this.search()
    },
    // 查询出入库记录
    async queryList() {
      let url = this.mode === 'in' ? `/materialInput/pageListInputMaterial` : `/materialOutput/pageListOutputMaterial`
      let result = await this.axios.material.post(url, this.queryForm)
      this.dataList = result.data.records || []
      this.total = result.data.total
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
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped></style>
