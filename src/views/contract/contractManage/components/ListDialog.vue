<template>
  <el-dialog title="选择清单" :visible="visible" width="1400px" top="10px" @close="$emit('close')">
    <div class="contentWrapper">
      <div class="headContainer">
        <div class="formWrapper">
          <el-form ref="form" :inline="true" :model="filter">
            <div>
              <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px">
                <!--
                    /**
                   任务名称：TASK#2792 3月4号注释
                   开发人员：崔洛宜
                   日期：2020-03-04
                   任务类型：注释
                   **/
                -->
                <el-input v-model="filter.keyword" placeholder="项目编号/项目名称" style="width: 250px">
                  <i slot="suffix" class="el-icon-search"></i>
                </el-input>
              </el-form-item>
              <!--
                   /**
                   任务名称：TASK#2792 3月4号注释
                   开发人员：崔洛宜
                   日期：2020-03-04
                   任务类型：注释
                   **/
              -->
              <el-form-item label="所属分类" prop="type">
                <ProjectBelongTypeSelect v-model="filter.type" :hasAll="false"></ProjectBelongTypeSelect>
              </el-form-item>
              <el-form-item label="" style="float: right">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="tableWrapper">
        <vxe-table
          ref="xTable"
          v-loading="loading"
          border
          autoResize
          :data="tableData"
          max-height="500px"
          row-id="itemCode"
          :checkbox-config="{
            checkRowKeys: selectRowNameCode
          }"
          :filter-config="{
            remote: false
          }"
          @checkbox-change="checkboxChangeEvent"
          @checkbox-all="selectAllEvent"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <!--
               /**
                   任务名称：TASK#2792 3月4号注释
                   开发人员：崔洛宜
                   日期：2020-03-04
                   任务类型：注释
                   **/
          -->
          <!--
              /**
             任务名称：TASK#2826 3月5号注释
             开发人员：崔洛宜
             日期：2020-03-31
             任务类型：注释(修改字段)
             **/
          -->
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column field="itemCode" title="项目编号" />
          <vxe-table-column field="itemName" title="项目名称" />
          <vxe-table-column field="itemFeature" title="项目特征" />
          <vxe-table-column field="unit" title="单位" />
          <vxe-table-column field="comprehensiveUnitPrice" title="合同单价(元)" />
          <vxe-table-column field="quantity" title="合同数量" />
          <vxe-table-column field="updateUnitPrice" title="变更后单价(元)" />
          <vxe-table-column field="updateQuantity" title="变更后数量" />
          <vxe-table-column field="decomposingedQuantity" title="已分解量" />
          <vxe-table-column field="decomposingResidueQuantity" title="分解剩余量" />
          <vxe-table-column field="catergory" title="所属分类" width="150" />
        </vxe-table>
        <!--<div style="margin-top: 10px">
          <div class="toolbar" style="display: flex;justify-content:space-between">
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
        </div>-->
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import projectBelongType from '@/lib/projectBelongType'
/**
 任务名称：TASK#2792 3月4号注释
 开发人员：崔洛宜
 日期：2020-03-04
 任务类型：注释
 **/
import Api from '@/api/contract/contractManage'
export default {
  name: 'ListDialog',
  props: {
    visible: {},
    contractId: {},
    selectRowIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      /**
       任务名称：TASK#2792 3月4号注释
       开发人员：崔洛宜
       日期：2020-03-04
       任务类型：注释
       **/
      loading: false,
      projectId: localStorage.getItem('projectId'),
      selectRows: this.selectRowIds,
      submitData: this.selectRowIds,
      filter: {
        /**
         任务名称：TASK#2792 3月4号注释
         开发人员：崔洛宜
         日期：2020-03-04
         任务类型：注释
         **/
      },
      arrData: [],
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      projectBelongType: projectBelongType
    }
  },
  computed: {
    selectRowNameCode() {
      let arr = this.selectRows.map(item => item.itemCode)
      return arr
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      /**
       任务名称：TASK#2792 3月4号注释
       开发人员：崔洛宜
       日期：2020-03-04
       任务类型：注释
       **/
      /**
       任务名称：TASK#2826 3月5号注释
       开发人员：崔洛宜
       日期：2020-03-31
       任务类型：注释(修改接口)
       **/
      this.loading = true
      Api.getDecomposeList({
        keyword: this.filter.keyword,
        categoryCode: this.filter.type,
        contractId: this.contractId,
        projectId: this.projectId
      })
        .then(res => {
          let arr = res.data.records.filter(item => item.decomposingResidueQuantity !== 0)
          this.arrData = [...arr]
          this.tableData = arr
          /* console.log(res.data.records)
          console.log(arr)*/
          /*this.total = res.total*/
        })
        .finally(() => (this.loading = false))
    },
    /*reset() {
      this.$refs.form.resetFields()
      this.refresh(true)
    },*/
    reset() {
      this.$refs.form.resetFields()
      this.tableData = [...this.arrData]
    },
    handleSearch() {
      let arr = this.handleFilter(this.arrData, this.filter.keyword, this.filter.type)
      this.tableData = [...arr]
    },
    handleFilter(data, keyword, type) {
      let typeWord = type ? ['建筑工程', '机电设备及安装工程'][type - 1] : ''
      let arr = data.filter(item => {
        if (keyword && type) {
          return (
            (item.itemCode.indexOf(keyword) >= 0 || item.itemName.indexOf(keyword) >= 0) && item.catergory === typeWord
          )
        }
        if (keyword && !type) {
          return item.itemCode.indexOf(keyword) >= 0 || item.itemName.indexOf(keyword) >= 0
        }
        if (!keyword && type) {
          return item.catergory === typeWord
        }
        return true
      })
      return arr
    },
    handlePageChange(page) {
      this.currentPage = page
      /**
       任务名称：TASK#2792 3月4号注释
       开发人员：崔洛宜
       日期：2020-03-04
       任务类型：注释
       **/
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    checkboxChangeEvent({ checked, row }) {
      if (checked) {
        this.submitData.push(row)
      } else {
        this.submitData = this.submitData.filter(item => item.itemCode !== row.itemCode)
      }
    },
    /**
     任务名称：BUG#1353/清单关联全选不管用,以及优化表格最大高度
     开发人员：崔洛宜
     日期：2020-03-27
     任务类型：全选事件
     **/
    selectAllEvent({ checked, records }) {
      if (checked) {
        this.submitData = [...this.submitData, ...records]
      } else {
        this.submitData = []
      }
    },
    getSelectRow() {
      return this.$refs.xTable.getCheckboxRecords()
    },
    handleSubmit() {
      if (this.submitData.length > 0) {
        // this.$emit('submit', this.getSelectRow())
        this.$emit('submit', this.submitData)
      } else {
        this.$message.error('请至少选择一个清单')
      }
    }
  }
}
</script>
<style lang="less" scoped>
/**
   任务名称：BUG#1353/清单关联全选不管用,以及优化表格最大高度
   开发人员：崔洛宜
   日期：2020-03-27
   任务类型：优化表格最大高度
  **/
/deep/ .vxe-table--body-wrapper {
  max-height: 300px;
}
/deep/ .vxe-table--header-wrapper {
  width: 100%;
}
</style>
