<template>
  <el-dialog title="选择清单" :visible="visible" width="1400px" top="10px" @close="$emit('close')">
    <div class="contentWrapper">
      <div class="headContainer">
        <div class="formWrapper">
          <el-form ref="form" :inline="true" :model="filter">
            <div>
              <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px">
                <el-input v-model="filter.keyword" placeholder="项目编号/项目名称" style="width: 250px">
                  <i slot="suffix" class="el-icon-search"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="所属类型" prop="categoryCode">
                <ProjectBelongTypeSelect v-model="filter.categoryCode"></ProjectBelongTypeSelect>
              </el-form-item>
              <el-form-item label="" style="float: right">
                <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="tableWrapper">
        <vxe-table ref="xTable" border :data="tableData" @checkbox-change="checkboxChangeEvent">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="itemCode" title="项目编号" />
          <vxe-table-column field="itemName" title="项目名称" />
          <vxe-table-column field="unit" title="单位" />
          <vxe-table-column field="comprehensiveUnitPrice" title="合同单价(元)" />
          <vxe-table-column field="quantity" title="合同数量" />
          <vxe-table-column field="catergory" title="所属分类"></vxe-table-column>
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
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Api from '@/api/contract/sceneVisa'
import projectBelongType from '@/lib/projectBelongType'
import { filter } from 'xe-utils/methods'
export default {
  name: 'ListDialog',
  props: {
    contractId: {
      type: [Number, String],
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectRows: [],
      filter: {
        keyword: '',
        categoryCode: null
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      projectBelongType: projectBelongType
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    async refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      /**
       任务名称：BUG1449 合同管理-现场签证-现场签证基本信息-选择清单：在选择清单页面，输入任何条件，查询功能无效
       开发人员：崔洛宜
       日期：2020-03-31
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      let res = await Api.getDecomposeList({
        ...this.filter,
        contractId: this.contractId,
        rows: this.pageSize,
        page: this.currentPage
      })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    /**
     任务名称：BUG1449 合同管理-现场签证-现场签证基本信息-选择清单：在选择清单页面，输入任何条件，查询功能无效
     开发人员：崔洛宜
     日期：2020-03-31
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/
    reset() {
      this.$refs.form.resetFields()
      this.refresh(true)
    },
    handlePageChange(page) {
      this.currentPage = page
      /**
       任务名称：BUG1449 合同管理-现场签证-现场签证基本信息-选择清单：在选择清单页面，输入任何条件，查询功能无效
       开发人员：崔洛宜
       日期：2020-03-31
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      //this.refresh(true)
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    checkboxChangeEvent({ selection }) {
      this.selectRows = selection
    },
    handleSubmit() {
      if (this.selectRows.length > 0) {
        this.$emit('submit', this.selectRows)
      } else {
        this.$message.error('请至少选择一个清单')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
