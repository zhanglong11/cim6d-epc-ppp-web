<template>
  <div class="tabContainer">
    <div class="wrapper">
      <div class="treeContainer">
        <div>
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="width: 200px; margin-right: 10px">
          </el-input>
          <el-button type="primary" icon="el-icon-search" @click="$refs.tree.filter(filterText)">搜索</el-button>
          <el-button @click="filterText = ''">重置</el-button>
        </div>
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="treeData"
          :check-on-click-node="true"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
      <div class="tableContainer">
        <vxe-table
          ref="xTable"
          border
          :data="tableData"
          auto-resize
          show-footer
          :footer-method="footerMethod"
          :edit-config="{ trigger: 'manual', mode: 'row' }"
        >
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column field="itemCode" title="项目编码" width="120" />
          <vxe-table-column field="itemName" title="项目名称" width="120" />
          <vxe-table-column field="itemFeature" title="项目特征" width="120" />
          <vxe-table-column field="unit" title="单位" width="60" />
          <vxe-table-column field="contractQuantity" title="合同数量" width="120" />
          <vxe-table-column field="contractUnitPrice" title="合同单价（元）" width="120" />
          <vxe-table-column field="updateUnitPrice" title="变更后单价(元)" width="150" />
          <vxe-table-column field="updateQuantity" title="变更后数量" width="120" />
          <vxe-table-column field="decomposingQuantity" title="分解量" width="120" />
          <vxe-table-column field="measureFinishQuantity" title="已计量完成工程量" width="150" />
          <vxe-table-column
            field="currentFinishQuantity"
            title="本期完成数量"
            width="120"
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
          />
          <vxe-table-column field="currentFinishMoney" title="本期完成金额" width="120" />
          <vxe-table-column field="categoryCode" title="所属分类" width="120">
            <template slot-scope="{ row }">
              <span v-if="row.categoryCode">{{
                projectBelongType.find(item => item.value === row.categoryCode).label
              }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="auditQuantity" title="审核量" width="120" />
          <vxe-table-column field="auditMoney" title="审核金额(元)" width="150" />
          <vxe-table-column v-if="isEdit && !hasChildren" title="操作" width="150px" fixed="right">
            <template #default="{ row }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
              </template>
              <template v-else>
                <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div style="margin-top: 10px">
          <vxe-pager
            border
            size="medium"
            align="right"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
            @page-change="handlePageChange"
          >
          </vxe-pager>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractMeasurementPayment'
import treeForEach from '@/utils/treeForEach'
import projectBelongType from '@/lib/projectBelongType'
export default {
  name: 'PartialProjectUnitPriceMeasuresList',
  props: {
    paymentId: {
      type: [Number, String],
      default: ''
    },
    contractId: {
      type: [Number, String],
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      projectBelongType,
      meteringUnitId: '',
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      hasChildren: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    async getTreeData() {
      let res = await Api.contractMeteringUnitDivisionTree({
        paymentId: this.paymentId,
        contractId: this.contractId,
        projectId: localStorage.getItem('projectId')
      })
      treeForEach(res.data, e => {
        e.label = e.title
      })
      this.treeData = res.data
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data, node) {
      //bug#1513 张龙 04-08
      this.hasChildren = data.children
      this.meteringUnitId = data.id
      this.refresh(true, data.id)
    },
    async refresh(isFirstPage, id) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      let res = await Api.getContractMeasurementPaymentUnitDivisionList({
        meteringUnitId: id,
        paymentId: this.paymentId,
        rows: this.pageSize,
        page: this.currentPage
      })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
      this.refresh(true, this.meteringUnitId)
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['currentFinishMoney'].includes(column.property)) {
            let total = 0
            data.map(item => {
              total += Number(item.currentFinishMoney)
            })
            this.$emit('getPayMoney', Number(total))
            return Number(total).toFixed(2)
          }
          return null
        })
      ]
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        this.saveData(row)
        this.$message.success('保存成功')
      })
    },
    async saveData(row) {
      let res = null
      let param = {
        ...row,
        projectId: localStorage.getItem('projectId'),
        paymentId: this.paymentId
      }
      res = await Api.updateInventory(param)
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tabContainer {
  .wrapper {
    display: flex;
    .treeContainer {
      padding: 5px;
      flex: 0 0 400px;
      height: 100%;
      border: 1px #eee solid;
    }
    .tableContainer {
      margin-left: 10px;
      padding: 5px;
      flex: 1;
      height: 100%;
      border: 1px #eee solid;
      overflow: auto;
    }
  }
}
</style>
