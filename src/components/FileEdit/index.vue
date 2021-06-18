<!--
* @任务编号: 2824 || 文件上传组件开发
* @开发人员:张龙
* @日期:2020-03-07
* @任务类型:全新代码
-->
<template>
  <div>
    <el-upload
      ref="upload"
      class="upload"
      :action="action"
      :headers="headers"
      name="file"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :show-file-list="!isButton"
      :auto-upload="autoUpload"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :multiple="multiple"
      :accept="accept"
    >
      <div v-if="isButton" style="text-align: center">
        <el-button slot="trigger" size="small" type="primary">{{ btnText }}</el-button>
      </div>
      <div v-else style="text-align: left">
        <el-button slot="trigger" size="small" type="primary">{{ btnText }}</el-button>
        <div slot="tip" class="el-upload__tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import api from '@/api/file'
import axios from '@/utils/axios'
export default {
  name: 'FileEdit',
  props: {
    // 已上传文件ids
    value: {
      type: String,
      default: null
    },
    // 额外参数
    // 上传地址
    action: {
      type: String,
      default: axios.file.defaults.baseURL + '/file/commonFile/upload'
    },
    isButton: {
      type: Boolean,
      default: false
    },
    // 多选
    multiple: {
      type: Boolean,
      default: true
    },
    type: {
      //  文件模块类型
      type: Number
    },
    // 验证
    raw: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    },
    // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    accept: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: '上传文件'
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
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
          this.fileList.map(e => e.id)
        )
        if (newFileIds.length) {
          api.getFileList(newFileIds).then(res => {
            res.data.forEach(e => (e.name = e.fileName))
            this.fileList = _.unionBy(res.data.concat(this.fileList), 'id')
          })
        }
      }
    }
  },
  methods: {
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
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    async beforeUpload(file) {
      if (this.accept) {
        if (!_.some(this.accept.split(','), string => file.name.toLowerCase().includes(string.toLowerCase()))) {
          this.$message.error('文件格式错误，只允许' + this.accept)
          return Promise.reject()
        }
      }
    },
    handleError(error) {
      this.$message.error(error.status + '：' + error.message)
    },
    submit() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="less"></style>
