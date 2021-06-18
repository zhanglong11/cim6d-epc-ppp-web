<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :md="7">
        <el-card class="box-card aside">
          <div slot="header" class="clearfix">
            <span>图纸库</span>
          </div>
          <div>
            <div class="treeView">
              <el-input
                v-model="filterText"
                placeholder="请输入"
                style="width: 180px; margin-right: 10px; margin-bottom: 10px"
              >
              </el-input>
              <el-button type="primary" icon="el-icon-search" @click="$refs.organizationData.filter(filterText)"
                >搜索</el-button
              >
              <el-button
                icon="el-icon-refresh-left"
                @click="
                  () => {
                    filterText = ''
                    $refs.organizationData.filter('')
                  }
                "
                >重置</el-button
              >
            </div>
            <div><h4>批量添加单体</h4></div>
            <div class="buttons">
              <el-button @click="handleAddClick(2)">添加单体</el-button>
              <el-button @click="handleAddClick(3)">添加单元</el-button>
              <el-button @click="handleAddClick(4)">添加楼层</el-button>
              <el-button @click="handleAddClick(5)">添加户型</el-button>
            </div>

            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-tree
              ref="organizationData"
              :data="treeData"
              show-checkbox
              node-key="id"
              :props="defaultProps"
              :expand-on-click-node="false"
              :highlight-current="true"
              :check-on-click-node="true"
              :filter-node-method="filterNode"
              @check="getCheckedNode"
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
                    <el-input v-model="drawForm.search" placeholder="单体/楼层/创建人" style="width: 300px">
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
              <el-button type="primary" size="small" style="margin: 0px 0 20px 0" @click="handleUpload"
                >上传图纸</el-button
              >
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
            <vxe-table-column title="单体" field="monomerName"></vxe-table-column>
            <vxe-table-column title="单元" field="unit"></vxe-table-column>
            <vxe-table-column title="楼层" field="storey">
              <!--              <template slot-scope="{ row }">-->
              <!--                <span>{{ urgencyDegree.find(item => item.value === row.urgencyDegree).label }}</span>-->
              <!--              </template>-->
            </vxe-table-column>
            <vxe-table-column title="户型" field="house"></vxe-table-column>
            <vxe-table-column title="图纸" field="dwagingId"></vxe-table-column>
            <vxe-table-column title="创建人" field="creatorName"></vxe-table-column>
            <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
            <vxe-table-column title="备注" field="remark"></vxe-table-column>
            <vxe-table-column title="操作">
              <template slot-scope="{ row }">
                <el-button type="text">编辑</el-button>
                <el-button type="text" @click="remove(row)">删除</el-button>
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
      </el-col>
    </el-row>
    <!--批量添加单体 start-->
    <div v-if="dialogListInfo">
      <el-dialog :title="dialogListInfo.title" :visible.sync="dialogVisible" width="28%">
        <el-form ref="formRef" :model="form" :inline="true">
          <el-form-item :label="dialogListInfo.label">
            <el-input
              v-model="form.count"
              :placeholder="dialogListInfo.placeholder"
              autocomplete="off"
              class="form-input"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item v-if="form.type === 4" :label="dialogListInfo.label2">
            <el-input
              v-model="form.underCount"
              :placeholder="dialogListInfo.placeholder2"
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
    <!--批量添加单体 end-->
    <!--上传图纸-->
    <UploadDialog
      v-if="uploadVisible"
      :visible="uploadVisible"
      @close="uploadVisible = false"
      @submit="handleUploadEmit"
    ></UploadDialog>
  </div>
</template>
<script>
import UploadDialog from '../../components/UploadDialog' // 上传组件
import Api from '../../api/measure'
export default {
  name: 'DrawingLibrary',
  components: {
    UploadDialog
  },
  data() {
    // 这里存放数据
    return {
      loading: false,
      dialogVisible: false,
      checkAll: false,
      /*上传图片*/
      uploadVisible: false,
      dialogListInfo: {},
      dialogList: [
        {
          title: '添加单体',
          label: '新增单体数量',
          placeholder: '请输入单体数量'
        },
        {
          title: '添加单元',
          label: '新增单元数量',
          placeholder: '请输入单元数量'
        },
        {
          title: '添加楼层',
          label: '新增地上楼层数量',
          placeholder: '请输入地上楼层数量',
          label2: '新增地下楼层数量',
          placeholder2: '新增地下楼层数量'
        },
        {
          title: '添加户型',
          label: '新增户型数量',
          placeholder: '请输入户型数量'
        }
      ],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      form: {
        count: '',
        pid: '0',
        type: 0,
        underCount: '',
        projectId: localStorage.getItem('projectId')
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      formRules: {
        underCount: [{ required: true, message: '请输入单体数量', trigger: 'blur' }]
      },
      /*图纸列表*/
      tableData: [],
      drawForm: {
        beginTime: '',
        createTime: '',
        endTime: '',
        ids: [],
        page: 0,
        rows: 10,
        search: ''
      },
      // type: '',
      projectId: localStorage.getItem('projectId'),
      drawId: '',
      fileList: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getTreeListInfo()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //上传文件弹窗
    handleUpload() {
      if (this.drawId) {
        this.uploadVisible = true
        this.fileList = {
          drawingUrl: '',
          dwagingId: '',
          ids: [],
          name: ''
        }
      } else {
        this.$message('请先勾选右侧需要户型')
      }
    },
    async handleUploadEmit(data) {
      console.log(data)
      let res = await Api.getImgUrl(data.fileIds[0])
      if (res.code === 200) {
        this.fileList = {
          drawingUrl: res.data.fileUrl,
          dwagingId: data.fileIds[0],
          ids: this.drawId
          // name: data.fileName
        }
      }
      let subRes = await Api.getDrawingLibraryUpdate(this.fileList)
      if (subRes.code === 200) {
        this.$message.success('上传成功')
        this.uploadVisible = false
      }
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
    /*单体树形结构列表*/
    async getTreeListInfo() {
      let res = await Api.getTreeListInfo(this.projectId)
      this.treeData = res.data || []
      // console.log(this.treeData)
    },

    /*单体弹窗*/
    handleAddClick(type) {
      // this.type = type
      this.form.type = type
      let check = this.$refs.organizationData.getCheckedKeys()
      console.log(check)
      if (type === 2) {
        this.dialogListInfo = this.dialogList[0]
      } else if (type === 3) {
        this.dialogListInfo = this.dialogList[1]
      } else if (type === 4) {
        this.dialogListInfo = this.dialogList[2]
      } else if (type === 5) {
        this.dialogListInfo = this.dialogList[3]
      }
      this.dialogVisible = true
    },
    /*单体保存*/
    async handleMonomerSave() {
      let res = await Api.getDrawingLibraryAdd(this.form)
      this.$message.success(res.message)
      this.dialogVisible = false
      this.init()
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
              ids: [value.key],
              name: instance.inputValue
            }
            /*修改节点图纸节点名称*/
            Api.getDrawingLibraryUpdate(param).then(res => {
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
    handleNodeClick(node, data) {
      this.drawId = this.$refs.organizationData.getCheckedKeys()
      this.getDrawingLibraryList(this.drawId)
    },
    /*点击选中节点*/
    getCheckedNode(node, data) {
      console.log(node)
      this.drawId = this.$refs.organizationData.getCheckedKeys()
      this.getDrawingLibraryList(this.drawId)
    },
    refresh() {
      this.getDrawingLibraryList(this.drawId)
    },
    async getDrawingLibraryList(id) {
      this.drawForm.ids = id
      let res = await Api.getDrawingLibraryList({
        ...this.drawForm,
        beginTime: this.drawForm.createTime[0] || '',
        endTime: this.drawForm.createTime[1] || ''
      })
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.records || []
        this.total = res.data.total
      }
    },
    /*全选功能*/
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.$refs.organizationData.setCheckedNodes(this.treeData)
      } else {
        this.$refs.organizationData.setCheckedKeys([])
      }
    },
    remove(row) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.construction.post('constructionDrawingLibrary/delete/' + row.id).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
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
</style>
