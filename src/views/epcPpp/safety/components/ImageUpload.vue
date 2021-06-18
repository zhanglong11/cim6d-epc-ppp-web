<template>
  <div>
    <el-upload
      class="image-upload"
      :action="action"
      :file-list="fileList"
      list-type="picture-card"
      :headers="headers"
      accept="image/*"
      :auto-upload="autoUpload && !raw"
      :on-preview="handlePictureCardPreview"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :limit="limit"
      :on-exceed="isLimit"
      multiple
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="预览" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/utils/axios'
import { getToken } from '@/utils/auth'
import api from '@/api/file'
export default {
  name: 'ImageUpload',
  props: {
    // 上传地址
    action: {
      type: String,
      default: axios.file.defaults.baseURL + '/file/commonFile/upload'
    },
    value: {
      type: String,
      required: true
    },
    raw: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    limit: {}
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      headers: {
        'x-access-token': getToken()
      }
    }
  },
  watch: {
    fileList: {
      deep: true,
      handler() {
        if (this.raw) {
          this.$emit('input', this.multiple ? this.fileList.map(e => e.raw) : this.fileList[0].raw)
        } else {
          const val = this.fileList
            .filter(e => e?.response?.data || e.id)
            .map(e => e.id || e.response.data)
            .join(',')
          this.$emit('input', val)
        }
      }
    },
    value: {
      immediate: true,
      handler() {
        let newFileIds = _.difference(
          this.value.split(','),
          this.fileList.map(e => e.id || e?.response?.data)
        )
        if (newFileIds.length) {
          api.getFileList(newFileIds).then(res => {
            res.data.forEach(e => {
              e.name = e.fileName
              e.url = e.fileUrl
            })
            this.fileList = _.unionBy(res.data.concat(this.fileList), 'id')
          })
        }
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleSuccess(res, file, fileList) {
      if (!this.raw) {
        file.id = file.response.data
      }
      if (this.multiple) {
        this.fileList = fileList
      } else {
        this.fileList = [file]
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    isLimit() {
      this.$message.error(`最大允许上传个数为 ${this.limit}`)
      return
    }
  }
}
</script>

<style lang="less">
.image-upload {
  .el-upload-list__item {
    width: 122px;
    height: 122px;
  }
  .el-upload.el-upload--picture-card {
    width: 122px;
    height: 122px;
    line-height: 122px;
  }
}
</style>
