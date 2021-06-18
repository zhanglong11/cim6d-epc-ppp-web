<template>
  <div>
    <vxe-table ref="xTable" border :data="tableData" auto-resize show-footer :footer-method="footerMethod">
      <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
      <vxe-table-column field="itemCode" title="项目编码" />
      <vxe-table-column field="itemName" title="项目名称" />
      <vxe-table-column field="unit" title="计量单位" />
      <vxe-table-column title="变更前">
        <vxe-table-column field="beforeQuantity" title="数量"></vxe-table-column>
        <vxe-table-column field="beforeUnitPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="beforeMoney" title="金额(元)"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="变更后">
        <vxe-table-column field="afterQuantity" title="数量"></vxe-table-column>
        <vxe-table-column field="afterUnitPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="afterMoney" title="金额(元)"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="变更增减量">
        <vxe-table-column field="changeQuantity" title="数量">
          <template slot-scope="{ row }">
            <span>{{ Number(Number(row.afterQuantity) - Number(row.beforeQuantity)).toFixed(2) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="changeUnitPrice" title="单价">
          <template slot-scope="{ row }">
            <span>{{ Number(Number(row.afterUnitPrice) - Number(row.beforeUnitPrice)).toFixed(2) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="changeMoney" title="金额(元)">
          <template slot-scope="{ row }">
            <span>{{ Number(Number(row.afterMoney) - Number(row.beforeMoney)).toFixed(2) }}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
    </vxe-table>
    <div style="margin-top: 20px; width: 400px">
      <vxe-table ref="changeTable" border :data="changeTableData" auto-resize>
        <vxe-table-column field="beforeDuration" title="变更前工期" />
        <vxe-table-column field="changeDuration" title="增减工期" />
        <vxe-table-column field="afterDuration" title="现工期">
          <template slot-scope="{ row }">
            <span>{{ Number(row.beforeDuration) + Number(row.changeDuration) }}</span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/sceneVisa'
export default {
  name: 'VisaDetail',
  props: {
    siteAccessId: {
      type: [Number, String],
      default: ''
    },
    changeTableData: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.getSceneVisaDetailList({ siteAccessId: this.siteAccessId })
      this.tableData = res.data.records
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['changeMoney'].includes(column.property)) {
            let total = 0
            data.map(item => {
              total += Number(Number(item.afterMoney) - Number(item.beforeMoney))
            })
            return total.toFixed(2)
          }
          return null
        })
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.dataWrapper {
  margin-top: 20px;
  width: 400px;
  display: flex;
  .block {
    flex: 1;
    .name,
    .value {
      border: 1px #e4e4e4 solid;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #585858;
    }
    .value {
      border-top: none;
    }
    .noLeftBorder {
      border-left: none;
    }
  }
}
</style>
