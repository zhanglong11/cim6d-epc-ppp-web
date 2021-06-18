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
    value: {},
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
    /*
     * @任务编号:bug fix
     * @开发人员:张龙
     * @日期:2020-03-27
     * @任务类型: 修改代码
     */
    btnText: {
      type: String,
      default: '上传文件'
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 1
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
      handler: function (n, o) {
        console.log(n)
      }
    }
  },
  methods: {
    async getFileList() {
      let arr = this.value ? this.value.split(',') : ['1']
      let res = await api.getFileList(arr)
      this.fileList = res.data.map(item => {
        let obj = {
          name: item.fileName,
          id: item.id
        }
        return obj
      })
    },
    handleRemove(file, fileList) {
      if (file?.status === 'success') {
        this.fileList = this.fileList.filter(item => item.id !== file.id)
        this.$emit('input', this.fileList.map(item => item.id).join(','))
      }
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
          this.fileList = [{ name: file.name, id: res.data, file: file }]
        }
        console.log(this.fileList[0].file.raw)
        this.$emit('input', this.fileList[0].id, this.fileList[0].file.raw, this.fileList[0].name)
        // this.$emit('input', {
        //   id: this.fileList[0].id,
        //   fileName: this.fileList[0].name,
        //   file: this.fileList[0].file
        // })
      }
    },
    submit() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="less"></style>
