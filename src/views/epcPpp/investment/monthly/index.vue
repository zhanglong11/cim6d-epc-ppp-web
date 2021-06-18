<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <el-row>
            <el-form-item label="" label-width="0" style="margin-right: 20px">
              <el-input v-model="filter.creatorName" placeholder="创建人" style="width: 320px">
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="月报月份" label-width="100px" style="margin-right: 20px">
              <el-date-picker v-model="filter.reportDate" type="month" placeholder="选择月" value-format="yyyy-MM">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="创建时间" label-width="80px">
              <DateRange :startTime.sync="filter.beginTime" :endTime.sync="filter.endTime" />
            </el-form-item>
            <el-form-item>
              <el-button-group v-if="$hasPower('InvestmentMonthlyEpcPpp')">
                <el-button type="primary" icon="el-icon-search" @click="refresh(true)">查询</el-button>
                <el-button
                  icon="el-icon-refresh-left"
                  @click="
                    () => {
                      $refs.form.resetFields()
                      filter.beginTime = null
                      filter.creatorName = null
                      filter.reportDate = null
                      refresh(true)
                    }
                  "
                  >重置</el-button
                >
              </el-button-group>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="24">
        <el-button
          v-if="$hasPower('investmentMonthlyAddEpcPpp')"
          type="primary"
          icon="el-icon-plus"
          @click="toEdit(null)"
        >
          新建</el-button
        >
      </el-col>
    </el-row>

    <div class="tableWrapper">
      <vxe-table ref="xTable" v-loading="loading" :show-overflow="false" border :data="tableData">
        <vxe-table-column type="seq" width="70" title="序号"></vxe-table-column>
        <vxe-table-column field="name" title="月报名称"></vxe-table-column>
        <vxe-table-column field="creatorName" title="创建人" min-width="120" />
        <vxe-table-column field="createTime" title="创建时间">
          <template slot-scope="{ row }">
            <span>{{ moment(row.createTime).format('YYYY-MM-DD') }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="authorName" title="填报人" min-width="120" />
        <vxe-table-column title="操作" field="set">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('investmentMonthlyDetailEpcPpp')" style="margin: 0 3px">
              <a @click="handleDetail(row)">查看</a></span
            >

            <span v-if="$hasPower('investmentMonthlyEditEpcPpp')" style="margin: 0 3px"
              ><a @click="toEdit(row.id)">编辑</a></span
            >
            <span v-if="$hasPower('investmentMonthlyEditEpcPppDelete')" style="margin: 0 3px"
              ><a @click="handleDelete(row.id)">删除</a></span
            >

            <span v-if="$hasPower('investmentMonthlyDownloadEpcPpp')" style="margin: 0 3px">
              <a @click="download(row)">下载</a>
            </span>
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
  </div>
</template>
<script>
import Api from '@/views/epcPpp/investment/api'
import contentDisposition from 'content-disposition'
export default {
  name: 'InvestmentMonthlyEpcPpp',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      loading: false,
      filter: {},
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
      // payStatus,
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    // 下载
    download(row) {
      const a = document.createElement('a')
      Api.getMonthlyDownload(row.id).then(res => {
        a.href = URL.createObjectURL(res.data)
        a.download =
          _.get(this.file, 'fileName', '') ||
          contentDisposition.parse(res.headers['content-disposition']).parameters.filename
        a.click()
      })
    },
    //刷新列表
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      this.loading = true
      Api.getMonthlyList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId
      })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.records || []
            this.total = res.data.total
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
        .finally(() => (this.loading = false))
    },
    //进入详情页
    handleDetail(row) {
      let { id } = row
      this.$router.push({ name: `investmentMonthlyDetailEpcPpp`, params: { id: id, isEdit: false, isCheck: false } })
    },
    //删除
    handleDelete(id) {
      Api.getMonthlyDelete(id).then(res => {
        if (res.code === 200) {
          this.$confirm('您确定删除选中的投资月报吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.refresh()
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    // 编辑
    toEdit(id) {
      _.isNil(id)
        ? this.$router.push({ name: `investmentMonthlyAddEpcPpp` })
        : this.$router.push({ name: `investmentMonthlyEditEpcPpp`, params: { id } })
    }
  }
}
</script>
<style lang="less" scoped>
.contentWrapper {
  padding: 10px;
}
.tableWrapper {
  margin-top: 20px;
}
.headContainer {
  display: flex;
  justify-content: space-between;
  .formWrapper {
    flex: 1;
  }
  /*.operateButton {*/
  /*  flex: 0 0 150px;*/
  /*  text-align: right;*/
  /*}*/
}
.dropdownItem {
  width: 120px;
  text-align: center;
}
/deep/ .el-range-separator {
  width: 20px;
}
</style>
