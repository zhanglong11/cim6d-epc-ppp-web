<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :md="24">
        <div class="task-list">
          <div class="headContainer">
            <div class="formWrapper">
              <el-form ref="filterForm" :inline="true" :model="form">
                <div>
                  <el-form-item label="" label-width="0" prop="content" style="margin-right: 20px">
                    <el-input v-model="form.drawingName" placeholder="图纸名称" style="width: 300px">
                      <i slot="suffix" class="el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="创建时间" label-width="100px" prop="createTime" style="margin-right: 20px">
                    <!--                    <el-date-picker-->
                    <!--                      v-model="form.createTime"-->
                    <!--                      type="datetimerange"-->
                    <!--                      range-separator="至"-->
                    <!--                      start-placeholder="请选择"-->
                    <!--                      end-placeholder="请选择"-->
                    <!--                      style="width: 400px"-->
                    <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
                    <!--                    ></el-date-picker>-->
                    <DateRange
                      v-model="form.createTime"
                      :startTime.sync="form.startTime"
                      :endTime.sync="form.endTime"
                    />
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
                v-if="$hasPower('DrawingLibraryAdd')"
                type="primary"
                size="small"
                style="margin: 0px 0 20px 0"
                @click="handleUpload()"
                >新建</el-button
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
            <vxe-table-column title="图纸面积（㎡）" field="drawingArea"></vxe-table-column>
            <vxe-table-column title="图纸名称" field="drawingName">
              <template slot-scope="{ row }">
                <span style="cursor: pointer; color: #00a6ff" @click="handleLookImg(row.drawingFileUrl)">{{
                  row.drawingName
                }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column title="样板间" field="sampleRoomUrl">
              <template slot-scope="{ row }">
                <span style="cursor: pointer; color: #00a6ff" @click="handleLookImg(row.sampleRoomUrl)">{{
                  row.samepleRoomFileName
                }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column title="创建人" field="creatorName"></vxe-table-column>
            <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
            <vxe-table-column title="备注" field="remark"></vxe-table-column>
            <vxe-table-column title="操作">
              <template slot-scope="{ row }">
                <el-button v-if="$hasPower('DrawingLibraryEdit')" type="text" @click="handleUpload(row.id)"
                  >编辑</el-button
                >
                <el-button v-if="$hasPower('DrawingLibraryDelete')" type="text" @click="remove(row.id)">删除</el-button>
                <el-button
                  v-if="row.status === 0 && $hasPower('DrawingLibraryUpdate')"
                  type="text"
                  @click="handleStart(row)"
                  >启用</el-button
                >
                <el-button
                  v-if="row.status === 1 && $hasPower('DrawingLibraryUpdate')"
                  type="text"
                  @click="handleEnd(row)"
                  >停用</el-button
                >
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
    <!--上传图纸-->
    <UploadDialog
      v-if="uploadVisible"
      :id="drawId"
      :visible="uploadVisible"
      :fileList="fileList"
      @close="uploadVisible = false"
      @submit="handleUploadEmit"
    ></UploadDialog>
    <!--图纸库图片弹窗 start-->
    <el-dialog
      title="图纸展示"
      :visible.sync="drawingVisible"
      width="1400px"
      style="margin: 0 auto; text-align: center"
    >
      <el-image :src="lookImgUrl" :fit="fit" style="max-width: 1200px; max-height: 700px; overflow: auto">
        <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
      </el-image>
    </el-dialog>
    <!--图纸库图片弹窗 end-->
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
      //图纸库显示
      drawingVisible: false,
      lookImgUrl: '',
      fit: 'scale-down',
      /*上传图片*/
      uploadVisible: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      drawId: '',
      /*图纸列表*/
      tableData: [],
      form: {
        beginTime: '',
        startTime: '',
        createTime: '',
        endTime: '',
        page: 1,
        rows: 10,
        drawingName: '',
        projectId: localStorage.getItem('projectId')
      },
      fileList: null
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh(isFirst = false) {
      if (isFirst) {
        this.form.page = 1
      }
      this.getDrawingList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //上传文件弹窗
    handleUpload(id) {
      this.drawId = id
      if (id) {
        this.uploadVisible = true
        Api.getDrawingDetail(id).then(res => {
          this.fileList = { ...res.data }
        })
      } else {
        this.uploadVisible = true
      }
    },
    //查看图纸库图片
    handleLookImg(url) {
      this.drawingVisible = true
      this.lookImgUrl = url
    },
    async handleUploadEmit(data) {
      console.log(data)
      let drawingRes = await Api.getImgUrl(data.drawingFileId[0])
      let samepleRes = ''
      if (data.samepleRoomFileId[0]) {
        await Api.getImgUrl(data.samepleRoomFileId[0]).then(res => {
          samepleRes = res.data.fileUrl
        })
      }
      this.fileList = {
        drawingArea: data.drawingArea,
        drawingFileUrl: drawingRes.data.fileUrl,
        drawingFileId: data.drawingFileId[0],
        drawingName: data.drawingName,
        samepleRoomFileId: data.samepleRoomFileId[0],
        samepleRoomFileName: data.samepleRoomFileName,
        sampleRoomUrl: samepleRes,
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
      this.pageSize = pageSize
      this.form.rows = pageSize
      this.refresh()
    },
    reset() {
      this.form = {
        beginTime: '',
        startTime: '',
        createTime: '',
        endTime: '',
        page: 1,
        rows: 10,
        drawingName: '',
        projectId: localStorage.getItem('projectId')
      }
      this.refresh()
    },

    async getDrawingList() {
      let res = await Api.getDrawingList(this.form)
      this.tableData = res.data.records || []
      // console.log(this.tableData)
      this.total = res.data.total
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
