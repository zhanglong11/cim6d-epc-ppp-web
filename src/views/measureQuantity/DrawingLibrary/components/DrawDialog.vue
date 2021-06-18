<template>
  <el-dialog title="" :visible="visible" width="1024px" top="10vh" @close="$emit('close')">
    <div class="container">
      <el-row :gutter="20">
        <el-col :md="24">
          <div class="task-list">
            <div class="headContainer">
              <div class="formWrapper">
                <el-form ref="filterForm" :inline="true" :model="form">
                  <div>
                    <el-form-item label="" label-width="0" prop="content" style="margin-right: 20px">
                      <el-input v-model="form.search" placeholder="创建人" style="width: 300px">
                        <i slot="suffix" class="el-icon-search"></i>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" label-width="100px" prop="createTime" style="margin-right: 20px">
                      <el-date-picker
                        v-model="form.createTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="请选择"
                        end-placeholder="请选择"
                        style="width: 300px"
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
              </div>
            </div>
            <vxe-table
              ref="xTable"
              border
              :data="tableData"
              :edit-config="{ trigger: 'manual', mode: 'row' }"
              :loading="loading"
            >
              <vxe-table-column type="radio" width="30px"></vxe-table-column>
              <vxe-table-column title="序号" type="seq" width="50px"></vxe-table-column>
              <vxe-table-column title="图纸面积（㎡）" field="drawingArea" width="120px"></vxe-table-column>
              <vxe-table-column title="图纸名称" field="drawingName"></vxe-table-column>
              <vxe-table-column title="创建人" field="creatorName" width="100px"></vxe-table-column>
              <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
              <vxe-table-column title="备注" field="remark"></vxe-table-column>
              <!--              <vxe-table-column title="操作">-->
              <!--                <template slot-scope="{ row }">-->
              <!--                  <el-button type="text" @click="handleUpload(row.id)">编辑</el-button>-->
              <!--                  <el-button type="text" @click="remove(row.id)">删除</el-button>-->
              <!--                  <el-button v-if="row.status === 0" type="text" @click="handleStart(row)">启用</el-button>-->
              <!--                  <el-button v-if="row.status === 1" type="text" @click="handleEnd(row)">停用</el-button>-->
              <!--                  <el-button type="text" @click="lookImg(row)">查看</el-button>-->
              <!--                </template>-->
              <!--              </vxe-table-column>-->
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
    </div>
    <footer slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
    <vxe-modal v-model="showDetails" title="查看图片" width="600" height="600" resize>
      <img :src="DrawImgUrl" alt="" style="width: 100%" />
    </vxe-modal>
  </el-dialog>
</template>
<script>
import Api from '../../api/measure'
export default {
  name: 'DrawDialog',

  props: {
    visible: {}
  },

  data() {
    // 这里存放数据
    return {
      loading: false,
      showDetails: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      drawId: '',
      DrawImgUrl: '',
      /*图纸列表*/
      tableData: [],
      form: {
        beginTime: '',
        createTime: '',
        endTime: '',
        page: 1,
        rows: 10,
        search: '',
        status: 1,
        projectId: localStorage.getItem('projectId')
      },
      checkedVal: '',
      fileList: ''
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.getDrawingList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    lookImg(row) {
      this.selectRow = row
      this.DrawImgUrl = row.drawingFileUrl
      this.showDetails = true
    },
    async handleUploadEmit(data) {
      console.log(data)
      let drawingRes = await Api.getImgUrl(data.fileIds[0])
      let samepleRes = ''
      if (data.samepleRoomFileId[0]) {
        samepleRes = await Api.getImgUrl(data.samepleRoomFileId[0])
      }
      this.fileList = {
        drawingArea: data.drawingArea,
        drawingFileUrl: drawingRes.data.fileUrl,
        drawingFileId: data.drawingFileId[0],
        drawingName: data.drawingName,
        samepleRoomFileId: data.samepleRoomFileId[0],
        samepleRoomFileName: data.samepleRoomFileName,
        sampleRoomUrl: samepleRes.data.fileUrl,
        remark: data.remark
      }
      console.log(this.drawId)
      this.drawId
        ? await Api.getDrawingUpdate({ ...this.fileList, id: this.drawId })
        : await Api.getDrawingAdd(this.fileList)
      // let subRes = await Api.getDrawingAdd(this.fileList)
      // if (subRes.code === 200) {
      this.$message.success('添加成功')
      this.refresh()
      this.uploadVisible = false
      // }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.form.page = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.currentPage = 1
      this.form.page = 1
      this.pageSize = pageSize
      this.form.rows = pageSize
      this.refresh()
    },
    reset() {
      this.$refs.tableData.resetFields()
      this.handlePageSizeChange(this.pageSize)
    },
    async getDrawingList() {
      let res = await Api.getDrawingList(this.form)
      this.tableData = res.data.records || []
      this.total = res.data.total
      console.log(this.tableData)
    },

    remove(row) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.getDrawingDelete(row).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    },
    submit() {
      let selectRow = this.$refs.xTable.getRadioRecord()
      this.$emit('getTarget', { checked: selectRow })
      // this.$emit('update:visible', false)
      this.$emit('close')
    },
    /*启用*/
    handleStart(row) {
      this.axios.construction.get('construction/drawing/enable/' + row.id).then(res => {
        this.$message.success('已启用')
        this.refresh()
      })
    },
    /*停用*/
    handleEnd(row) {
      this.axios.construction.get('construction/drawing/disable/' + row.id).then(res => {
        this.$message.success('已停用')
        this.refresh()
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
