<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :md="7">
        <el-card class="box-card aside">
          <div slot="header" class="clearfix">
            <span>标准库</span>
          </div>
          <div>
            <div class="treeView">
              <el-input v-model="filterText" placeholder="请输入" style="width: 180px; margin-right: 10px"> </el-input>
              <el-button type="primary" icon="el-icon-search" @click="$refs.tree.filter(filterText)">搜索</el-button>
              <el-button
                icon="el-icon-refresh-left"
                @click="
                  () => {
                    filterText = ''
                    $refs.tree.filter('')
                  }
                "
                >重置</el-button
              >
            </div>
            <!--            <div><h4>批量添加单体</h4></div>-->
            <div class="buttons">
              <el-button v-if="$hasPower('MeasurementStandardAdd')" @click="handleAddClick(1)">添加规范</el-button>
              <el-button v-if="$hasPower('MeasurementStandardDelete')" @click="handleDeleteStandard"
                >删除规范</el-button
              >
              <el-button v-if="$hasPower('MeasurementItemsAdd')" @click="handleAddClick(2)">添加测量项</el-button>
              <el-button v-if="$hasPower('MeasurementItemsDelete')" @click="handleDelete">删除测量项</el-button>
            </div>

            <el-tree
              ref="organizationData"
              :data="treeData"
              show-checkbox
              node-key="id"
              :props="defaultProps"
              :expand-on-click-node="false"
              :highlight-current="true"
              :check-on-click-node="true"
              check-strictly
              @node-click="getCheckedNode"
              @check-change="parentModules"
            >
              <span slot-scope="{ node, data }">
                <span @dblclick="handleEditNode(node, data)">{{ data.label }}</span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :md="17">
        <div class="task-list">
          <div class="headContainer">
            <div class="formWrapper">
              <el-form ref="filterForm" :inline="true" :model="drawForm">
                <div>
                  <el-form-item label="" label-width="0" prop="content" style="margin-right: 20px">
                    <el-input v-model="drawForm.search" placeholder="测量指标/创建人" style="width: 300px">
                      <i slot="suffix" class="el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="创建时间" label-width="100px" prop="createTime" style="margin-right: 20px">
                    <el-date-picker
                      v-model="drawForm.createTime"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="请选择"
                      end-placeholder="请选择"
                      style="width: 400px"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button-group>
                      <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                      <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
                    </el-button-group>
                  </el-form-item>
                </div>
              </el-form>
              <el-button
                v-if="$hasPower('MeasurementItemInfoAdd')"
                type="primary"
                size="small"
                style="margin: 0px 0 20px 0"
                @click="add(-1)"
                >新建</el-button
              >
            </div>
          </div>
          <vxe-table
            ref="xTable"
            border
            :data="tableData"
            :edit-rules="validRules"
            :show-header-overflow="true"
            column-min-width="140px"
            :edit-config="{ trigger: 'click', mode: 'row' }"
            :loading="loading"
          >
            <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
            <vxe-table-column
              title="测量指标"
              field="measureIndex"
              :edit-render="{ name: '$input' }"
            ></vxe-table-column>
            <vxe-table-column title="合格标准" field="leftValue" :edit-render="{ type: 'default' }">
              <template #edit="{ row }">
                <vxe-input v-model="row.leftValue" size="mini" style="width: 40px; display: inline-block"></vxe-input>-
                <vxe-input v-model="row.rightValue" size="mini" style="width: 40px; display: inline-block"></vxe-input>
              </template>
              <template #default="{ row }">[{{ row.leftValue || 0 }},{{ row.rightValue || 0 }}]</template>
            </vxe-table-column>
            <vxe-table-column title="单位" field="unit" :edit-render="{ name: '$input' }">
              <!--              <template slot-scope="{ row }">-->
              <!--                <span>{{ urgencyDegree.find(item => item.value === row.urgencyDegree).label }}</span>-->
              <!--              </template>-->
            </vxe-table-column>
            <vxe-table-column title="创建人" field="creatorName">
              <!--              <template v-slot="{ row }">{{ row.creatorName }}</template>-->
            </vxe-table-column>
            <vxe-table-column title="创建时间" field="createTime" formatter="ymd">
              <!--              <template v-slot:edit="{ row }">-->
              <!--                <el-date-picker v-model="row.createTime" type="date" format="yyyy/MM/dd"></el-date-picker>-->
              <!--              </template>-->
              <!--              <template v-slot="{ row }">{{ row.createTime }}</template>-->
            </vxe-table-column>
            <vxe-table-column title="备注" field="remark" :edit-render="{ name: '$input' }"></vxe-table-column>
            <vxe-table-column title="操作">
              <template #default="{ row }">
                <template v-if="$refs.xTable.isActiveByRow(row) && $hasPower('MeasurementItemInfoEdit')">
                  <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                  <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
                </template>
                <template v-else>
                  <vxe-button v-if="$hasPower('MeasurementItemInfoEdit')" @click="editRowEvent(row)">编辑</vxe-button>
                  <vxe-button v-if="$hasPower('MeasurementItemInfoDelete')" @click="remove(row)">删除</vxe-button>
                </template>
              </template>
            </vxe-table-column>
          </vxe-table>
          <!--          <div style="margin-top: 10px">-->
          <!--            <div class="toolbar" style="display: flex;justify-content:space-between">-->
          <!--              <div class="num">-->
          <!--                共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页-->
          <!--                <el-button type="text primary" class="el-icon-refresh" @click="refresh(false)"></el-button>-->
          <!--              </div>-->
          <!--              <el-pagination-->
          <!--                class="pagination"-->
          <!--                :total="total"-->
          <!--                :current-page.sync="currentPage"-->
          <!--                :page-size="pageSize"-->
          <!--                :page-sizes="[10, 20, 50, 100]"-->
          <!--                layout="sizes, prev, pager, next, jumper"-->
          <!--                @current-change="handlePageChange"-->
          <!--                @size-change="handlePageSizeChange"-->
          <!--              />-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </el-col>
    </el-row>
    <div>
      <!--       添加规范/测量项 start-->
      <div v-if="dialogListInfo">
        <el-dialog :title="dialogListInfo.title" :visible.sync="dialogVisible" width="28%">
          <el-form ref="formRef" :model="form" :inline="true">
            <el-form-item :label="dialogListInfo.label">
              <el-input
                v-model="form.name"
                :placeholder="dialogListInfo.placeholder"
                autocomplete="off"
                class="form-input"
                style="width: 300px"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleMonomerSave()">保存</el-button>
          </span>
        </el-dialog>
      </div>
      <!--       添加规范/测量项 end-->
    </div>
  </div>
</template>
<script>
import { toTreeData } from '@/utils/treeData'
// import toTree from '@/utils/toTree'
import Api from '@/views/measureQuantity/api/measure'
export default {
  name: 'StandardLibrary',
  data() {
    // 这里存放数据
    return {
      loading: false,
      dialogVisible: false,
      checkAll: false,
      /*上传图片*/
      uploadVisible: false,
      treeData: [],
      dialogListInfo: {},
      dialogList: [
        {
          title: '添加规范',
          label: '新增规范名称',
          placeholder: '请输入规范名称'
        },
        {
          title: '添加测量项',
          label: '新增测量项名称',
          placeholder: '请输入测量项名称'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      form: {
        name: '',
        pid: '0',
        sorts: 0,
        type: 0,
        // page: 1,
        projectId: localStorage.getItem('projectId')
        // rows: 10
      },
      drawForm: {
        beginTime: '',
        endTime: '',
        search: '',
        standardLibraryId: '',
        createTime: ''
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      formRules: {
        underCount: [{ required: true, message: '请输入单体数量', trigger: 'blur' }]
      },
      //表格验证
      validRules: {
        measureIndex: [{ required: true, message: '必填' }],
        leftValue: [{ required: true, message: '必填' }],
        rightValue: [{ required: true, message: '必填' }],
        unit: [{ required: true, message: '必填' }]
      },
      tableData: [],
      tableForm: {},
      uniqueValue: '' //最后拿到的唯一选择的id
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getStandardLibraryList()
    },
    refresh() {
      this.getStandardMeasureList(this.drawForm.standardLibraryId)
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
    reset() {
      this.$refs.tableData.resetFields()
      this.handlePageSizeChange(this.pageSize)
    },

    /*添加规范、测量项弹窗*/
    handleAddClick(type) {
      this.form.type = type
      this.form.name = ''
      if (type === 1) {
        this.dialogListInfo = this.dialogList[0]
        this.dialogVisible = true
        this.form.pid = 0
      } else if (type === 2) {
        this.dialogListInfo = this.dialogList[1]
        let check = this.$refs.organizationData.getCheckedKeys().toString()
        let type = this.$refs.organizationData.getCheckedNodes()
        // console.log(type)
        if (type.length && type[0].code === 1) {
          this.dialogVisible = true
          this.form.pid = check
        } else {
          this.$message.info('请先选择规范')
        }
      }
    },
    handleDelete() {
      let id = this.$refs.organizationData.getCheckedKeys().toString()
      console.log(id)
      if (!id) {
        this.$message.info('请先选择删除的测量项')
      } else {
        this.getStandardLibraryDelete(id)
      }
    },
    handleDeleteStandard() {
      let id = this.$refs.organizationData.getCheckedKeys().toString()
      console.log(id)
      if (!id) {
        this.$message.info('请先选择删除的规范项')
      } else {
        this.getStandardLibraryDelete(id)
      }
    },
    /*规范、测量项保存*/
    async handleMonomerSave() {
      let res = await Api.getStandardLibraryAdd(this.form)
      this.$message.success(res.message)
      this.dialogVisible = false
      this.init()
    },
    /*规范、测量项列表*/
    async getStandardLibraryList() {
      let res = await Api.getStandardLibraryList(this.projectId)
      this.treeData = toTreeData(res.data, 'id', 'pid', 'name', 'type')
      console.log(this.treeData)
    },
    /*标准库删除*/
    async getStandardLibraryDelete(id) {
      let res = await Api.getStandardLibraryDelete(id)
      if (res.code === 200) {
        this.$message.success('删除成功')
      } else {
        this.$message.success(res.message)
      }
      this.init()
    },
    /*测量指标-列表*/
    async getStandardMeasureList(id) {
      this.drawForm.standardLibraryId = id
      let res = await Api.getStandardMeasureList({
        ...this.drawForm,
        beginTime: this.drawForm.createTime[0] || '',
        endTime: this.drawForm.createTime[1] || ''
      })
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data || []
        // this.total = res.data.total
      }
    },
    /*双击编辑节点*/
    handleEditNode(data, node) {
      this.open(data)
    },
    open(value) {
      this.$prompt('请输入节点的名字', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value.label,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let param = {
              id: [value.key].toString(),
              name: instance.inputValue
            }
            /*修改节点图纸节点名称*/
            Api.getStandardLibraryEdit(param).then(res => {
              if (res.code === 200) {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '提交中...'
                setTimeout(() => {
                  done()
                  setTimeout(() => {
                    instance.confirmButtonLoading = false
                    this.init()
                  }, 300)
                }, 2000)
              }
            })
          } else {
            done()
          }
        }
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: '节点的名字: ' + value
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    /*点击选中节点*/
    getCheckedNode(data) {
      // let id= this.$refs.organizationData.getCheckedKeys().toString()
      // console.log(id)
      // this.getStandardMeasureList(id)
    },
    //节点选择状态发生改变时
    parentModules(data, checkbox, node) {
      if (checkbox) {
        this.$refs.organizationData.setCheckedKeys([data.id])
        this.uniqueValue = this.$refs.organizationData.getCheckedKeys()
        this.getStandardMeasureList(this.uniqueValue.toString())
      } else {
        this.uniqueValue = this.$refs.organizationData.getCheckedKeys()
        if (this.uniqueValue.length === 0) {
          this.uniqueValue = ''
        }
      }
    },
    //测量指标-添加
    async add(row) {
      // let id = this.uniqueValue.toString()
      let type = this.$refs.organizationData.getCheckedNodes()
      if (type.length && type[0].code === 2) {
        let { row: newRow } = await this.$refs.xTable.insertAt(row)
        // newRow.createTime = this.$store.getters.createTime
        newRow.creatorName = this.$store.getters.name || 'admin'
        await this.$refs.xTable.setActiveCell(newRow)
      } else {
        this.$message.info('请先选择测量项')
      }
    },
    //测量指标-删除
    remove(row) {
      Api.getStandardMeasureDelete(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.$refs.xTable.remove(row)
        }
      })
    },
    //测量指标-编辑
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
      // console.log(row)
    },
    //测量指标-保存
    saveRowEvent(row) {
      this.tableForm = row
      this.$refs.xTable.validate().then(() => {})
      // console.log(this.tableData)
      this.tableForm.standardLibraryId = this.uniqueValue.toString()
      // console.log(row.id)
      if (!row.id) {
        Api.getStandardMeasureAdd(this.tableForm).then(res => {
          this.$refs.xTable.clearActived().then(() => {
            this.loading = true
            setTimeout(() => {
              this.loading = false
              this.$message.success('保存成功')
            }, 300)
            this.refresh()
          })
        })
      } else {
        Api.getStandardMeasureEdit(this.tableForm).then(res => {
          this.$refs.xTable.clearActived().then(() => {
            this.loading = true
            setTimeout(() => {
              this.loading = false
              this.$message.success('保存成功')
            }, 300)
            this.refresh()
          })
        })
      }
    },
    //测量指标-列表-取消
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        xTable.revertData(row)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .treeView {
    margin-bottom: 15px;
  }
  .buttons {
    margin: 10px 0;
  }
}
/deep/ .el-tree-node {
  .is-leaf + .el-checkbox .el-checkbox__inner {
    display: inline-block;
  }
  /deep/ .el-checkbox .el-checkbox__inner {
    display: none;
  }
}
</style>
