<!--
  * @任务编号: task2686 || 图片上传功能
  * @开发人员:张龙
  * @日期:2020-03-24
  * @任务类型: 新代码
  -->
<template>
  <div>
    <el-upload
      ref="upload"
      class="image-upload"
      :action="action"
      :headers="headers"
      :file-list="fileList"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :disabled="disabled"
      multiple
    >
      <i v-if="!disabled" class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import api from '@/api/file'
import axios from '@/utils/axios'
export default {
  name: 'ImageUpload',
  props: {
    // 已上传文件ids
    value: {
      type: String,
      default: null
    },
    // 上传地址
    action: {
      type: String,
      default: axios.file.defaults.baseURL + '/file/commonFile/upload'
    },
    // 多选
    multiple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [], //用来在el-upload组件中展示的文件数组
      headers: {
        'x-access-token': getToken()
      }
    }
  },
  watch: {
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
    async getFileList() {
      let arr = this.value ? this.value.split(',') : []
      let res = await api.getFileList(arr)
      this.fileList = res.data.map(item => {
        let obj = {
          name: item.fileName,
          url: item.fileUrl,
          id: item.id
        }
        return obj
      })
    },
    handleRemove(file, fileList) {
      if (file?.status === 'success') {
        // let arr = this.fileList
        // let arr
        // if (this.fileList.length === 1) {
        //   arr = []
        // } else {
        //   arr = this.fileList.filter(item => item.id !== file.id)
        // }
        // this.$emit('input', arr.map(item => item.id).join(','))
        _.remove(this.fileList, { id: file.id })
      }
    },
    handleChange(file, fileList) {
      // this.fileList = fileList
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 200) {
        // if (this.multiple) {
        // this.fileList= fileList.map(item => {
        //   let obj = {
        //     name: item.name,
        //     url: item.url,
        //     id: item.id ? item.id : item.response.data
        //   }
        //   return obj
        // })
        // }
        // this.$emit('input', this.fileList.map(item => item.id).join(','))
        if (this.multiple) this.fileList.push(file)
        // 当fileList push file 或赋值fileList时不存在跳动现象
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
