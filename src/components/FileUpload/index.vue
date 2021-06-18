<template>
  <div>
    <el-upload
      class="upload"
      :headers="headers"
      :action="axios.file.defaults.baseURL + '/file/commonFile/upload'"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      multiple
      :limit="limit"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :disabled="disabled"
    >
      <el-button v-if="!disabled" size="small" :disabled="disabled">上传文件</el-button>
      <div v-if="!disabled" slot="tip" class="el-upload__tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'FileUpload',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    fileRecover: Array,
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      fileList: [
        /*{ name: 'img1.jpeg', url: '' },
        { name: 'img2.jpeg', url: '' },
        { name: 'img3.jpeg', url: '' }*/
      ],
      headers: {
        'x-access-token': getToken()
      },
      fileIds: []
    }
  },
  watch: {
    fileRecover(val) {
      for (let i = 0; i < val.length; i++) {
        this.fileList.push({
          name: val[i].fileName,
          url: val[i].fileUrl,
          response: { data: val[i].id }
        })
        this.fileIds.push(val[i].id)
      }
      this.$emit('input', this.fileIds)
    }
  },
  methods: {
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      //console.log(file)
      //console.log(fileList)
      let fileId = file.response.data
      let index = null
      for (let i = 0; i < this.fileIds.length; i++) {
        if (this.fileIds[i] === fileId) {
          index = i
          break
        }
      }
      if (index !== null) {
        this.fileIds.splice(index, 1)
      }
      this.$emit('input', this.fileIds)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.fileIds.push(response.data)
        this.$emit('input', this.fileIds)
      } else {
        this.$message.error(response.message)
      }
    },
    handleError(err, file, fileList) {
      console.log(err)
    }
  }
}
</script>

<style scoped lang="less">
.upload {
  width: 400px;
}
</style>
<style lang="less">
.upload {
  .el-upload {
    text-align: left;
  }
}
</style>
