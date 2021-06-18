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
    <!--
        /**
     任务名称：BUG1498/合同管理-详情-人材机信息是写死的
     开发人员：崔洛宜
     日期：2020-04-07
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/
    -->
    <div><el-button plain :disabled="tableData.length === 0" @click="handleExport">导出</el-button></div>
    <div class="tableWrapper">
      <vxe-table ref="xTable" border :data="tableData" auto-resize>
        <!--<vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>-->
        <vxe-table-column field="serialNumber" title="序号" />
        <vxe-table-column field="type" title="类型">
          <template slot-scope="{ row }">
            {{ typeList[row.type] }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="categoryCode" title="编号" />
        <vxe-table-column field="categoryName" title="名称" />
        <vxe-table-column field="specificationsModels" title="项目特征(规格)" />
        <vxe-table-column field="unit" title="单位" />
        <vxe-table-column field="quantity" title="工程量" />
        <vxe-table-column field="unitPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="combinedPrice" title="合价"></vxe-table-column>
      </vxe-table>
      <div style="margin-top: 10px">
        <div class="toolbar" style="display: flex; justify-content: space-between">
          <div class="num">
            共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
            <el-button type="text primary" class="el-icon-refresh" @click="getData()"></el-button>
          </div>
          <el-pagination
            class="pagination"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="sizes, prev, pager, next, jumper"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractManage'
export default {
  name: 'PMMDetail',
  props: {
    contractId: {
      type: [Number, String],
      default: ''
    },
    inventoryCategory: { type: [Number, String], default: 1 }
  },
  data() {
    return {
      typeList: {
        1: '人工',
        2: '材料 ',
        3: '机械 ',
        4: '管理费',
        5: '利润',
        6: '清单',
        7: '定额'
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      tableData: []
    }
  },
  created() {
    console.log(this.contractId)
    this.getData()
  },
  methods: {
    /**
     任务名称：BUG1498/合同管理-详情-人材机信息是写死的
     开发人员：崔洛宜
     日期：2020-04-07
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/

    /**
    建筑1，机电：2
     **/
    getData() {
      if (this.contractId) {
        Api.getPMMList({
          contractId: this.contractId,
          inventoryCategory: this.inventoryCategory,
          rows: this.pageSize,
          page: this.currentPage
        }).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
        })
      }
      /*this.tableData = [
        {
          id: 1,
          type: '分部',
          code: '010101',
          name: '土方工程',
          desc: '1.挖土机挖土  一、二类土',
          unit: 'm³',
          number: 1000,
          price: 500,
          totalPrice: 500000
        },
        {
          id: 2,
          type: '清单',
          code: '010101002001',
          name: '挖一般土方',
          desc: '1.挖土机挖土  一、二类土',
          unit: 'm³',
          number: 1000,
          price: 500,
          totalPrice: 500000
        }
      ]*/
    },
    handleExport() {
      Api.exportPMMList(this.contractId, this.inventoryCategory).then(res => {
        this.download(res.data)
      })
    },
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let fileName = this.inventoryCategory === 1 ? '人材机信息(建筑).xls' : '人材机信息(机电).xls'
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
    handlePageChange(page) {
      this.currentPage = page
      this.getData()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getData()
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
