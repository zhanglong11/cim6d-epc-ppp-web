<template>
  <el-dialog title="上传" :visible="visible" width="600px" top="10vh" @close="$emit('close')">
    <div class="formWrapper">
      <el-form ref="form" :inline="true" :model="form" :rules="rules">
        <div>
          <el-form-item label="图纸名字" label-width="100" prop="drawingName" style="margin-left: 25px">
            <el-input v-model="form.drawingName" placeholder="请输入图纸名字" style="width: 260px"> </el-input>
          </el-form-item>
          <el-form-item label="上传图纸" label-width="100" style="margin-left: 25px" prop="drawingFileId">
            <FileUploadWithImg
              v-model="form.drawingFileId"
              :multiple="false"
              :limit="1"
              :fileRecover="fileUrlList"
              :accept="['jpg', 'png']"
              :show="false"
              @fileName="e => (drawingName = e)"
            ></FileUploadWithImg>
            <!--            <FileEdit v-model="form.fileId"  />-->
          </el-form-item>
          <el-form-item label="样板间名字" label-width="100" style="margin-left: 20px">
            <el-input v-model="form.samepleRoomFileName" placeholder="请输入样板间名字" style="width: 260px">
            </el-input>
          </el-form-item>
          <el-form-item label="样板间" label-width="100" style="margin-left: 45px">
            <FileUploadWithImg
              v-model="form.samepleRoomFileId"
              :multiple="false"
              :limit="1"
              :fileRecover="fileUrlList1"
              :accept="['jpg', 'png']"
              :show="false"
              @fileName="e => (samepleRoomFileName = e)"
            ></FileUploadWithImg>
          </el-form-item>

          <el-form-item label="图纸面积(㎡)" label-width="100" prop="drawingArea" style="margin-right: 0px">
            <el-input v-model="form.drawingArea" placeholder="请输入图纸面积" style="width: 260px"> </el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="100" prop="remark" style="margin-left: 60px">
            <el-input v-model="form.remark" placeholder="备注" style="width: 260px"> </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import FileUploadWithImg from '_c/FileUploadWithImg/index'
export default {
  name: 'UploadDialog',
  components: { FileUploadWithImg },
  props: {
    visible: {},
    drawId: {},
    fileList: {}
  },

  data() {
    return {
      drawingName: '',
      samepleRoomFileName: '',
      form: {
        drawingFileId: [],
        drawingName: '',
        drawingArea: '',
        samepleRoomFileId: [],
        samepleRoomFileName: ''
      },
      rules: {
        drawingName: [{ required: true, message: '图纸名称不能为空', trigger: 'blur' }],
        drawingFileId: [{ required: true, message: '请选择上传图纸', trigger: 'blur' }],
        drawingArea: [{ required: true, message: '图纸面积不能为空', trigger: 'blur' }]
      },
      fileUrlList: [],
      fileUrlList1: []
    }
  },
  watch: {
    fileList(val, oldval) {
      // console.log(111, JSON.parse(JSON.stringify(val)))
      this.form = { ...val }
      this.form.drawingFileId = [val.drawingFileId]
      this.form.samepleRoomFileId = [val.samepleRoomFileId]
      this.fileUrlList = [
        {
          id: val.drawingFileId,
          fileName: val.drawingName,
          fileUrl: val.drawingFileUrl
        }
      ]
      // this.form.samepleRoomFileId = val.samepleRoomId.split(',')
      if (val.samepleRoomFileId) {
        this.fileUrlList1 = [
          {
            id: val.samepleRoomFileId,
            fileName: val.samepleRoomFileName,
            fileUrl: val.sampleRoomUrl
          }
        ]
      }

      // console.log(111, this.form)
    }
  },
  created() {},
  methods: {
    handleChange(file, fileList) {
      console.log(fileList)
      // if (fileList.length > 0) {
      //   this.form.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的csv文件
      // }
    },
    handleSubmit() {
      this.$refs.form.validate().then(() => {
        this.$emit('submit', this.form)
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
