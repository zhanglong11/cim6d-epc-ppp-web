<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <div>
            <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px">
              <el-input v-model="filter.keyword" placeholder="合同名称/合同编号/甲方/乙方/创建人" style="width: 300px">
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="合同类型" label-width="80px" prop="type" style="margin-right: 20px">
              <ContractTypeSelect v-model="filter.type"></ContractTypeSelect>
            </el-form-item>
            <el-form-item label="招采类型" label-width="80px" prop="purchaseMode" style="margin-right: 20px">
              <el-select v-model="filter.purchaseMode">
                <el-option value="null" label="全部"> </el-option>
                <el-option value="1" label="招标"> </el-option>
                <el-option value="2" label="非招标"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="合同状态" label-width="80px" prop="status">
              <ContractStatusSelect v-model="filter.status"></ContractStatusSelect>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="创建日期" prop="date">
              <el-date-picker
                v-model="filter.date"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 400px"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
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
        <vxe-table-column field="code" title="合同编号" />
        <vxe-table-column field="name" title="合同名称">
          <template slot-scope="{ row }">
            <span style="margin: 0 3px">
              <a @click="handleDetail(row.id)">{{ row.name }}</a></span
            >
          </template>
        </vxe-table-column>
        <vxe-table-column field="type" title="合同类型">
          <template slot-scope="{ row }">
            <span>{{ row.type ? contractType.filter(item => item.value === row.type)[0].label : '' }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="firstParty" title="甲方" />
        <vxe-table-column field="secondParty" title="乙方" />
        <vxe-table-column field="amount" title="合同金额（万元）" />
        <vxe-table-column field="purchaseMode" title="招采方式"
          ><template slot-scope="{ row }">
            <span>{{ row.purchaseMode == 1 ? '招标' : '非招标' }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="合同状态">
          <template slot-scope="{ row }">
            <span>{{
              row.status !== null ? contractStatus.filter(item => item.value === row.status)[0].label : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="signDate" title="签订日期" />
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
import contractType from '@/lib/contractType'
import contractStatus from '@/lib/contractStatus'
import Api from '@/api/contract/contractManage'

export default {
  name: 'ContractCheck',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      filter: {
        keyword: '',
        type: null,
        status: null,
        purchaseMode: null,
        date: []
      },
      contractFormVisible: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      contractType: contractType,
      contractStatus: contractStatus
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
      Api.getContractList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        startDate: this.filter.date[0],
        endDate: this.filter.date[1]
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleDetail(id) {
      this.$router.push({ name: `Detail`, params: { id: id } })
    },
    handleCheck(id) {
      this.$router.push({ name: `CheckDetail`, params: { id: id, isCheck: true } })
    },
    handleDelete(id) {
      Api.deleteContractById(id).then(res => {
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
    handleAddContractClick() {
      //this.contractFormVisible = true
      this.$router.push('AddContract')
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
