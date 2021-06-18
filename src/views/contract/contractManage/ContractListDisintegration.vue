<template>
  <div class="indexWrapper">
    <div class="wrapper">
      <div class="leftBlock">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>计量单元划分</span>
            <el-button type="text" style="float: right; padding: 3px 0"></el-button>
          </div>
          <div>
            <div>
              <div>
                <el-input
                  v-model="filterText"
                  placeholder="输入关键字进行过滤"
                  style="width: 200px; margin-right: 10px"
                >
                </el-input>
                <el-button type="primary" icon="el-icon-search" @click="$refs.tree.filter(filterText)">搜索</el-button>
                <el-button @click="filterText = ''">重置</el-button>
              </div>
              <div style="margin: 10px 0">
                <!-- <el-button @click="handleUpMove">上移</el-button>
                <el-button @click="handleDownMove">下移</el-button>
                <el-button @click="handleUpLevel">升级</el-button>
                <el-button @click="handleDownLevel">降级</el-button>-->
              </div>
              <!--
                   /**
                   任务名称：TASK#2792 3月4号注释
                   开发人员：崔洛宜
                   日期：2020-03-04
                   任务类型：注释
                   **/
              -->
              <!--
                  /**
                   任务名称：TASK#2826 3月5号注释
                   开发人员：崔洛宜
                   日期：2020-03-31
                   任务类型：注释(添加点击事件)
                   **/
              -->
              <!--              <el-tree-->
              <!--                ref="tree"-->
              <!--                :props="defaultProps"-->
              <!--                current-node-key="1"-->
              <!--                :data="treeData"-->
              <!--                node-key="space_id"-->
              <!--                :filter-node-method="filterNode"-->
              <!--                highlight-current-->
              <!--                :default-expand-all="true"-->
              <!--                :expand-on-click-node="false"-->
              <!--                @node-click="handleNodeClick"-->
              <!--              >-->
              <div slot-scope="{ node, data }" class="custom-tree-node">
                <div>
                  <i v-if="data.isCategory" class="el-icon-folder"></i>
                  <i v-else class="el-icon-document"></i>
                  <span class="treeContent">{{ node.data.title }}</span>
                </div>
                <span class="el-ic">
                  <i class="el-icon-folder-add" title="添加同级节点" @click="addThisLevel(node, data)"></i>
                  <i
                    v-if="data.status === 0"
                    class="el-icon-document-add"
                    title="添加下级节点"
                    @click="addNextLevel(node, data)"
                  ></i>
                  <i class="el-icon-delete" title="删除此节点" @click="deleteThisLevel(node, data)"></i>
                </span>
              </div>
              <!--              </el-tree>-->
              <el-tree
                ref="tree"
                class="unit-tree"
                :props="defaultProps"
                current-node-key="1"
                :data="treeData"
                node-key="space_id"
                :filter-node-method="filterNode"
                highlight-current
                :default-expand-all="true"
                :expand-on-click-node="false"
                :render-content="renderContent"
                @node-click="handleNodeClick"
              />
            </div>
          </div>
        </el-card>
      </div>
      <div class="rightBlock">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>清单分解</span>
            <el-button type="text" style="float: right; padding: 3px 0"></el-button>
          </div>
          <div>
            <el-button v-if="selectTreeId" type="primary" @click="handleSelectList">选择清单项目</el-button>
          </div>
          <div style="margin: 10px 0">
            <!--
                /**
               任务名称：TASK#2827 3月6号注释
               开发人员：崔洛宜
               日期：2020-03-31
               任务类型：注释(添加验证)
               **/
            -->
            <vxe-table
              ref="xTable"
              border
              :data="selectTreeId ? tableData : []"
              auto-resize
              keep-source
              :edit-rules="validRules"
              :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
            >
              <!--
                  /**
                   任务名称：TASK#2826 3月5号注释
                   开发人员：崔洛宜
                   日期：2020-03-31
                   任务类型：注释(修改字段)
                   **/
              -->
              <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
              <vxe-table-column field="itemCode" title="项目编码" width="120" />
              <vxe-table-column field="itemName" title="项目名称" width="120" />
              <vxe-table-column field="itemFeature" title="项目特征" width="120" />
              <vxe-table-column field="unit" title="单位" width="80" />
              <!--
                   /**
                   任务名称：BUG1444/合同清单-总承包合同-合同清单分解-选择清单项目：选择好清单后，点击确定，清单中的部分字段值不显示
                   开发人员：崔洛宜
                   日期：2020-03-31
                   BUG类型：测试人员发现的研发自测未通过引起的BUG
                   **/
              -->
              <vxe-table-column field="contractUnitPrice" title="合同单价(元)" width="120" />
              <vxe-table-column field="contractQuantity" title="合同数量" width="120" />
              <vxe-table-column field="updateUnitPrice" title="变更后单价(元)" width="150" />
              <!--
                  /**
                   任务名称：TASK#2827 3月6号注释
                   开发人员：崔洛宜
                   日期：2020-03-31
                   任务类型：注释(添加列)
                   **/
              -->
              <vxe-table-column field="updateQuantity" title="变更后数量" width="120" />
              <vxe-table-column field="decomposingResidueQuantity" title="分解剩余量" width="120">
                <!--                <template v-slot="{ row }">-->
                <!--                  <span>{{-->
                <!--                    (-->
                <!--                      (row.updateQuantity ? row.updateQuantity : row.contractQuantity) - row.decomposingQuantity-->
                <!--                    ).toFixed(2)-->
                <!--                  }}</span>-->
                <!--                </template>-->
              </vxe-table-column>
              <!--
                  /**
                 任务名称：TASK#2828 3月7号注释
                 开发人员：崔洛宜
                 日期：2020-03-31
                 任务类型：注释(修改列字段)
                 **/
              -->
              <!-- <vxe-table-column
                field="decomposingQuantity"
                title="分解量"
                width="120"
                :edit-render="{
                  name: 'input',
                  attrs: { type: 'number' }
                }"
              />-->
              <vxe-table-column
                field="decomposingQuantity"
                title="分解量"
                width="120"
                :edit-render="{
                  name: '$input',
                  props: { type: 'number' },
                  events: { change: handleInputChange }
                }"
              />
              <!-- <vxe-table-column
                field="decomposingQuantity"
                title="分解量"
                width="120"
                :edit-render="{ type: 'default' }"
              >
                <template v-slot:edit="{ row }">
                  <el-input-number
                    v-model="row.decomposingQuantity"
                    :controls="true"
                    :max="row.contractQuantity"
                    :min="0"
                  ></el-input-number>
                </template>
              </vxe-table-column>-->
              <vxe-table-column field="totalPrice" title="总价(元)" width="100">
                <template #default="{ row }">
                  <span>{{
                    (
                      (row.updateUnitPrice ? row.updateUnitPrice : row.contractUnitPrice) * row.decomposingQuantity
                    ).toFixed(2)
                  }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="catergory" title="所属分类" width="120" />
              <vxe-table-column title="操作" width="150px">
                <template #default="{ row }">
                  <template v-if="$refs.xTable.isActiveByRow(row)">
                    <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                    <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
                  </template>
                  <template v-else>
                    <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
                    <vxe-button @click="handleDelete(row.id)">删除</vxe-button>
                  </template>
                </template>
              </vxe-table-column>
            </vxe-table>
            <div style="margin-top: 10px">
              <div class="toolbar" style="display: flex; justify-content: space-between">
                <div class="num">
                  共 {{ total }} 条记录 第 {{ currentPage }} / {{ total ? Math.ceil(total / pageSize) : 1 }} 页
                  <el-button type="text primary" class="el-icon-refresh" @click="() => refresh()"></el-button>
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
        </el-card>
      </div>
    </div>
    <ul v-if="showContextMenu" class="contextMenu" :style="{ top: top + 'px', left: left + 'px' }">
      <li>添加同级节点</li>
      <li>添加子级节点</li>
      <li>删除此节点</li>
    </ul>
    <div class="footerButton">
      <el-button @click="handleCancel">返回</el-button>
    </div>
    <ListDialog
      v-if="listSelectVisible"
      :contractId="id"
      :visible="listSelectVisible"
      :selectRowIds="selectRowIds"
      @close="listSelectVisible = false"
      @submit="handleListEmit"
    ></ListDialog>
    <el-dialog v-if="addVisible" title="新建" :visible="addVisible" width="30%" @close="addVisible = false">
      <el-form ref="addForm" :inline="true" :model="addForm">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空', trigger: 'blur' }]">
          <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            addVisible = false
            $refs.addForm.resetFields()
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ListDialog from './components/ListDialog'
import Api from '@/api/contract/contractManage'
export default {
  name: 'ContractListDisintegration',
  components: { ListDialog },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      showContextMenu: false,
      top: 100,
      left: 200,
      listSelectVisible: false,
      addVisible: false,
      addForm: {},
      pid: '',
      selectTreeId: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      selectRowIds: [],
      treeData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      /**
       任务名称：TASK#2827 3月6号注释
       开发人员：崔洛宜
       日期：2020-03-31
       任务类型：注释(添加验证)
       **/
      validRules: {
        /**
         任务名称：TASK#2828 3月7号注释
         开发人员：崔洛宜
         日期：2020-03-31
         任务类型：注释(修改列验证)
         **/
        decomposingQuantity: [{ required: true, message: '请输入分解剩余量' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    let { id } = this.$route.params
    this.id = id
    this.getTreeData()
    document.querySelector('body').addEventListener('click', () => {
      this.showContextMenu = false
    })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTreeData() {
      /**
       任务名称：TASK#2792 3月4号注释
       开发人员：崔洛宜
       日期：2020-03-04
       任务类型：注释
       **/
      Api.getContractMeteringUnitDivisionTreeData({
        projectId: this.projectId,
        contractId: this.id
      }).then(res => {
        if (res.code === 200) {
          this.treeData = res.data
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },

    refresh() {
      Api.getInventoryDecomposeList({
        page: this.currentPage,
        rows: this.pageSize,
        projectId: this.projectId,
        contractId: this.id,
        meteringUnitId: this.selectTreeId
      }).then(res => {
        this.tableData = res.data.records.map(r => {
          // r.decomposingQuantity = r.decomposingQuantity ? r.decomposingQuantity : r.decomposingResidueQuantity
          return r
        })
        this.selectRowIds = res.data.records
        this.total = res.data.total
      })
    },
    /**
     任务名称：TASK#2792 3月4号注释
     开发人员：崔洛宜
     日期：2020-03-04
     任务类型：注释
     **/
    handleAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          Api.addThisLevel({
            name: this.addForm.name,
            parentId: this.pid,
            contractId: this.id,
            projectId: this.projectId
          }).then(res => {
            this.addVisible = false
            this.$refs.addForm.resetFields()
            this.getTreeData()
          })
        }
      })
    },
    /**
     任务名称：TASK#2792 3月4号注释
     开发人员：崔洛宜
     日期：2020-03-04
     任务类型：注释
     **/
    addThisLevel(node, data) {
      this.addVisible = true
      this.pid = data.pid
    },
    /**
     任务名称：TASK#2792 3月4号注释
     开发人员：崔洛宜
     日期：2020-03-04
     任务类型：注释
     **/
    addNextLevel(node, data) {
      this.addVisible = true
      this.pid = data.id
    },
    /**
     任务名称：TASK#2792 3月4号注释
     开发人员：崔洛宜
     日期：2020-03-04
     任务类型：注释
     **/
    deleteThisLevel(node, data) {
      this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.deleteContractMeteringUnitDivisionById(data.id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTreeData()
            } else {
              this.$message.error('未知错误,请重试')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
    handleUpMove() {
      let id = this.$refs.tree.getCurrentKey()
      console.log(id)
    },
    handleContextMenu(e, data, node, ss) {
      this.showContextMenu = true
      const outLeft = document.querySelector('.main-container').offsetLeft
      this.left = e.clientX - outLeft + 20
      this.top = e.clientY
    },
    /*handleNodeClick() {
      this.showContextMenu = false
    },*/
    handleNodeClick(data, node) {
      if (data.children && data.children.length) {
        this.selectTreeId = null
        return
      }
      this.selectTreeId = data.id
      this.refresh(true)
    },
    handleSelectList() {
      if (this.selectTreeId) {
        this.listSelectVisible = true
      } else {
        this.$message.warning('请选择计量单元')
        return false
      }
    },
    handleListEmit(data) {
      /**
       任务名称：TASK#2792 3月4号注释
       开发人员：崔洛宜
       日期：2020-03-04
       任务类型：注释
       **/
      let list = data.map(item => {
        return {
          ...item,
          projectId: this.projectId,
          contractId: this.id,
          meteringUnitId: this.selectTreeId
        }
      })
      Api.updateInventoryDecompose(list).then(res => {
        this.listSelectVisible = false
        this.refresh(true)
      })
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    async saveRowEvent(row) {
      let result = await this.validEvent()
      if (result) {
        this.$refs.xTable.clearActived().then(() => {
          if (row.decomposingQuantity < 0 || row.decomposingResidueQuantity < 0) {
            this.$message.error('请正确填写')
            this.$refs.xTable.setActiveRow(row)
            return
          }
          Api.setDecomposingQuantity({
            decomposingQuantity: row.decomposingQuantity,
            id: row.id
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('设置成功')
              this.refresh(true)
            } else {
              this.$refs.xTable.setActiveRow(row)
            }
          })
        })
      }
    },
    async validEvent() {
      const errMap = await this.$refs.xTable.validate().catch(errMap => errMap)
      if (errMap) {
        //this.$message.error(errMap[Object.keys(errMap)[0]].rule.message)
        return false
      } else {
        return true
      }
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class={`tree-item ${data.children && data.children.length ? 'disabled' : ''}`}>
          <div class="label">
            {data.isCategory ? <i class="el-icon-folder" /> : <i class="el-icon-document" />}
            <span class="treeContent">{data.title}</span>
          </div>
          <div class="btn">
            {data.pid !== '0' ? (
              <i
                class="el-icon-folder-add"
                title="添加同级节点"
                onClick={() => {
                  this.addThisLevel(node, data)
                }}
              />
            ) : null}
            {data.status !== 0 ? null : (
              <i
                class="el-icon-document-add"
                title="添加下级节点"
                onClick={() => {
                  this.addNextLevel(node, data)
                }}
              />
            )}
            {data.pid !== '0' ? (
              <i
                class="el-icon-delete"
                title="删除此节点"
                onClick={() => {
                  this.deleteThisLevel(node, data)
                }}
              />
            ) : null}
          </div>
        </div>
      )
    },
    getDisabled(data) {
      if (data.children && data.children.length) {
        return true
      }
      // let childList = []
      // let getChild = childData => {
      //   childData.children &&
      //     childData.children.map(r => {
      //       childList.push(r)
      //       if (r.children && r.children.length) {
      //         getChild(r)
      //       }
      //     })
      // }
      // getChild(data)
      // return childList.some(r => r.status !== 0)
    },
    handleDelete(id) {
      /**
       任务名称：BUG1444/合同清单-总承包合同-合同清单分解-选择清单项目：选择好清单后，点击确定，清单中的部分字段值不显示
       开发人员：崔洛宜
       日期：2020-03-31
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      Api.deleteDecomposingQuantity(id).then(res => {
        this.$message.success('删除成功')
        this.refresh(true)
      })
    },
    handleCancel() {
      this.$router.back()
    },
    handleInputChange({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      // row.decomposingResidueQuantity = (
      //   (row.updateQuantity ? row.updateQuantity : row.contractQuantity) - row.decomposingQuantity
      // ).toFixed(2)
      if (row.decomposingResidueQuantity < 0) {
        this.$message.error('分解剩余量不能小于0')
        // row.decomposingResidueQuantity = 0
        // row.decomposingQuantity = (row.updateQuantity ? row.updateQuantity : row.contractQuantity).toFixed(2)
        return false
      }
      if (row.decomposingQuantity < 0) {
        this.$message.error('不能小于0')
        row.decomposingQuantity = 0
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  .leftBlock {
    min-width: 400px;
  }
  .rightBlock {
    flex: 1;
    margin-left: 20px;
    overflow: auto;
  }
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
.contextMenu {
  background-color: #5a5e66;
  width: 120px;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  position: absolute;
  li {
    height: 30px;
    line-height: 30px;
  }
}
/**
任务名称：TASK#2792 3月4号注释
开发人员：崔洛宜
日期：2020-03-04
任务类型：注释
**/
.tree_w {
  padding: 20px 30px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  /*color: #4386c6;*/
  .treeContent {
    max-width: 150px;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    overflow: hidden;
  }
}
.unit-tree {
  /deep/.tree-item {
    &.disabled {
      cursor: not-allowed;
      color: #dcdfe6;
      .btn {
        > i {
          cursor: pointer;
          color: #606266;
        }
      }
    }
    display: flex;
    justify-content: space-between;
    width: 100%;
    &:hover .btn {
      display: inline-flex;
    }
    > div > i {
      display: inline-block;
      width: 16px;
      height: 16px;
    }
    > .btn {
      display: none;
      justify-content: space-around;
      > i {
        font-size: 18px;
        font-weight: 600;
        margin-left: 10px;
      }
    }
  }
}

.el-ic {
  display: none;
  i,
  span {
    padding: 0 5px;
    font-size: 18px;
    font-weight: 600;
  }
}

.el-tree-node__content {
  height: 38px;
}

.el-tree-node__expand-icon {
  /* color: #428bca;*/
  /*padding: 10px 10px 0px 10px !important;*/
}

.el-tree-node__content:hover .el-ic {
  /*color: #428bca !important;*/
  display: inline-block;
}

.el-tree-node__content:hover {
  font-weight: bold;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content :hover {
  .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
  }
  /*background-color: #3998d9;*/
  .custom-tree-node {
    font-weight: bold;
  }
  .el-tree-node__expand-icon {
    font-weight: bold;
  }
}

.el-dialog__body {
  .upload-container .image-preview .image-preview-wrapper img {
    height: 100px;
  }
  .el-dialog .el-collapse-item__wrap {
    padding-top: 0px;
  }
  .spatial_img {
    .el-collapse-item__wrap {
      margin-bottom: 0;
      padding-top: 0px;
    }
  }

  .upload-container .image-preview .image-preview-wrapper {
    width: 120px;
  }

  .upload-container .image-preview .image-preview-action {
    line-height: 100px;
    height: 100px;
  }
}
</style>
