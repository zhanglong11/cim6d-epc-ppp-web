<template>
  <el-dialog width="500px" top="10vh" title="上传文件附件" :visible="visible" @close="cancelDialog">
    <el-form ref="baseInfoForm" :model="form" :rules="formRule">
      <el-upload
        class="upload-demo"
        drag
        :action="action"
        :headers="headers"
        :file-list="fileList"
        :on-success="handleSuccess"
        :multiple="multiple"
        :accept="accept"
        :auto-upload="autoUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-form>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import axios from '@/utils/axios'
export default {
  name: 'ImportDialog',
  components: {},
  props: {
    id: {},
    rowId: {
      type: String,
      default: ''
    },
    visible: {},
    action: {
      type: String,
      default: axios.file.defaults.baseURL + '/file/commonFile/upload'
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: '.xls,.xlsx'
    },
    // 多选
    multiple: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      fileList: [],
      headers: {
        'x-access-token': getToken()
      },
      form: {},
      formRule: {
        name: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  watch: {
    fileList: {
      handler: function (n, o) {
        console.log(n)
      }
    },
    value: {
      handler: function (n, e) {
        if (typeof n === 'string') {
          this.getFileList()
        }
      },
      immediate: true
    }
  },
  methods: {
    refresh() {},
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    beforeUpload(file) {
      if (this.raw) {
        if (this.accept) {
          if (!_.some(this.accept.split(','), string => file.name.includes(string))) {
            this.$message.error('文件格式错误，只允许' + this.accept)
            this.fileList.splice(-1, 1)
            return false
          } else {
            this.$emit('input', file)
          }
        } else {
          this.$emit('input', file)
        }
        return false
      }
    },
    handleError(error) {
      this.$message.error(error.status + '：' + error.message)
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 200) {
        if (this.multiple) {
          this.fileList = fileList.map(item => {
            let obj = {
              name: item.name,
              id: item.id ? item.id : item.response.data
            }
            return obj
          })
        } else {
          this.fileList = [{ name: file.name, id: res.data }]
        }
      }
    },
    submit() {
      this.$refs.baseInfoForm.validate()
      // console.log(1, this.form)
      this.$emit(
        'getFile',
        this.fileList.map(item => item.id),
        this.rowId
      )
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less"></style>
