<template>
  <div class="main">
    <div class="task-list-wrap">
      <el-card class="box-card aside">
        <div slot="header" class="clearfix">
          <span>专业构件</span>
        </div>
        <TreeData type="special" @handleCheckChange="billChange" />
      </el-card>
      <div class="task-list">
        <div class="model-show" style="padding: 0">
          <BIM ref="BIM" flag="listing" idSelect="inventory" :bindType="true" />
        </div>
        <div class="data-list">
          <div class="headContainer">
            <div class="formWrapper">
              <el-form ref="tableForm" :inline="true" :model="tableForm">
                <div>
                  <el-form-item label="" label-width="0" style="margin-right: 20px">
                    <h3>清单列表</h3>
                  </el-form-item>
                  <el-form-item label="关联状态" label-width="100px" prop="isBindComponent" style="margin-right: 20px">
                    <el-select v-model="tableForm.isBindComponent" placeholder="请选择">
                      <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属分类" label-width="100px" prop="categoryCode" style="margin-right: 20px">
                    <el-select v-model="tableForm.categoryCode" placeholder="请选择">
                      <el-option
                        v-for="item in catergoryList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                  <el-button @click="reset()">重置</el-button>
                  <el-button style="float: right" @click="autoMatch">自动匹配</el-button>
                </div>
              </el-form>
            </div>
          </div>
          <vxe-table
            ref="xTable"
            border
            :data="tableData"
            :seq-config="{ startIndex: (currentPage - 1) * pageSize }"
            :edit-config="{ trigger: 'manual', mode: 'row' }"
            :loading="loading"
          >
            <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
            <vxe-table-column title="项目编号" field="itemCode"></vxe-table-column>
            <vxe-table-column title="项目名称" field="itemName"></vxe-table-column>
            <vxe-table-column title="项目特征描述" field="itemFeature"></vxe-table-column>
            <vxe-table-column title="计量单位" field="unit"></vxe-table-column>
            <vxe-table-column title="工程量" field="quantity"></vxe-table-column>
            <vxe-table-column title="综合单价" field="comprehensiveUnitPrice"></vxe-table-column>
            <vxe-table-column title="合价" field="combinedPrice"></vxe-table-column>
            <vxe-table-column field="catergory" title="所属分类"> </vxe-table-column>
            <vxe-table-column title="关联状态" field="bindFlag">
              <template slot-scope="{ row }">
                <!--                <span v-if="row.bindFlag">{{ statusList.find(item => item.value === row.bindFlag).label }}</span>-->
                <span>{{ row.isBindComponent == '1' ? '已关联' : '未关联' }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" width="120">
              <template slot-scope="{ row }">
                <template v-if="row.isBindComponent == '1'">
                  <span v-if="$hasPower('removeOrderRelated')" style="margin: 0 3px"
                    ><a @click="handleUnbind(row.itemCode)">取消关联</a></span
                  >
                  <span v-if="$hasPower('orderRelatedDetail')" style="margin: 0 3px"
                    ><a @click="watchLink(row)">查看</a></span
                  >
                </template>
                <template v-else>
                  <span v-if="$hasPower('orderRelated')" style="margin: 0 3px"
                    ><a @click="handleBind(row.itemCode)">关联</a></span
                  >
                </template>
              </template>
            </vxe-table-column>
          </vxe-table>
          <div style="margin-top: 10px">
            <div class="toolbar" style="display: flex; justify-content: space-between">
              <div class="num">
                共 {{ total }} 条记录 第 {{ currentPage }} / {{ total ? Math.ceil(total / pageSize) : 1 }} 页
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
    <el-dialog :visible="progressVisible" top="50vh" width="600px" :show-close="false">
      <el-progress :percentage="percent" />
    </el-dialog>
  </div>
</template>

<script>
import TreeData from '../components/TreeData'
import Api from '@/api/model/inventory'
import statusList from '@/lib/paramList/statusList'
export default {
  name: 'Inventory',
  components: {
    TreeData
  },
  data() {
    return {
      loading: false,
      bimfishApp: null,
      progressVisible: false,
      percent: 0,
      filter: {},
      tableForm: {
        projectId: localStorage.getItem('projectId')
      },
      catergoryList: [
        { label: '建筑工程', value: 1 },
        { label: '机电设备及安装工程', value: 2 }
      ],
      statusList,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      timer: null
    }
  },
  watch: {
    'bimfishApp.areaDrawer.areaDrawTool': {
      handler: function (e) {
        console.log(e)
      },
      deep: true
    },
    percent(v) {
      console.log(v)
      if (v >= 100) {
        console.log('成功')
        this.percent = 100
        this.$message.success('操作成功')
        this.progressVisible = false
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },

  created() {
    this.refresh()
  },

  mounted() {},
  methods: {
    /*
     * @任务编号: 2522 || 树与模型交互,清单关联
     * @开发人员:申豪强
     * @日期:2020-03-20
     * @任务类型: 新代码
     */
    billChange(e) {
      this.$store.commit('bim/changeInventory', e)
    },
    getModal() {
      let area = this.bimfishApp.areaDrawer
      // 要上传的list
      let list = area.areaDrawTool.getComps()
    },
    async drawBIM() {
      await this.bimfishApp.initDrawArea()
      console.log(this.bimfishApp)
      let area = this.bimfishApp.areaDrawer
      // console.log(area.areaDrawTool.getComps())
      this.drawArea()
    },
    async drawArea() {
      await this.bimfishApp.drawArea()
    },
    // bim编辑
    editBIM() {},
    // 向模型中传递guid数组
    watchModal() {
      let guids = []
      let list = this.$refs.treeList.getCheckedNodes()
      if (list.length > 0) {
        guids = list.filter(item => item.guid).map(item => item.guid)
      }
      this.bimfishApp.hideAll()
      this.bimfishApp.show(guids)
    },
    // 获取模型构件guid
    getGuid() {
      this.bimfishApp.getComponentGuid((e, id) => {
        console.log(id)
        // 厕所：门:2566562;洗漱台：3021581；窗子：2566547
        // 卧室：门：2566553；窗子:2566546；
      })
    },
    // 加载3D视图
    load3dviewer(url) {
      let key = '465758F8f2B54E72b6956A8ba3625a73'
      let secret = '5De5712e99b0435AB47a41673B2B1F97faf51014C47041fB97cc12c1bEb7b185'
      this.bimfishApp = new BimfishApp('lo-viewer', key, secret, { MemoryLimited: true })
      this.bimfishApp.init(() => {
        this.bimfishApp.showModel([{ id: 3, modelUrl: location.origin + url }])
      })
    },
    async refresh() {
      let res = await Api.getInventoryList({
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
      let param = {
        projectId: localStorage.getItem('projectId'),
        componentList: componentList,
        itemCode: id
      }
      let res = await Api.componentBind(param)
      this.loading = false
      this.$message.success('关联成功')
      this.refresh()
    },
    watchLink(row) {
      // bug#1686 查看按钮
      this.$refs.BIM.showModelByGuids(row.componentIdList)
    },
    async getPercent() {
      this.timer = setInterval(async () => {
        const res = await Api.getPercent()
        this.percent = res.data || 100
        // this.percent += 10
        console.log(res)
      }, 1000)
      console.log(this.timer)
    },
    async autoMatch() {
      await Api.autoMatch({})
      this.progressVisible = true
      this.getPercent()
    },
    async handleUnbind(id) {
      let res = await Api.componentCancelBind(id)
      this.$message.success('取消关联成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.flex {
  display: flex;
  justify-content: space-between;
  aside:nth-child(1) {
    width: 80px;
    text-align: center;
  }
}

div.main {
  background-color: #f0f2f5;
  padding: 0;
  .task-list-wrap {
    height: 100%;
    display: flex;
    .aside {
      max-height: 800px;
      width: 400px;
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
      width: calc(100% - 400px);
      .model-show {
        height: 560px;
        padding: 20px;
        background-color: #fff;
      }
      .data-list {
        margin-top: 10px;
        padding: 20px;
        background-color: #fff;
      }
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
