<template>
  <div>
    <div><el-button plain @click="handleExport">导出</el-button></div>
    <div class="tableWrapper">
      <!--
          /**
                 任务名称：TASK#2791 3月3号注释
                 开发人员：崔洛宜
                 日期：2020-03-03
                 任务类型：注释
                 **/
      -->
      <vxe-table ref="xTable" border :data="tableData" auto-resize>
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <!--
            /**
           任务名称：TASK#2792 3月4号注释
           开发人员：崔洛宜
           日期：2020-03-04
           任务类型：注释
           **/
        -->
        <vxe-table-column field="materialName" title="材料（工程设备）名称、规格、型号" width="250" />
        <vxe-table-column field="unit" title="计量单位" />
        <vxe-table-column title="数量">
          <vxe-table-column field="interimQuantity" title="暂估"></vxe-table-column>
          <vxe-table-column field="confirmQuantity" title="确认"></vxe-table-column>
        </vxe-table-column>
        <vxe-table-column title="暂估(元)">
          <vxe-table-column field="interimUnitPrice" title="单价"></vxe-table-column>
          <vxe-table-column field="interimCombinedPrice" title="合价"></vxe-table-column>
        </vxe-table-column>
        <vxe-table-column title="确认(元)">
          <vxe-table-column field="confirmUnitPrice" title="单价"></vxe-table-column>
          <vxe-table-column field="confirmCombinedPrice" title="合价"></vxe-table-column>
        </vxe-table-column>
        <vxe-table-column title="差额(元)">
          <vxe-table-column field="differenceUnitPrice" title="单价"></vxe-table-column>
          <vxe-table-column field="differenceCombinedPrice" title="合价"></vxe-table-column>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" />
      </vxe-table>
    </div>
  </div>
</template>
<script>
/**
 任务名称：TASK#2791 3月3号注释
 开发人员：崔洛宜
 日期：2020-03-03
 任务类型：注释
 **/
import Api from '@/api/contract/contractManage'
export default {
  name: 'MaterialPriceResizeList',
  props: {
    /**
     任务名称：TASK#2791 3月3号注释
     开发人员：崔洛宜
     日期：2020-03-03
     任务类型：注释
     **/
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
      /**
       任务名称：TASK#2791 3月3号注释
       开发人员：崔洛宜
       日期：2020-03-03
       任务类型：注释
       **/
      if (this.contractId) {
        Api.getContractInventoryMaterialInterimValuation({
          contractId: this.contractId,
          categoryCode: this.categoryCode
        }).then(res => {
          this.tableData = res.data.records
        })
      }
    },
    /**
     任务名称：TASK#2791 3月3号注释
     开发人员：崔洛宜
     日期：2020-03-03
     任务类型：注释
     **/
    handleExport() {
      Api.exportContractInventoryMaterialInterimValuation({
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
    /**
     任务名称：TASK#2791 3月3号注释
     开发人员：崔洛宜
     日期：2020-03-03
     任务类型：注释
     **/
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let fileName =
        this.categoryCode === '1'
          ? '建筑工程_材料（工程设备）暂估单价及调整表.xls'
          : '机电设备及安装工程_材料（工程设备）暂估单价及调整表.xls'
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
