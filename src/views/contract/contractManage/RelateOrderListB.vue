<!--
               /**
          任务名称：TASK#2746/合同管理->清单关联
          开发人员：崔洛宜
          日期：2020-03-27
          任务类型：遗漏页面(采购/租赁关联页面)
          **/
         -->
<template>
  <div class="contentWrapper">
    <div class="tableWrapper">
      <vxe-table ref="xTable" border :data="tableData">
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="itemName" title="名称">
          <template slot-scope="{ row }">
            {{ row.itemName }}<span class="bindInfo"> {{ !!row.isBindMaterial ? '(已关联)' : '' }} </span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="specifications" title="规格型号" />
        <vxe-table-column field="unit" title="单位" />
        <vxe-table-column field="quantity" title="数量" />
        <vxe-table-column field="unitPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="combinedPrice" title="合价"></vxe-table-column>
        <vxe-table-column field="materialCode" title="总物资计划编码" />
        <vxe-table-column field="materialName" title="总物资计划名称" />
        <vxe-table-column title="操作" width="150">
          <template slot-scope="{ row }">
            <template v-if="row.isBindMaterial === 0">
              <span style="margin: 0 3px"><a @click="handleRelate(row.id)">关联</a></span>
            </template>
            <template v-else>
              <span style="margin: 0 3px"><a @click="handleCancelRelate(row.id)">取消关联</a></span>
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
      <div style="margin-top: 10px">
        <div class="toolbar" style="display: flex; justify-content: space-between">
          <div class="num">
            共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
            <el-button type="text primary" class="el-icon-refresh" @click="refresh(false)"></el-button>
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
    <RelateModal
      v-if="relateVisible"
      :visible="relateVisible"
      @close="relateVisible = false"
      @submit="handleSubmit"
    ></RelateModal>
  </div>
</template>
<script>
import RelateModal from './components/RelateModalB'
import Api from '@/api/contract/contractManage'
export default {
  name: 'RelateOrderListB',
  components: { RelateModal },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      relateVisible: false,
      selectRowId: '',
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  watch: {},
  created() {
    let { id } = this.$route.params
    this.contractId = id
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      Api.getContractInventoryPurchase({
        rows: this.pageSize,
        page: this.currentPage,
        contractId: this.contractId,
        projectId: this.projectId
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleRelate(id) {
      this.selectRowId = id
      this.relateVisible = true
    },
    async handleCancelRelate(id) {
      let res = await Api.unbindOrderMaterial(id)
      if (res.code === 200) {
        this.$message.success('取消绑定成功')
        this.refresh()
      } else {
        this.$message.error('取消绑定失败,请重试')
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh()
    },
    async handleSubmit(selectRow) {
      let res = await Api.bindOrderMaterial({
        id: this.selectRowId,
        materialCode: selectRow.materialCode,
        materialId: selectRow.id,
        materialName: selectRow.materialName
      })
      if (res.code === 200) {
        this.$message.success('绑定成功')
        this.refresh()
      } else {
        this.$message.error('绑定失败,请重试')
      }
      this.relateVisible = false
    },
    handleCancel() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
.bindInfo {
  color: #2e7af2;
}
</style>
