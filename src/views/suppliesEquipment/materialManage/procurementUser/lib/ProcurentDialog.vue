<template>
  <el-dialog title="" :visible="visible" width="1024px" top="10vh" @close="$emit('close')">
    <div class="container">
      <el-row :gutter="20">
        <el-col :md="24">
          <div class="task-list">
            <div class="headContainer">
              <div class="formWrapper">
                <el-form ref="filterForm" :inline="true" :model="form">
                  <div>
                    <el-form-item label="" label-width="0" prop="content" style="margin-right: 20px">
                      <el-input
                        v-model="form.keyword"
                        placeholder="材料编号/材料名称/供应商/创建人"
                        style="width: 300px"
                      >
                        <i slot="suffix" class="el-icon-search"></i>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" label-width="100px" prop="createTime" style="margin-right: 20px">
                      <DateRange :startTime.sync="form.startDate" :endTime.sync="form.endDate" />
                    </el-form-item>
                    <el-form-item>
                      <el-button-group>
                        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                        <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
                      </el-button-group>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
            <div>
              <vxe-table
                ref="table"
                border
                resizable
                show-overflow
                :data="tableData"
                :edit-config="{ trigger: 'click', mode: 'cell', autoClear: false }"
                @checkbox-change="selectChangeEvent"
              >
                <vxe-table-column type="checkbox" title="选择" width="80" tree-node></vxe-table-column>
                <!--                <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>-->
                <vxe-table-column field="code" title="材料编码"></vxe-table-column>
                <vxe-table-column field="name" title="材料名称"></vxe-table-column>
                <vxe-table-column field="models" title="规格型号"></vxe-table-column>
                <vxe-table-column field="unit" title="单位"></vxe-table-column>
                <vxe-table-column field="brand" title="品牌"></vxe-table-column>
                <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
                <vxe-table-column field="budgetNumber" title="预算量"></vxe-table-column>
                <vxe-table-column field="consumeNumber" title="已使用量"></vxe-table-column>
                <vxe-table-column field="inventoryNumber" title="库存量"></vxe-table-column>
                <vxe-table-column field="remark" title="备注"></vxe-table-column>
              </vxe-table>
            </div>
            <div style="margin-top: 10px">
              <div class="toolbar" style="display: flex; justify-content: space-between">
                <div class="num">
                  共 {{ total }} 条记录 第 {{ form.page }} / {{ Math.ceil(total / pageSize) || 1 }} 页
                  <el-button type="text primary" class="el-icon-refresh" @click="refresh(false)"></el-button>
                </div>
                <el-pagination
                  class="pagination"
                  :total="total"
                  :current-page.sync="form.page"
                  :page-size="form.rows"
                  :page-sizes="$pageConfig.pageSizes"
                  layout="sizes, prev, pager, next, jumper"
                  @current-change="handlePageChange"
                  @size-change="handlePageSizeChange"
                />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <footer slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>
<script>
import Api from '@/api/supplies/material/procurement'
export default {
  name: 'ProcurentDialog',

  props: {
    visible: {},
    type: {}
  },

  data() {
    // 这里存放数据
    return {
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      /*列表*/
      tableData: [],
      form: {
        page: 1,
        rows: 10,
        keyword: null,
        type: this.type,
        projectId: localStorage.getItem('projectId')
      },
      checkedVal: ''
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.getMaterialList()
    },
    selectChangeEvent({ records }) {
      this.checkedVal = records
      // console.info(`勾选${records.length}个树形节点`, records)
    },
    handlePageChange(page) {
      this.form.page = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.form.page = 1
      this.form.row = pageSize
      this.refresh()
    },
    reset() {
      this.form = { type: this.type, page: 1, rows: 10 }
      this.refresh()
    },
    async getMaterialList() {
      let res = await Api.getMaterialList(this.form)
      this.tableData = res.data.records || []
      this.total = res.data.total
      // console.log(this.tableData)
    },

    submit() {
      this.$emit('getTarget', { checked: this.checkedVal })
      // this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .treeView {
    margin-bottom: 15px;
  }
  .buttons {
    margin: 10px 0;
  }
}
</style>
