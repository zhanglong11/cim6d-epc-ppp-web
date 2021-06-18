<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <div>
            <el-form-item label="" label-width="0" prop="codeNameCreator" style="margin-right: 20px">
              <el-input
                v-model="filter.codeNameCreator"
                placeholder="变更单编号/变更单名称/变更原因/合同编号/创建人"
                style="width: 335px"
              >
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="创建时间" label-width="120px" prop="createTime">
              <el-date-picker
                v-model="filter.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 400px"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="变更类型" label-width="120px" prop="changeType" style="margin-right: 20px">
              <ContractChangeTypeSelect v-model="filter.changeType"></ContractChangeTypeSelect>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="变更单状态" label-width="120px" prop="status">
              <BasicStatusSelect v-model="filter.status"></BasicStatusSelect>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
        <el-button @click="$refs.form.resetFields()">重置</el-button>
      </div>
    </div>
    <div class="tableWrapper">
      <vxe-table ref="xTable" border :data="tableData" :edit-config="{ trigger: 'manual', mode: 'row' }">
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="changeCode" title="变更编号" />
        <vxe-table-column field="changeName" title="变更名称" />
        <vxe-table-column field="specialName" title="专业名称" />
        <vxe-table-column field="changeReason" title="变更原因" />
        <vxe-table-column field="changeType" title="变更类型">
          <template slot-scope="{ row }">
            <span>{{
              row.changeType !== null && row.changeType !== undefined
                ? contractChangeType.filter(item => item.value === row.changeType)[0].label
                : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="contractCode" title="合同编号">
          <template slot-scope="{ row }">
            <span style="margin: 0 3px">
              <a @click="handleContractDetail(row.contractId)">{{ row.contractCode }}</a></span
            >
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="变更单状态">
          <template slot-scope="{ row }">
            <span>{{
              row.status !== null && row.status !== undefined
                ? contractChangeStatus.filter(item => item.value === row.status)[0].label
                : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="creatorName" title="创建人" />
        <vxe-table-column field="createTime" title="创建时间" />
        <vxe-table-column title="操作">
          <template slot-scope="{ row }">
            <template v-if="row.status === 1">
              <span style="margin: 0 3px"><a @click="handleCheck(row.id)">审核</a></span>
            </template>
            <template v-else>
              <span style="margin: 0 3px"> <a @click="handleDetail(row.id)">查看</a></span>
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
  </div>
</template>
<script>
import contractChangeType from '@/lib/contractChangeType'
import contractChangeStatus from '@/lib/basicStatus'
import Api from '@/api/contract/contractChange'

export default {
  name: 'ContractChange',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      filter: {
        keyword: '',
        changeType: null,
        status: null,
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      contractChangeType: contractChangeType,
      contractChangeStatus: contractChangeStatus
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
      Api.getContractChangeList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        createStartTime: this.filter.createTime[0] || '',
        createEndTime: this.filter.createTime[1] || ''
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleContractDetail(id) {
      this.$router.push(`/contract/manage/detail/${id}`)
    },
    handleDetail(id) {
      this.$router.push({ name: `ChangeContractDetail`, params: { id: id, isCheck: false } })
    },
    handleCheck(id) {
      this.$router.push({ name: `ChangeContractCheckDetail`, params: { id: id, isCheck: true } })
    },
    handleDelete(id) {
      Api.deleteContractChangeById(id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.refresh()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleDownload() {
      console.log('下载')
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh()
    },
    handleAddContractChangeClick() {
      this.$router.push('AddContractChange')
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
  .operateButton {
    flex: 0 0 200px;
    text-align: right;
  }
}
</style>
