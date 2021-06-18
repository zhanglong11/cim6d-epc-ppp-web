<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :md="14">
        <el-card class="box-card aside">
          <div slot="header" class="headerBox">
            <div>关联</div>
            <div>
              <el-button v-if="$hasPower('DrawingLibraryBuildLinkNode')" type="primary" @click="handleDraw()">
                关联图纸
              </el-button>
            </div>
          </div>
          <div>
            <div class="treeView">
              <el-input
                v-model="filterName"
                placeholder="请输入"
                style="width: 180px; margin-right: 10px"
                @keyup="searchEvent"
              >
              </el-input>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </div>
            <div><h4>批量添加单体</h4></div>
            <div class="buttons">
              <template v-if="$hasPower('DrawingLibraryBuildLinkAddNode')">
                <el-button @click="handleAddClick(2)">添加单体</el-button>
                <el-button @click="handleAddClick(3)">添加单元</el-button>
                <el-button @click="handleAddClick(4)">添加楼层</el-button>
                <el-button @click="handleAddClick(5)">添加户型</el-button>
              </template>
              <el-button v-if="$hasPower('DrawingLibraryBuildNodeDelete')" @click="handleDelete">删除</el-button>
              <el-button v-if="$hasPower('multipleNameEdit')" @click="handleMultipleChangeName"
                >批量修改房间名称</el-button
              >
            </div>
            <vxe-table
              ref="xTree"
              resizable
              keep-source
              row-id="id"
              :checkbox-config="{ labelField: 'label' }"
              :tree-config="treeConfig"
              :edit-config="{ trigger: 'click', mode: 'row', showStatus: true, expandAll: true }"
              :data="tableData"
              @cell-dblclick="handleEditNode"
            >
              <vxe-table-column
                type="checkbox"
                title="建筑结构"
                tree-node
                field="label"
                :edit-render="{ name: '$input' }"
              ></vxe-table-column>
              <!--              <vxe-table-column field="name" ></vxe-table-column>-->
              <vxe-table-column field="drawingUrl" title="关联图纸">
                <template #default="{ row }">
                  <a href="javascript:void(0);" @click="lookImg(row)">{{ row.type === 5 ? row.drawingName : '' }}</a>
                </template>
              </vxe-table-column>
              <vxe-table-column field="bimResourceName" title="关联BIM模型"></vxe-table-column>
              <vxe-table-column title="操作">
                <template #default="{ row }">
                  <template v-if="!row.isRoot">
                    <el-button v-if="!row.bimResourceId" type="text" @click="bindBimModel(row)">关联BIM模型</el-button>
                    <el-button v-else type="text" @click="unbindBimModel(row)">取消关联</el-button>
                  </template>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
        </el-card>
      </el-col>
      <el-col :md="10">
        <el-image style="width: 100%; height: 600px" :src="DrawImgUrl" :fit="fit">
          <div slot="error" class="image-slot">
            <div class="pictureArea">图片预览区</div>
          </div>
        </el-image>
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
          <el-button type="primary" :loading="monomerSaveLoading" @click="handleMonomerSave()">保存</el-button>
        </span>
      </el-dialog>
    </div>
    <!--批量添加单体 end-->
    <!--关联图纸 start-->
    <DrawDialog v-if="drawVisible" :visible="drawVisible" @close="drawVisible = false" @getTarget="getTarget">
    </DrawDialog>
    <!--关联图纸 end-->
    <BindBimModel :model="activeModel" :visible.sync="bindBimModelDialogVisible"></BindBimModel>
    <ChangeName v-if="changeNameVisible" :visible.sync="changeNameVisible" @submit="handleChangeSubmit"></ChangeName>
  </div>
</template>
<script>
import DrawDialog from '@/views/measureQuantity/DrawingLibrary/components/DrawDialog'
import ChangeName from '@/views/measureQuantity/components/ChangeName'
import Api from '../../api/measure'
import XEUtils from 'xe-utils'
import BindBimModel from '../components/BindBimModel'

export default {
  name: 'DrawingLibrary',
  components: {
    DrawDialog,
    BindBimModel,
    ChangeName
  },
  data() {
    // 这里存放数据
    return {
      treeConfig: {
        children: 'children',
        reserve: true
      },
      fit: 'fill',
      DrawImgUrl: '@/assets/images/empty.png',
      loading: false,
      dialogVisible: false,
      checkAll: false,
      /*上传图片*/
      uploadVisible: false,
      drawVisible: false,
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
      filterName: '',
      originData: [],
      form: {
        count: '',
        pid: '0',
        type: 0,
        ids: [],
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
      //所选中图纸的id
      drawIds: '',
      fileList: '',
      expandRows: '',
      monomerSaveLoading: false, //弹窗是否正在保存
      bindBimModelDialogVisible: false,
      activeModel: {},
      selectRoomIds: '', //批量修改时选择的房间id
      selectRoomNames: '',
      changeNameVisible: false //修改名称弹窗可见性
    }
  },
  created() {
    this.init()
    this.loading = true
    this.findList().then(data => {
      this.loading = false
      this.originData = data
      this.handleSearch()
    })
  },
  methods: {
    init() {
      this.getTreeListInfo()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /*过滤树形结构数据查询*/
    findList() {
      return new Promise(resolve => {
        setTimeout(() => {
          Api.getTreeListInfo(this.projectId).then(res => {
            let list = res.data || []
            let name = localStorage.getItem('projectName')
            let id = localStorage.getItem('projectId') + '123'
            list = [{ id: id, label: name, children: list, isRoot: true }]
            resolve(list)
          })
        }, 300)
      })
    },
    handleSearch() {
      console.log(this.originData)
      let filterName = XEUtils.toString(this.filterName).trim()
      if (filterName) {
        let options = { children: 'children' }
        let searchProps = ['label']
        this.tableData = XEUtils.searchTree(
          this.originData,
          item => {
            if (searchProps.some(key => XEUtils.toString(item[key]).indexOf(filterName) > -1)) {
              return item
            }
          },
          options
        )
        console.log(this.tableData)
        // 搜索之后默认全部展开子节点
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpansion(true)
        })
      } else {
        this.tableData = this.originData
      }
    },
    // 创建一个防反跳策略函数，调用频率间隔 500 毫秒
    searchEvent: XEUtils.debounce(
      function () {
        this.handleSearch()
      },
      500,
      { leading: false, trailing: true }
    ),

    /*关联图纸弹窗*/
    handleDraw() {
      let checked = this.$refs.xTree.getCheckboxRecords()
      let ids = this.$refs.xTree
        .getCheckboxRecords()
        .filter(item => item.id)
        .map(e => {
          return e.id
        })
      let expandRows = this.$refs.xTree.getTreeExpandRecords()
      this.expandRows = expandRows
      console.log('选中展开', expandRows)
      this.drawIds = ids
      // console.log(ids)
      // console.log(checked)
      if (checked.length) {
        this.drawVisible = true
      } else {
        this.$message.info('请先选择户型')
      }
    },
    //关联bim模型
    bindBimModel(row) {
      this.activeModel = row
      this.bindBimModelDialogVisible = true
    },
    async unbindBimModel(row) {
      await this.axios.construction.post('constructionDrawingLibrary/deleteBim', {
        ids: [row.id]
      })
      this.$message.success('取消关联成功')
      this.init()
    },
    lookImg(row) {
      // console.log(row)
      this.DrawImgUrl = row.drawingUrl
    },
    async getTarget(e) {
      console.log('tuzhi', e)
      this.fileList = {
        drawingUrl: e.checked.drawingFileUrl,
        drawingId: e.checked.id,
        ids: this.drawIds
        // name: data.fileName
      }
      let subRes = await Api.getDrawingLibraryUpdate(this.fileList)
      if (subRes.code === 200) {
        this.$message.success('关联成功')
        this.init()
        // console.log(this.expandRows)
        this.$refs.xTree.setTreeExpansion(this.expandRows, true)
        // this.$refs.xTree.setAllRowExpansion(true)
        // console.log('1111111',this.$refs.xTree.setAllRowExpansion())
        this.drawVisible = false
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.init()
    },
    handlePageSizeChange(pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.init()
    },
    reset() {
      // this.$refs.tableData.resetFields()
      // this.handlePageSizeChange(this.pageSize)
      this.filterName = ''
      this.$refs.xTree.setFilter('')
      // this.$refs.tableData.resetFields()
      this.init()
    },
    /*单体树形结构列表*/
    async getTreeListInfo() {
      let res = await Api.getTreeListInfo(this.projectId)
      this.tableData = res.data || []
      let name = localStorage.getItem('projectName')
      let projectId = localStorage.getItem('projectId') + '123'
      this.tableData = [{ id: projectId, label: name, children: this.tableData, isRoot: true }]
      // console.log( this.tableData)
    },

    /*单体弹窗*/
    handleAddClick(type) {
      // this.type = type
      this.form.type = type
      let checked = this.$refs.xTree.getCheckboxRecords()
      let ids = _.map(
        _.filter(checked, item => {
          return item.type === type - 1
        }),
        item => item.id
      )
      if (!ids.length && type !== 2) {
        this.$message.error('请先选择' + ['单体', '单元', '楼层', '户型'][type - 3])
        return false
      }
      if (type === 2) {
        this.dialogListInfo = this.dialogList[0]
      } else if (type === 3) {
        this.dialogListInfo = this.dialogList[1]
      } else if (type === 4) {
        this.dialogListInfo = this.dialogList[2]
      } else if (type === 5) {
        this.dialogListInfo = this.dialogList[3]
      }

      this.form.ids = ids
      this.dialogVisible = true
    },
    /*单体保存*/
    async handleMonomerSave() {
      this.monomerSaveLoading = true
      let res = await Api.getDrawingLibraryAdd(this.form).finally(() => (this.monomerSaveLoading = false))
      this.$message.success(res.message)
      this.dialogVisible = false
      this.form = {
        count: '',
        pid: '0',
        type: 0,
        underCount: '',
        projectId: localStorage.getItem('projectId')
      }
      this.init()
    },
    /*双击编辑节点*/
    handleEditNode(data, node) {
      console.log(data.row)
      this.open(data.row)
    },
    open(value) {
      this.$prompt('请输入节点的名字', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value.label,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let param = {
              ids: [value.id],
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
    // refresh() {
    //   this.getDrawingLibraryList(this.drawId)
    // },
    // async getDrawingLibraryList(id) {
    //   this.drawForm.ids = id
    //   let res = await Api.getDrawingLibraryList({
    //     ...this.drawForm,
    //     beginTime: this.drawForm.createTime[0] || '',
    //     endTime: this.drawForm.createTime[1] || ''
    //   })
    //   if (res.code === 200) {
    //     this.loading = false
    //     this.tableData = res.data.records || []
    //     this.total = res.data.total
    //   }
    // },
    /*全选功能*/
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.$refs.organizationData.setCheckedNodes(this.treeData)
      } else {
        this.$refs.organizationData.setCheckedKeys([])
      }
    },
    handleDelete() {
      let ids = this.$refs.xTree.getCheckboxRecords().map(item => item.id)
      if (ids.length) {
        this.axios.construction.post('constructionDrawingLibrary/deleteByIds', ids).then(res => {
          this.$message.success('删除成功')
          this.init()
        })
      } else {
        this.$message.info('请先选择需要删除的楼层')
      }
    },
    //修改户型
    handleMultipleChangeName() {
      let selectRoom = this.$refs.xTree.getCheckboxRecords().filter(item => item.type === 5)
      if (!selectRoom.length) {
        this.$message.error('请先选择房间')
        return
      }
      let expandRows = this.$refs.xTree.getTreeExpandRecords()
      this.expandRows = expandRows
      this.selectRoomIds = selectRoom.map(item => item.id)
      this.selectRoomNames = selectRoom.map(item => item.label)
      this.changeNameVisible = true
    },
    async handleChangeSubmit(data) {
      await Api.updateRootName({ idList: this.selectRoomIds, name: data.name })
      this.$message.success('修改成功')
      this.changeNameVisible = false
      await this.init()
      /*   this.$refs.xTree.setTreeExpansion(this.expandRows, true)
      this.$refs.xTree.setTreeExpand(this.expandRows, true)*/
    }
    // remove(row) {
    //   this.$confirm('确认删除该数据?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.axios.construction.post('constructionDrawingLibrary/delete/' + row.id).then(res => {
    //       this.$message.success('删除成功')
    //       this.refresh()
    //     })
    //   })
    // }
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
  .pictureArea {
    width: 100%;
    height: 600px;
    font-size: 32px;
    line-height: 600px;
    text-align: center;
    background: #ccc;
  }
  .headerBox {
    display: flex;
    justify-content: space-between;
  }
}
</style>
