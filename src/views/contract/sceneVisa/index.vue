<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <div>
            <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px">
              <el-input
                v-model="filter.keyword"
                placeholder="现场签证编号/现场签证名称/合同编号/创建人"
                style="width: 310px"
              >
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
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
            <el-form-item label="现场签证状态" label-width="120px" prop="status">
              <BasicStatusSelect v-model="filter.status"></BasicStatusSelect>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
        <el-button
          @click="
            () => {
              $refs.form.resetFields()
              refresh(true)
            }
          "
          >重置</el-button
        >
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <el-button
          v-if="$hasPower('SceneVisaAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddContractChangeClick"
          >新建现场签证</el-button
        ></el-col
      >
      <el-col :span="6" style="text-align: right"> </el-col>
    </el-row>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        v-loading="loading"
        border
        :data="tableData"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="accessNumber" title="现场签证编号" width="150" />
        <vxe-table-column field="accessName" title="现场签证名称" width="150" />
        <vxe-table-column field="place" title="部位" width="150" />
        <vxe-table-column field="accessDate" title="日期" width="150">
          <template slot-scope="{ row }">
            {{ moment(row.accessDate).format('YYYY-MM-DD') }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="accessReason" title="签证原因" min-width="150" />
        <vxe-table-column field="contractCode" title="合同编号" width="150">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ContractDetail')" style="margin: 0 3px">
              <a @click="handleContractDetail(row.contractId)">{{ row.contractCode }}</a></span
            >
            <span v-else>{{ row.contractCode }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="现场签证状态" width="120">
          <template slot-scope="{ row }">
            <span>{{
              row.status !== null && row.status !== undefined
                ? sceneVisaStatus.filter(item => item.value === row.status)[0].label
                : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="creatorName" title="创建人" width="100" />
        <vxe-table-column field="createTime" title="创建时间" width="150" />
        <vxe-table-column title="操作" width="120">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('SceneVisaDetail')" style="margin: 0 3px">
              <a @click="handleDetail(row.id)">查看</a></span
            >
            <template v-if="row.status === 0">
              <span v-if="$hasPower('SceneVisaAdd') && $hasPower('SceneVisaEdit')" style="margin: 0 3px"
                ><a @click="handleEdit(row.id)">编辑</a></span
              >
              <span v-if="$hasPower('SceneVisaRemove')" style="margin: 0 3px"
                ><a @click="handleDelete(row.id)">删除</a></span
              >
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
import sceneVisaStatus from '@/lib/basicStatus'
import Api from '@/api/contract/sceneVisa'
export default {
  name: 'SceneVisa',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      loading: false,
      filter: {
        keyword: '',
        status: '',
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      sceneVisaStatus: sceneVisaStatus
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
      this.loading = true
      Api.getSceneVisaList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        createStartTime: this.filter.createTime?.[0],
        createEndTime: this.filter.createTime?.[1]
      })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.records
            this.total = res.data.total
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
        .finally(() => (this.loading = false))
    },
    handleAddContractChangeClick() {
      this.$router.push('AddSceneVisa')
    },
    handleContractDetail(id) {
      this.$router.push(`/contract/detail/${id}`)
    },
    handleDetail(id) {
      this.$router.push({ name: `SceneVisaDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `SceneVisaAdd`, query: { id: id, isEdit: true } })
    },
    handleDelete(id) {
      Api.deleteSceneVisaById(id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.refresh()
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
