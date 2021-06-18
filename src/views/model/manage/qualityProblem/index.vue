<template>
  <div class="main">
    <div class="task-list-wrap">
      <el-card class="box-card aside">
        <div slot="header" class="clearfix">
          <span>单体楼层</span>
        </div>
        <TreeData type="space" @handleCheckChange="singleChange" />
      </el-card>
      <div class="task-list" style="padding: 0">
        <BIM ref="BIM" idSelect="qualityProblem" />
      </div>
    </div>
    <div class="task-list-wrap" style="margin-top: 10px">
      <el-card class="box-card aside">
        <div slot="header" class="clearfix">
          <span>专业构件</span>
        </div>
        <TreeData type="special" @handleCheckChange="specialChange" />
      </el-card>
      <div class="task-list">
        <div class="headContainer">
          <div class="formWrapper">
            <el-form ref="tableForm" :inline="true" :model="tableForm">
              <div>
                <el-form-item label="紧急程度" label-width="100px" prop="urgencyDegree" style="margin-right: 20px">
                  <el-select v-model="tableForm.emergencyLevel" placeholder="请选择">
                    <el-option
                      v-for="item in urgencyDegree"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关联状态" label-width="100px" prop="bindFlag" style="margin-right: 20px">
                  <el-select v-model="tableForm.bindFlag" placeholder="请选择">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label label-width="0" prop="problemDesc" style="margin-right: 20px">
                  <el-input v-model="tableForm.issueDescription" placeholder="质量问题描述关键字" style="width: 200px">
                    <i slot="suffix" class="el-icon-search"></i>
                  </el-input>
                </el-form-item>
                <el-form-item label label-width="0">
                  <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                  <el-button @click="reset">重置</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <vxe-table
          ref="xTable"
          border
          :data="tableData"
          :edit-config="{ trigger: 'manual', mode: 'row' }"
          :loading="loading"
        >
          <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
          <vxe-table-column title="编号" field="planNum"></vxe-table-column>
          <vxe-table-column title="质量问题描述" field="issueDescription"></vxe-table-column>
          <vxe-table-column title="紧急程度" field="emergencyLevel">
            <template slot-scope="{ row }">
              <span>{{ urgencyDegree.find(item => item.value === row.emergencyLevel).label }}</span>
            </template>
          </vxe-table-column>
          <!--<vxe-table-column title="部位" field="inspectArea"></vxe-table-column>-->
          <vxe-table-column title="更新时间" field="createTime"></vxe-table-column>
          <vxe-table-column field="bindFlag" title="关联状态">
            <template slot-scope="{ row }">
              <span>{{ row.bindFlag == '1' ? '已关联' : '未关联' }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作">
            <template slot-scope="{ row }">
              <template v-if="row.bindFlag == 1">
                <span v-if="$hasPower('removeProblemRelated')" style="margin: 0 3px">
                  <a @click="handleUnbind(row.id)">取消关联</a>
                </span>
                <span v-if="$hasPower('relatedProblemDetail')" style="margin: 0 3px">
                  <a @click="watchLink(row)">查看</a>
                </span>
              </template>
              <template v-else>
                <span v-if="$hasPower('problemRelated')" style="margin: 0 3px">
                  <a @click="handleBind(row.id)">关联</a>
                </span>
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
  </div>
</template>

<script>
import TreeData from '../components/TreeData'
import Api from '@/api/model/quality'
import statusList from '@/lib/paramList/statusList'
import urgencyDegree from '@/lib/paramList/quality/urgencyDegree'
import bimMixin from '@/mixins/bimMixin.js'
export default {
  name: 'QualityProblem',
  components: {
    TreeData
  },
  mixins: [bimMixin],
  data() {
    return {
      loading: false,
      filter: {},
      tableForm: {
        projectId: localStorage.getItem('projectId')
      },
      urgencyDegree,
      statusList,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    singleChange(e) {
      this.$store.commit('bim/changeSingle', e)
    },
    specialChange(e) {
      this.$store.commit('bim/changeMajor', e)
    },
    async refresh() {
      let res = await Api.getQualityBindPage({
        ...this.tableForm,
        rows: this.pageSize,
        page: this.currentPage
      })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    reset() {
      this.$refs.tableForm.resetFields()
      this.handlePageSizeChange(this.pageSize)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.refresh()
    },
    async handleBind(id) {
      this.loading = true
      let componentList = await this.$refs.BIM.relevance()
      if (componentList.length === 0) {
        this.loading = false
        return this.$message.error('请先选择构件')
      }
      let guidList = []
      componentList.forEach(item => {
        guidList.push(item.componentId)
      })
      let param = {
        componentIdList: guidList,
        entityId: componentList[0].modelId,
        projectId: localStorage.getItem('projectId'),
        targetId: id
      }
      await Api.qualityProblemBimBind(param).then(() => {
        this.loading = false
        this.$message.success('关联成功')
        this.refresh()
      })
    },
    async watchLink(row) {
      const res = await Api.getGuid({ targetId: row.id })
      if (res.data.componentIdList.length) {
        this.$refs.BIM.showModelByGuids(res.data.componentIdList)
      }
    },
    async handleUnbind(id) {
      let param = {
        projectId: localStorage.getItem('projectId'),
        targetId: id
      }
      let res = await Api.qualityProblemUnbind(param)
      this.$message.success('取消关联成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
div.main {
  background-color: #f0f2f5;
  padding: 0;
  .task-list-wrap {
    display: flex;
    .aside {
      flex: 0 0 320px;
      max-height: 500px;
      margin-right: 10px;
      background-color: #fff;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d8d8d8;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-track-piece {
        background: transparent;
      }
    }
    .task-list {
      width: calc(100% - 320px);
      min-height: 560px;
      padding: 20px;
      background-color: #fff;
    }
  }
}
.add-row {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
  font-size: 14px;
  line-height: 30px;
  border: 1px dashed #ddd;
  margin-top: -1px;
  i {
    margin-right: 8px;
  }
  text-align: center;
}
.main-footer {
  text-align: right;
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: calc(100% - 40px);
  background-color: #fff;
  margin-top: 15px;
  padding: 10px;
}
</style>
