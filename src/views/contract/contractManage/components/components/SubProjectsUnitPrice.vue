<template>
  <div>
    <div><el-button plain @click="handleExport">导出</el-button></div>
    <div class="tableWrapper">
      <!--
        /**
                 任务名称：TASK#2790 3月2号注释
                 开发人员：崔洛宜
                 日期：2020-03-02
                 任务类型：注释
                 **/
      -->
      <vxe-table ref="xTable" border :data="tableData" auto-resize show-footer :footer-method="footerMethod">
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="itemCode" title="项目编码" />
        <vxe-table-column field="itemName" title="项目名称" />
        <vxe-table-column field="itemFeature" title="项目特征描述" />
        <vxe-table-column field="unit" title="计量单位" />
        <vxe-table-column field="quantity" title="工程量" />
        <vxe-table-column title="金额(元)">
          <vxe-table-column field="comprehensiveUnitPrice" title="综合单价"></vxe-table-column>
          <!--
               /**
               任务名称：BUG1442/合同管理-总承包合同-合价和其中暂估价的数据识别反了
               开发人员：崔洛宜
               日期：2020-03-31
               BUG类型：测试人员发现的研发自测未通过引起的BUG
               **/
          -->
          <!--<vxe-table-column field="interimValuation" title="合价"></vxe-table-column>
          <vxe-table-column field="combinedPrice" title="其中暂估价"></vxe-table-column>-->
          <vxe-table-column field="combinedPrice" title="合价"></vxe-table-column>
          <vxe-table-column field="interimValuation" title="其中暂估价"></vxe-table-column>
        </vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractManage'
export default {
  name: 'SubProjectsUnitPrice',
  props: {
    /**
     任务名称：TASK#2790 3月2号注释
     开发人员：崔洛宜
     日期：2020-03-02
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
    /**
     任务名称：TASK#2791 3月3号注释
     开发人员：崔洛宜
     日期：2020-03-03
     任务类型：注释
     **/
    getData() {
      /**
       任务名称：TASK#2790 3月2号注释
       开发人员：崔洛宜
       日期：2020-03-02
       任务类型：注释
       **/
      if (this.contractId) {
        Api.getSubprojectUnivalenceMeasureList({
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
      Api.exportSubprojectUnivalenceMeasureList({
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
          ? '建筑工程_分布分项工程和单价措施项.xls'
          : '机电设备及安装工程_分布分项工程和单价措施项.xls'
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
    },
    /**
     任务名称：TASK#2790 3月2号注释
     开发人员：崔洛宜
     日期：2020-03-02
     任务类型：注释
     **/
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 2) {
            return '合计'
          }
          if (['interimValuation'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
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
