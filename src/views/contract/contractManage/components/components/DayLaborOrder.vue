<!--
    /**
   任务名称：TASK#2826 3月5号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释
   **/
-->
<template>
  <div>
    <div><el-button plain @click="handleExport">导出</el-button></div>
    <div class="tableWrapper">
      <vxe-table ref="xTable" border :data="tableData" auto-resize>
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="itemName" title="项目名称" />
        <vxe-table-column field="unit" title="单位" />
        <vxe-table-column field="interimQuantity" title="暂定数量" />
        <vxe-table-column field="realQuantity" title="实际数量" />
        <vxe-table-column field="comprehensiveUnitPrice" title="综合单价(元)"></vxe-table-column>
        <vxe-table-column title="合价">
          <vxe-table-column field="interimCombinedPrice" title="暂定"></vxe-table-column>
          <vxe-table-column field="realCombinedPrice" title="实际"></vxe-table-column>
        </vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractManage'
export default {
  name: 'DayLaborOrder',
  props: {
    contractId: {
      type: [Number, String],
      default: ''
    },
    categoryCode: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.contractId) {
        Api.getContractInventoryDayWorks({
          contractId: this.contractId,
          categoryCode: this.categoryCode
        }).then(res => {
          this.tableData = res.data.records
        })
      }
    },
    handleExport() {
      Api.exportContractInventoryDayWorks({
        contractId: this.contractId,
        categoryCode: this.categoryCode
      }).then(res => {
        /**
         任务名称：TASK#2828 3月7号注释
         开发人员：崔洛宜
         日期：2020-03-31
         任务类型：注释(修改下载bug)
         **/
        this.download(res.data)
      })
    },
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let fileName = this.categoryCode === '1' ? '建筑工程_计日工表.xls' : '机电设备及安装工程_计日工表.xls'
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
.tableWrapper {
  margin-top: 20px;
}
/deep/ .vxe-table--header-wrapper table {
  width: 100% !important;
}
/deep/ .vxe-table--body-wrapper table {
  width: 100% !important;
}
</style>
