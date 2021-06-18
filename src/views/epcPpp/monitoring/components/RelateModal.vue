<template>
  <el-dialog title="关联" width="800px" :visible="visible" @close="$emit('update:visible', false)">
    <div>
      <div>
        <el-form ref="form" :inline="true" :model="form">
          <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px">
            <el-input v-model="form.keyword" placeholder="项目编号/项目名称" style="width: 250px"> </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
              <el-button @click="$refs.form.resetFields()">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <vxe-table
          ref="xTable"
          border
          :data="tableData"
          max-height="500px"
          @checkbox-change="checkboxChangeEvent"
          @checkbox-all="selectAllEvent"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column field="name" title="设备名称" />
          <vxe-table-column field="code" title="设备编号" />
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
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RelateModal',
  props: ['visible'],
  data() {
    return {
      form: {},
      tableData: [],
      selectRows: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh(isFirstPage = true) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      /**
       任务名称：TASK#2792 3月4号注释
       开发人员：崔洛宜
       日期：2020-03-04
       任务类型：注释
       **/
      /*Api.getDeviceList(this.form).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })*/
      this.tableData = [
        { id: 1, name: '发射器', code: '001' },
        { id: 2, name: '接受器', code: '002' },
        { id: 3, name: '分析仪', code: '003' }
      ]
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    checkboxChangeEvent({ selection }) {
      this.selectRows = selection
    },
    selectAllEvent({ checked, records }) {
      this.selectRows = records
    },
    handleSubmit() {
      if (this.selectRows.length > 0) {
        this.$emit('submit', this.selectRows)
      } else {
        this.$message.error('请至少选择一个设备')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
