<!--
    /**
                 任务名称：TASK#2790 3月2号注释
                 开发人员：崔洛宜
                 日期：2020-03-02
                 任务类型：注释(全新代码)
                 **/
-->
<template>
  <div>
    <div><el-button plain @click="handleExport">导出</el-button></div>
    <div class="tableWrapper">
      <vxe-table ref="xTable" border :data="tableData" auto-resize>
        <!--
            /**
                 任务名称：TASK#2791 3月3号注释
                 开发人员：崔洛宜
                 日期：2020-03-03
                 任务类型：注释
                 **/
        -->
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="itemName" title="名称" />
        <vxe-table-column field="specifications" title="规格型号" />
        <vxe-table-column field="unit" title="单位" />
        <vxe-table-column field="quantity" title="数量" />
        <vxe-table-column field="unitPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="combinedPrice" title="合价"></vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractManage'
export default {
  name: 'ContractOrderList',
  props: {
    contractId: {
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
        Api.getContractInventoryPurchase({
          contractId: this.contractId
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
      Api.exportContractInventoryPurchase({
        contractId: this.contractId
      }).then(res => {
        /**
         任务名称：BUG1413 合同管理-合同管理：在查看页面，导出合同清单，导出的合同清单打开后没有数据
         开发人员：崔洛宜
         日期：2020-03-31
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
        //this.download(res)
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
      let fileName = '项目清单.xls'
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
