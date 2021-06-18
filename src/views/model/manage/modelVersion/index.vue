<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="filterForm" :inline="true" :model="filter">
          <div>
            <el-form-item label label-width="0" prop="content" style="margin-right: 20px">
              <el-input v-model="filter.content" placeholder="模型版本编号/模型版本名称/变更人" style="width: 300px">
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="更新时间" label-width="100px" prop="createTime" style="margin-right: 20px">
              <el-date-picker
                v-model="filter.createTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 400px"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="状态" label-width="100px" prop="status" style="margin-right: 20px">
              <el-select v-model="filter.status" placeholder="请选择">
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <el-button
          v-if="$hasPower('ModelVersionAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="
            () => {
              formData = {}
              editDialogVisible = true
            }
          "
          >新增模型版本变更</el-button
        >
      </el-col>
      <el-col :span="6" style="text-align: right"></el-col>
    </el-row>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        border
        :data="tableData"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
        :loading="loading"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="versionCode" title="版本编号"></vxe-table-column>
        <vxe-table-column field="versionName" title="版本名称" />
        <vxe-table-column field="remark" title="备注" />
        <vxe-table-column field="creatorName" title="变更人" />
        <vxe-table-column field="createTime" title="变更日期" />
        <vxe-table-column field="status" title="状态" width="120">
          <template slot-scope="{ row }">
            <span>{{
              row.status !== null && row.status !== undefined
                ? stateList.filter(item => item.value === row.status)[0].label
                : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="120">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ModelVersionDetail')" style="margin: 0 3px">
              <a @click="handleDetail(row.id)">查看</a></span
            >
            <template v-if="row.status === 0">
              <span v-if="$hasPower('ModelVersionEdit')" style="margin: 0 3px"
                ><a @click="handleEdit(row)">编辑</a></span
              >
              <span v-if="$hasPower('ModelVersionDelete')" style="margin: 0 3px"
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
    <el-dialog width="720px" :title="(form.id ? '编辑' : '新建') + '模型版本变更'" :visible.sync="editDialogVisible">
      <div id="process-edit">
        <el-form ref="form" label-positon="left" label-width="120px" :model="form" :rules="rules">
          <el-form-item label="模型版本编号" prop="versionCode">
            <el-input v-model="form.versionCode"></el-input>
          </el-form-item>
          <el-form-item label="模型版本名称" prop="versionName">
            <el-input v-model="form.versionName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Api from '@/api/model/modelVersion'
import supplierState from '@/lib/supplier/supplierState'

export default {
  name: 'ModelVersion',
  data() {
    return {
      // 状态列表
      stateList: supplierState,
      editDialogVisible: false,
      loading: true,
      form: {
        activeFlag: 0,
        companyId: this.$store.getters.companyId,
        createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        creator: '',
        projectId: localStorage.getItem('projectId'),
        remark: '',
        status: 0,
        versionCode: '',
        versionName: '',
        creatorName: this.$store.getters.name || 'admin'
      },
      rules: {
        versionCode: [{ required: true, message: '必填' }],
        versionName: [{ required: true, message: '必填' }]
      },
      projectId: localStorage.getItem('projectId'),
      filter: {
        content: '',
        status: null,
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  watch: {
    '$store.getters.companyId': function () {
      this.refresh()
    }
  },
  mounted() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      let companyId = this.$store.getters.companyId
      if (companyId) {
        this.loading = true
        Api.getVersionList({
          ...this.filter,
          rows: this.pageSize,
          page: this.currentPage,
          projectId: this.projectId,
          companyId,
          createTimeBegin: this.filter.createTime[0] || '',
          createTimeEnd: this.filter.createTime[1] || ''
        }).then(res => {
          if (res.code === 200) {
            this.loading = false
            this.tableData = res.data.records
            this.total = res.data.total
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
      }
    },
    handleDetail(id) {
      this.$router.push({ name: `ModelVersionDetail`, params: { id: id, isCheck: false } })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh()
    },
    reset() {
      this.$refs.filterForm.resetFields()
      this.refresh(true)
    },
    handleEdit(row) {
      this.form = row
      this.editDialogVisible = true
    },
    async submit() {
      await this.$refs.form.validate()
      localStorage.setItem('lastEditModel', JSON.stringify(this.form))
      this.$router.push({ name: `ModelVersionAdd` })
    },
    async handleDelete(id) {
      await Api.deleteVersionById(id)
      this.$message.success('删除成功')
      this.refresh()
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
